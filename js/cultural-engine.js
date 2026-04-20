/* ========================================
   Cultural Engine — Festival Alerts + Local Analogies
   ======================================== */

const CulturalEngine = (() => {
  const FESTIVALS = {
    hindi: [
      { name: 'दीपावली', month: 10, emoji: '🪔' },
      { name: 'होली', month: 3, emoji: '🎨' },
      { name: 'नवरात्रि', month: 10, emoji: '🙏' },
    ],
    bhojpuri: [
      { name: 'छठ पूजा', month: 11, emoji: '🌞' },
      { name: 'दीपावली', month: 10, emoji: '🪔' },
      { name: 'होली', month: 3, emoji: '🎨' },
    ],
    english: [
      { name: 'Diwali', month: 10, emoji: '🪔' },
      { name: 'Holi', month: 3, emoji: '🎨' },
      { name: 'Navratri', month: 10, emoji: '🙏' },
    ],
    bengali: [
      { name: 'Durga Puja', month: 10, emoji: '🥁' },
      { name: 'Eid', month: 4, emoji: '🌙' },
    ],
    tamil: [
      { name: 'Pongal', month: 1, emoji: '🌾' },
      { name: 'Karthigai', month: 11, emoji: '🪔' },
    ],
    telugu: [
      { name: 'Sankranti', month: 1, emoji: '🪁' },
      { name: 'Ugadi', month: 3, emoji: '🌺' },
    ],
    marathi: [
      { name: 'Ganesh Chaturthi', month: 9, emoji: '🐘' },
      { name: 'Gudhi Padwa', month: 3, emoji: '🏳️' },
    ],
  };

  function normalizeLanguage(language) {
    const key = String(language || '').toLowerCase();
    return FESTIVALS[key] ? key : 'hindi';
  }

  function addMonths(date, months) {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
  }

  function diffInDays(a, b) {
    return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  }

  function getClosestFestivalDate(maturityDate, festivalMonth) {
    const year = maturityDate.getFullYear();
    const candidates = [year - 1, year, year + 1].map((y) => new Date(y, festivalMonth - 1, 15));

    return candidates.reduce((best, current) => {
      const absDiff = Math.abs(diffInDays(maturityDate, current));
      if (!best || absDiff < best.absDiff) {
        return { date: current, absDiff };
      }
      return best;
    }, null);
  }

  function getRelativeText(daysDiff, direction, language) {
    if (language === 'english') {
      if (daysDiff <= 7) return direction === 'before' ? 'about 1 week before' : 'about 1 week after';
      if (daysDiff <= 15) return direction === 'before' ? 'about 2 weeks before' : 'about 2 weeks after';
      return direction === 'before' ? 'about a month before' : 'about a month after';
    }

    if (language === 'bhojpuri') {
      if (daysDiff <= 7) return direction === 'before' ? 'लगभग 1 हफ्ता पहिले' : 'लगभग 1 हफ्ता बाद';
      if (daysDiff <= 15) return direction === 'before' ? 'लगभग 2 हफ्ता पहिले' : 'लगभग 2 हफ्ता बाद';
      return direction === 'before' ? 'लगभग 1 महीना पहिले' : 'लगभग 1 महीना बाद';
    }

    if (daysDiff <= 7) return direction === 'before' ? 'लगभग 1 हफ्ता पहले' : 'लगभग 1 हफ्ता बाद';
    if (daysDiff <= 15) return direction === 'before' ? 'लगभग 2 हफ्ते पहले' : 'लगभग 2 हफ्ते बाद';
    return direction === 'before' ? 'लगभग 1 महीना पहले' : 'लगभग 1 महीना बाद';
  }

  function getFestivalAlert(tenor_months, language) {
    const tenorMonths = Number(tenor_months);
    if (!Number.isFinite(tenorMonths) || tenorMonths <= 0) {
      return null;
    }

    const lang = normalizeLanguage(language);
    const maturityDate = addMonths(new Date(), tenorMonths);
    const festivals = FESTIVALS[lang] || FESTIVALS.hindi;

    let closest = null;

    for (const festival of festivals) {
      const festivalHit = getClosestFestivalDate(maturityDate, festival.month);
      if (!festivalHit) continue;

      const dayDiff = diffInDays(maturityDate, festivalHit.date);
      const absDiff = Math.abs(dayDiff);

      if (absDiff <= 30 && (!closest || absDiff < closest.absDiff)) {
        closest = {
          festival,
          absDiff,
          direction: dayDiff >= 0 ? 'before' : 'after',
        };
      }
    }

    if (!closest) return null;

    if (lang === 'english') {
      return `${closest.festival.emoji} Maturity is ${getRelativeText(closest.absDiff, closest.direction, lang)} ${closest.festival.name} — useful for festival expenses.`;
    }

    if (lang === 'bhojpuri') {
      return `${closest.festival.emoji} परिपक्वता ${closest.festival.name} से ${getRelativeText(closest.absDiff, closest.direction, lang)} होई — त्योहार खर्च के योजना खातिर बढ़िया समय।`;
    }

    return `${closest.festival.emoji} परिपक्वता ${closest.festival.name} से ${getRelativeText(closest.absDiff, closest.direction, lang)} होगी — त्योहार खर्च की योजना के लिए अच्छा समय।`;
  }

  function fallbackAnalogy(amount, language, persona) {
    const formatted = `₹${Math.round(amount).toLocaleString('en-IN')}`;
    const p = String(persona || 'kisan').toLowerCase();

    const hindiFallbacks = {
      kisan: `${formatted} से कई सप्ताह की घरेलू राशन योजना बन सकती है। 🛒`,
      teacher: `${formatted} से पुस्तकों और अध्ययन सामग्री का अच्छा खर्च निकल सकता है। 📚`,
      dukandaar: `${formatted} को सुरक्षित कार्यशील पूंजी की तरह रखा जा सकता है। 🧾`,
      retired: `${formatted} से दवा और मासिक आवश्यकताओं का सहारा मिल सकता है। 💊`,
      student: `${formatted} से पढ़ाई और मासिक सदस्यताओं का खर्च संभल सकता है। 🎓`,
    };

    const bhojpuriFallbacks = {
      kisan: `${formatted} से कई हफ्ता के घर के राशन के मदद हो सकेला। 🛒`,
      teacher: `${formatted} से किताब आ पढ़ाई सामग्री के खरचा निकल सकेला। 📚`,
      dukandaar: `${formatted} के सुरक्षित कार्यशील पूंजी जइसन राखल जा सकेला। 🧾`,
      retired: `${formatted} से दवाई आ जरूरी खर्चा में सहारा मिल सकेला। 💊`,
      student: `${formatted} से पढ़ाई आ महीना भर के सदस्यता खर्चा संभरल जा सकेला। 🎓`,
    };

    const englishFallbacks = {
      kisan: `${formatted} can support multiple weeks of household ration. 🛒`,
      teacher: `${formatted} can cover books and learning material. 📚`,
      dukandaar: `${formatted} can act as protected working capital. 🧾`,
      retired: `${formatted} can support medicine and monthly essentials. 💊`,
      student: `${formatted} can support study and monthly subscriptions. 🎓`,
    };

    if (language === 'english') return englishFallbacks[p] || englishFallbacks.kisan;
    if (language === 'bhojpuri') return bhojpuriFallbacks[p] || bhojpuriFallbacks.kisan;
    return hindiFallbacks[p] || hindiFallbacks.kisan;
  }

  async function getLocalAnalogy(amount, language, persona) {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return null;
    }

    const lang = normalizeLanguage(language);

    try {
      if (typeof PuterInit !== 'undefined' && typeof PuterInit.ensureAuthenticated === 'function') {
        const signed = await PuterInit.ensureAuthenticated({ interactive: false, reason: 'cultural-analogy' });
        if (!signed) return fallbackAnalogy(numericAmount, lang, persona);
      }
    } catch {
      return fallbackAnalogy(numericAmount, lang, persona);
    }

    try {
      const profile = (typeof PersonaEngine !== 'undefined' && PersonaEngine.getPersona)
        ? PersonaEngine.getPersona(persona)
        : { id: persona || 'kisan', analogy_style: 'local' };

      const formatted = `₹${Math.round(numericAmount).toLocaleString('en-IN')}`;
      const languageRule = lang === 'english'
        ? 'Write in clear English.'
        : lang === 'bhojpuri'
          ? 'देवनागरी भोजपुरी में लिखें, भोजपुरी शब्द रोमन में न लिखें।'
          : 'देवनागरी हिंदी में लिखें, हिंदी शब्द रोमन में न लिखें।';

      const prompt = [
        'Generate exactly one local spending analogy for FD interest.',
        `Amount: ${formatted}`,
        `Language: ${lang}`,
        `Persona: ${profile.id}`,
        `Persona style: ${profile.analogy_style}`,
        languageRule,
        'Rules:',
        '1) Return exactly one short line.',
        '2) Keep it natural for India.',
        '3) No intro, no quotes, no numbering.',
        '4) Maximum 16 words.',
        '5) Include exactly one relevant emoji.',
      ].join('\n');

      let text = '';

      if (typeof PuterInit !== 'undefined') {
        if (typeof PuterInit.aiChat === 'function') {
          text = String(await PuterInit.aiChat([{ role: 'user', content: prompt }]) || '').trim();
        } else if (typeof PuterInit.chat === 'function' && typeof PuterInit.extractResponseText === 'function') {
          const aiResult = await PuterInit.chat(
            [{ role: 'user', content: prompt }],
            { stream: false }
          );
          text = String(PuterInit.extractResponseText(aiResult.response) || '').trim();
        }
      }

      return text || fallbackAnalogy(numericAmount, lang, profile.id);
    } catch {
      return fallbackAnalogy(numericAmount, lang, persona);
    }
  }

  return {
    FESTIVALS,
    getFestivalAlert,
    getLocalAnalogy,
  };
})();
