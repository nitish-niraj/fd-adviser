/* ========================================
   FD Data — Calculator + Comparison Logic
   ======================================== */

const FDData = (() => {
  let banksData = null;
  const DEFAULT_REFERENCE_PRINCIPAL = 100000;
  const LIVE_RATES_SOURCE_URL = 'https://r.jina.ai/http://www.bankbazaar.com/fixed-deposit-rate.html';
  const LIVE_RATES_CACHE_KEY = 'fd_live_rates_cache_v2';
  const LIVE_RATES_DATA_CACHE_KEY = 'fd_live_rates_payload_v2';

  let liveRatesMeta = {
    status: 'idle',
    source: null,
    fetchedAt: null,
    updatedBanks: 0,
    mode: 'local',
    note: '',
  };

  /**
   * Load FD rates from JSON file.
   */
  async function loadRates() {
    if (banksData) return banksData;

    try {
      const resp = await fetch('./data/fd-rates.json');
      const data = await resp.json();
      banksData = Array.isArray(data?.banks) ? data.banks : [];

      await refreshRatesFromWebIfNeeded();
      return banksData;
    } catch (err) {
      console.error('[FDData] Failed to load rates:', err);
      return [];
    }
  }

  function normalizeBankKey(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\bstate bank of india\b/g, 'sbi')
      .replace(/\bsmall finance bank\b/g, 'sfb')
      .replace(/\b(fixed deposit|fd|interest|rate|rates|p\.a\.|p\.a|per annum)\b/g, ' ')
      .replace(/[^a-z0-9]/g, '');
  }

  function isPlausibleRate(rate) {
    const value = Number(rate);
    return Number.isFinite(value) && value >= 3 && value <= 11;
  }

  function parseLiveRates(rawText) {
    const text = String(rawText || '');
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const parsed = new Map();

    const rangePattern = /^([A-Za-z0-9&().,'\-\s]{3,}?)\s+(\d+(?:\.\d+)?)%\s*[-–]\s*(\d+(?:\.\d+)?)%/;
    const uptoPattern = /^([A-Za-z0-9&().,'\-\s]{3,}?)\s+(?:up to|upto)\s+(\d+(?:\.\d+)?)%/i;

    lines.forEach((line) => {
      let bankName = null;
      let topRate = null;

      const rangeMatch = line.match(rangePattern);
      if (rangeMatch) {
        bankName = rangeMatch[1];
        topRate = Math.max(Number(rangeMatch[2]), Number(rangeMatch[3]));
      } else {
        const uptoMatch = line.match(uptoPattern);
        if (uptoMatch) {
          bankName = uptoMatch[1];
          topRate = Number(uptoMatch[2]);
        }
      }

      if (!bankName || !isPlausibleRate(topRate)) return;

      const canonical = normalizeBankKey(bankName);
      if (!canonical || canonical.length < 3) return;

      const existing = parsed.get(canonical);
      if (!existing || topRate > existing.topRate) {
        parsed.set(canonical, {
          bankName: bankName.replace(/\s+/g, ' ').trim(),
          topRate: Math.round(topRate * 100) / 100,
        });
      }
    });

    return parsed;
  }

  function getBankMatchingKeys(bank) {
    const keys = new Set();
    const nameKey = normalizeBankKey(bank?.name);
    const idKey = normalizeBankKey(bank?.id);

    if (nameKey) keys.add(nameKey);
    if (idKey) keys.add(idKey);

    if (/sbi/.test(nameKey)) keys.add('sbi');
    if (/hdfc/.test(nameKey)) keys.add('hdfc');
    if (/utkarsh/.test(nameKey)) keys.add('utkarshsfb');
    if (/suryoday/.test(nameKey)) keys.add('suryodaysfb');
    if (/jana/.test(nameKey)) keys.add('janasfb');
    if (/\bausfb\b|^au/.test(nameKey)) keys.add('ausfb');

    return [...keys].filter(Boolean);
  }

  function findLiveRateForBank(bank, liveRatesMap) {
    const keys = getBankMatchingKeys(bank);
    if (!keys.length) return null;

    for (const key of keys) {
      if (liveRatesMap.has(key)) {
        return liveRatesMap.get(key);
      }
    }

    const mapEntries = [...liveRatesMap.entries()];
    for (const key of keys) {
      const partial = mapEntries.find(([liveKey]) => key.includes(liveKey) || liveKey.includes(key));
      if (partial) return partial[1];
    }

    return null;
  }

  function applyLiveRateToBank(bank, liveRate) {
    if (!bank || !Array.isArray(bank.fd_rates) || bank.fd_rates.length === 0) return false;
    if (!isPlausibleRate(liveRate?.topRate)) return false;

    const currentTop = Math.max(...bank.fd_rates.map(entry => Number(entry.rate)).filter(Number.isFinite));
    if (!Number.isFinite(currentTop)) return false;

    const deltaRaw = liveRate.topRate - currentTop;
    const delta = Math.max(-2.5, Math.min(2.5, deltaRaw));

    if (Math.abs(delta) < 0.05) return false;

    bank.fd_rates = bank.fd_rates.map((entry) => {
      const base = Number(entry.rate);
      const seniorSpread = Number.isFinite(entry.senior_rate)
        ? Number(entry.senior_rate) - base
        : 0.5;

      const nextBase = Math.max(3, Math.min(11, Math.round((base + delta) * 100) / 100));
      const nextSenior = Math.max(nextBase, Math.min(12, Math.round((nextBase + seniorSpread) * 100) / 100));

      return {
        ...entry,
        rate: nextBase,
        senior_rate: nextSenior,
      };
    });

    bank.live_source = liveRate.bankName;
    bank.live_rate_refreshed_at = new Date().toISOString();

    return true;
  }

  function shouldRefreshLiveRates() {
    return true;
  }

  function saveLiveRatesPayload(parsedMap) {
    try {
      if (!(parsedMap instanceof Map)) return;
      const payload = [...parsedMap.entries()];
      localStorage.setItem(LIVE_RATES_DATA_CACHE_KEY, JSON.stringify({
        fetchedAt: Date.now(),
        source: LIVE_RATES_SOURCE_URL,
        payload,
      }));
    } catch {}
  }

  function loadCachedLiveRatesMap() {
    try {
      const raw = localStorage.getItem(LIVE_RATES_DATA_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const payload = Array.isArray(parsed?.payload) ? parsed.payload : null;
      if (!payload) return null;

      return {
        map: new Map(payload),
        fetchedAt: parsed?.fetchedAt || null,
      };
    } catch {
      return null;
    }
  }

  function applyLiveRatesMapToBanks(liveRatesMap) {
    if (!banksData || !Array.isArray(banksData) || !liveRatesMap || !liveRatesMap.size) {
      return 0;
    }

    let updatedBanks = 0;
    banksData.forEach((bank) => {
      const liveRate = findLiveRateForBank(bank, liveRatesMap);
      if (liveRate && applyLiveRateToBank(bank, liveRate)) {
        updatedBanks += 1;
      }
    });

    return updatedBanks;
  }

  function saveLiveRatesMeta(meta) {
    liveRatesMeta = {
      ...liveRatesMeta,
      ...meta,
    };

    try {
      localStorage.setItem(LIVE_RATES_CACHE_KEY, JSON.stringify({
        fetchedAt: Date.now(),
        source: liveRatesMeta.source,
        updatedBanks: liveRatesMeta.updatedBanks,
        status: liveRatesMeta.status,
        mode: liveRatesMeta.mode,
        note: liveRatesMeta.note,
      }));
    } catch {}
  }

  async function fetchLiveRatesText() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      let response = null;

      if (typeof puter !== 'undefined' && puter.net && typeof puter.net.fetch === 'function') {
        response = await puter.net.fetch(LIVE_RATES_SOURCE_URL, {
          signal: controller.signal,
          cache: 'no-store',
        });
      } else {
        response = await fetch(LIVE_RATES_SOURCE_URL, {
          signal: controller.signal,
          cache: 'no-store',
        });
      }

      if (!response.ok) {
        throw new Error(`Live rates fetch failed with status ${response.status}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeout);
    }
  }

  async function refreshRatesFromWebIfNeeded() {
    if (!banksData || !banksData.length) return;

    liveRatesMeta.status = 'refreshing';

    try {
      const rawText = await fetchLiveRatesText();
      const parsedMap = parseLiveRates(rawText);

      if (!parsedMap.size) {
        saveLiveRatesMeta({
          status: 'stale',
          source: LIVE_RATES_SOURCE_URL,
          fetchedAt: Date.now(),
          updatedBanks: 0,
          mode: 'local',
          note: 'Live source returned no parseable rates. Using local snapshot.',
        });
        return;
      }

      const updatedBanks = applyLiveRatesMapToBanks(parsedMap);
      saveLiveRatesPayload(parsedMap);

      saveLiveRatesMeta({
        status: updatedBanks > 0 ? 'ok' : 'stale',
        source: LIVE_RATES_SOURCE_URL,
        fetchedAt: Date.now(),
        updatedBanks,
        mode: 'live',
        note: updatedBanks > 0
          ? 'Live rates applied.'
          : 'Live rates fetched, no bank updates needed.',
      });
    } catch (err) {
      console.warn('[FDData] Live rates refresh skipped:', err);
      const cached = loadCachedLiveRatesMap();
      if (cached && cached.map && cached.map.size) {
        const updatedBanks = applyLiveRatesMapToBanks(cached.map);
        saveLiveRatesMeta({
          status: updatedBanks > 0 ? 'ok' : 'stale',
          source: LIVE_RATES_SOURCE_URL,
          fetchedAt: cached.fetchedAt || Date.now(),
          updatedBanks,
          mode: 'cached',
          note: 'Live fetch failed. Cached live snapshot applied.',
        });
        return;
      }

      saveLiveRatesMeta({
        status: 'error',
        source: LIVE_RATES_SOURCE_URL,
        fetchedAt: Date.now(),
        updatedBanks: 0,
        mode: 'local',
        note: 'Live fetch failed. Using bundled local snapshot.',
      });
    }
  }

  function toNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function round2(value) {
    return Math.round(toNumber(value) * 100) / 100;
  }

  function getMaturityDate(tenorMonths) {
    const months = Math.max(1, Math.round(toNumber(tenorMonths, 12)));
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d;
  }

  function formatMaturityDate(tenorMonths) {
    const d = getMaturityDate(tenorMonths);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function getRateEntryForTenor(bank, tenorMonths) {
    if (!bank?.fd_rates?.length) return null;

    const exact = bank.fd_rates.find(fd => fd.tenor_months === tenorMonths);
    if (exact) return exact;

    return bank.fd_rates.reduce((closest, curr) => {
      if (!closest) return curr;
      const currDiff = Math.abs(curr.tenor_months - tenorMonths);
      const bestDiff = Math.abs(closest.tenor_months - tenorMonths);
      return currDiff < bestDiff ? curr : closest;
    }, null);
  }

  function resolveRate(rateEntry, isSeniorCitizen) {
    const baseRate = toNumber(rateEntry?.rate, 0);
    if (!isSeniorCitizen) return baseRate;

    const seniorRate = rateEntry?.senior_rate;
    if (Number.isFinite(seniorRate)) {
      return toNumber(seniorRate, baseRate + 0.5);
    }

    return baseRate + 0.5;
  }

  function getDifferenceAnalogyHi(differenceInRs) {
    const diff = toNumber(differenceInRs, 0);

    if (diff < 500) return 'मतलब मोबाइल रिचार्ज के बराबर अतिरिक्त राशि मिल सकती है।';
    if (diff < 1500) return 'मतलब एक महीने की सब्ज़ी का खर्च निकल सकता है।';
    if (diff < 3000) return 'मतलब घर के राशन का अच्छा हिस्सा पूरा हो सकता है।';
    if (diff < 7000) return 'मतलब त्योहार खरीदारी का बजट तैयार हो सकता है।';
    return 'मतलब आपातकालीन कोष में अच्छा अतिरिक्त हिस्सा जुड़ सकता है।';
  }

  function buildBankReturn(bank, tenorMonths, principal, isSeniorCitizen = false) {
    const rateEntry = getRateEntryForTenor(bank, tenorMonths);
    if (!rateEntry) return null;

    const effectiveRate = round2(resolveRate(rateEntry, isSeniorCitizen));
    const calc = calculateFD(principal, effectiveRate, tenorMonths, false);
    const isPSU = /public sector/i.test(bank.type) || /state bank of india/i.test(bank.name);

    return {
      id: bank.id,
      bank: bank.name,
      name: bank.name,
      name_hi: bank.name_hi,
      type: bank.type,
      isPSU,
      is_rbi_regulated: Boolean(bank.is_rbi_regulated),
      dicgc_insured: Boolean(bank.dicgc_insured),
      principal: calc.principal,
      rate: calc.rate,
      tenorMonths: calc.tenorMonths,
      tenor_months: calc.tenorMonths,
      interest: calc.interest,
      maturityAmount: calc.maturityAmount,
      maturity: calc.maturityAmount,
      monthlyEquivalent: calc.monthlyEquivalent,
      dailyEquivalent: calc.dailyEquivalent,
      maturityDate: calc.maturityDate,
      selectedRateSource: rateEntry,
    };
  }

  /**
   * Complete FD calculator using simple interest.
   * Interest = P * R * T / 100 where T = tenorMonths / 12
   */
  function calculateFD(principal, ratePercent, tenorMonths, isSeniorCitizen = false) {
    const safePrincipal = Math.max(0, toNumber(principal, 0));
    const safeTenor = Math.max(1, Math.round(toNumber(tenorMonths, 12)));
    const baseRate = toNumber(ratePercent, 0);
    const rate = round2(isSeniorCitizen ? baseRate + 0.5 : baseRate);
    const tYears = safeTenor / 12;

    const interest = round2((safePrincipal * rate * tYears) / 100);
    const maturityAmount = round2(safePrincipal + interest);
    const monthlyEquivalent = round2(interest / safeTenor);
    const dayCount = Math.max(1, Math.round(tYears * 365));
    const dailyEquivalent = round2(interest / dayCount);

    return {
      principal: round2(safePrincipal),
      rate,
      tenorMonths: safeTenor,
      interest,
      maturityAmount,
      monthlyEquivalent,
      maturityDate: formatMaturityDate(safeTenor),
      dailyEquivalent,
    };
  }

  /**
   * Backward-compatible helper used by booking flow.
   * @param {number} principal - Investment amount
   * @param {number} rate - Annual interest rate (e.g. 8.5)
   * @param {number} months - Duration in months
   * @returns {{ maturity: number, interest: number }}
   */
  function calculateMaturity(principal, rate, months) {
    const calc = calculateFD(principal, rate, months, false);

    return {
      maturity: Math.round(calc.maturityAmount),
      interest: Math.round(calc.interest),
    };
  }

  /**
   * Get best rates for a given tenor, sorted by rate descending.
   * Uses ₹1,00,000 as reference principal for calculated returns.
   * @returns {Array} Sorted bank results
   */
  function getBestRates(tenorMonths, isSeniorCitizen = false) {
    if (!banksData) return [];

    return banksData
      .map(bank => buildBankReturn(bank, tenorMonths, DEFAULT_REFERENCE_PRINCIPAL, isSeniorCitizen))
      .filter(Boolean)
      .sort((a, b) => (b.rate - a.rate) || (b.maturityAmount - a.maturityAmount));
  }

  /**
   * Comparison object for a specific amount + tenor.
   */
  function getComparison(tenorMonths, principal, isSeniorCitizen = false) {
    if (!banksData) {
      return {
        best: null,
        worst: null,
        all: [],
        differenceInRs: 0,
        differenceAnalogy_hi: '',
      };
    }

    const safePrincipal = Math.max(1000, toNumber(principal, DEFAULT_REFERENCE_PRINCIPAL));

    const all = banksData
      .map(bank => buildBankReturn(bank, tenorMonths, safePrincipal, isSeniorCitizen))
      .filter(Boolean)
      .sort((a, b) => (b.rate - a.rate) || (b.maturityAmount - a.maturityAmount));

    if (!all.length) {
      return {
        best: null,
        worst: null,
        all: [],
        differenceInRs: 0,
        differenceAnalogy_hi: '',
      };
    }

    const bestEntry = all[0];
    const worstEntry = all[all.length - 1];
    const differenceInRs = round2(bestEntry.maturityAmount - worstEntry.maturityAmount);

    return {
      best: {
        bank: bestEntry.name,
        rate: bestEntry.rate,
        maturityAmount: bestEntry.maturityAmount,
        extraVsWorst: differenceInRs,
        data: bestEntry,
      },
      worst: {
        bank: worstEntry.name,
        rate: worstEntry.rate,
        maturityAmount: worstEntry.maturityAmount,
        data: worstEntry,
      },
      all,
      differenceInRs,
      differenceAnalogy_hi: getDifferenceAnalogyHi(differenceInRs),
    };
  }

  /**
   * Backward-compatible list API used by booking/legacy compare screens.
   */
  function getComparisonData(months, principal, isSenior = false) {
    return getComparison(months, principal, isSenior).all;
  }

  function getBankById(bankId) {
    if (!banksData) return null;
    return banksData.find(bank => bank.id === bankId) || null;
  }

  /**
   * Convert amount to relatable real-life equivalent.
   * @param {number} amount - Amount in rupees
   * @param {string} lang - Language code
   */
  function getRelativeValue(amount, lang) {
    const items = [
      { threshold: 50, hi: 'एक प्लेट मोमोज 🥟', en: 'a plate of momos 🥟' },
      { threshold: 150, hi: 'एक महीने की चाय ☕', en: 'a month of chai ☕' },
      { threshold: 500, hi: 'एक अच्छा भोजन 🍽️', en: 'a nice dinner 🍽️' },
      { threshold: 1000, hi: 'एक महीने का मोबाइल रिचार्ज 📱', en: '1 month mobile recharge 📱' },
      { threshold: 2500, hi: 'एक जोड़ी जूते 👟', en: 'a pair of shoes 👟' },
      { threshold: 5000, hi: 'तीन महीने की सब्ज़ी 🥬', en: '3 months of vegetables 🥬' },
      { threshold: 10000, hi: 'ईयरबड्स और फोन कवर 🎧', en: 'earbuds + phone case 🎧' },
      { threshold: 25000, hi: 'एक छोटा अवकाश 🏖️', en: 'a weekend getaway 🏖️' },
      { threshold: 50000, hi: 'एक स्मार्टफोन 📱', en: 'a smartphone 📱' },
      { threshold: 100000, hi: 'एक स्कूटी की ईएमआई 🏍️', en: 'a scooty EMI 🏍️' },
    ];

    // Find the best matching analogy
    let bestMatch = items[0];
    for (const item of items) {
      if (amount >= item.threshold) bestMatch = item;
    }

    const formatted = '₹' + amount.toLocaleString('en-IN');
    const analogy = lang === 'hi' ? bestMatch.hi : bestMatch.en;

    return lang === 'hi'
      ? `${formatted} मतलब लगभग ${analogy}`
      : `${formatted} is roughly ${analogy}`;
  }

  /**
   * Format currency in Indian notation.
   */
  function formatINR(amount) {
    const rounded = round2(amount);
    if (Number.isInteger(rounded)) {
      return '₹' + rounded.toLocaleString('en-IN');
    }
    return '₹' + rounded.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return {
    loadRates,
    calculateFD,
    calculateMaturity,
    getBestRates,
    getComparison,
    getComparisonData,
    getBankById,
    getRelativeValue,
    formatINR,
    getLiveRatesMeta: () => ({ ...liveRatesMeta }),
  };
})();
