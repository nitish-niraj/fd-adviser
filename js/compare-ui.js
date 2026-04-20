const TENORS = [3, 6, 12, 24, 36];
const langCode = localStorage.getItem('fd_lang') || 'hi';

const LANG_NAME = {
  hi: 'hindi', bn: 'bengali', ta: 'tamil', te: 'telugu', mr: 'marathi',
  pa: 'punjabi', kn: 'kannada', ml: 'malayalam', gu: 'gujarati', or: 'odia', bho: 'bhojpuri', en: 'english',
};

const UI_COPY = {
  hi: {
    title: 'आज के सर्वोत्तम एफडी विकल्प',
    subtitle: 'राशि और अवधि बदलते ही परिणाम तुरंत अपडेट होगा।',
    senior: 'वरिष्ठ नागरिक (+0.50%)',
    amount: 'राशि',
    help: 'सही बैंक चुनने में सहायता चाहिए?',
    helpLink: 'मीरा से बात करें →',
    differencePrefix: 'सर्वोत्तम और न्यूनतम बैंक में अंतर',
    differenceSuffix: 'है।',
    interestLabel: 'लाभ',
    empty: 'इस अवधि के लिए अभी डेटा उपलब्ध नहीं है।',
    connected: 'कनेक्शन सक्रिय',
    limited: 'सीमित मोड',
  },
  en: {
    title: 'Best FD Options Today',
    subtitle: 'Results update instantly when amount or tenor changes.',
    senior: 'Senior Citizen (+0.50%)',
    amount: 'Amount',
    help: 'Need help choosing the right bank?',
    helpLink: 'Chat with Meera →',
    differencePrefix: 'Difference between best and lowest bank is',
    differenceSuffix: '.',
    interestLabel: 'Interest',
    empty: 'No data available for this tenor.',
    connected: 'Connected',
    limited: 'Limited mode',
  },
  bn: {
    title: 'আজকের সেরা FD বিকল্প',
    subtitle: 'Amount বা tenor বদলালেই ফল সাথে সাথে আপডেট হবে।',
    senior: 'Senior Citizen (+0.50%)',
    amount: 'Amount',
    help: 'সঠিক ব্যাংক বেছে নিতে সাহায্য লাগবে?',
    helpLink: 'Meera-এর সাথে কথা বলুন →',
    differencePrefix: 'সেরা ও সর্বনিম্ন ব্যাংকের ব্যবধান',
    differenceSuffix: '।',
    interestLabel: 'লাভ',
    empty: 'এই tenor-এর জন্য তথ্য পাওয়া যায়নি।',
    connected: 'Connected',
    limited: 'Limited mode',
  },
  ta: {
    title: 'இன்றைய சிறந்த FD விருப்பங்கள்',
    subtitle: 'Amount அல்லது tenor மாற்றினால் விளைவு உடனே புதுப்படும்.',
    senior: 'Senior Citizen (+0.50%)',
    amount: 'Amount',
    help: 'சரியான bank தேர்வுக்கு உதவி வேண்டுமா?',
    helpLink: 'Meera-வுடன் பேசுங்கள் →',
    differencePrefix: 'சிறந்த மற்றும் குறைந்த bank இடையேயான வேறுபாடு',
    differenceSuffix: '.',
    interestLabel: 'லாபம்',
    empty: 'இந்த tenor-க்கு data கிடைக்கவில்லை.',
    connected: 'Connected',
    limited: 'Limited mode',
  },
  te: {
    title: 'ఈరోజు ఉత్తమ FD ఎంపికలు',
    subtitle: 'Amount లేదా tenor మార్చగానే ఫలితం వెంటనే అప్డేట్ అవుతుంది.',
    senior: 'Senior Citizen (+0.50%)',
    amount: 'Amount',
    help: 'సరైన bank ఎంపికలో సహాయం కావాలా?',
    helpLink: 'Meeraతో చాట్ చేయండి →',
    differencePrefix: 'ఉత్తమ మరియు కనిష్ట bank మధ్య తేడా',
    differenceSuffix: '.',
    interestLabel: 'లాభం',
    empty: 'ఈ tenor కు data అందుబాటులో లేదు.',
    connected: 'Connected',
    limited: 'Limited mode',
  },
  mr: {
    title: 'आजचे सर्वोत्तम FD पर्याय',
    subtitle: 'रक्कम आणि कालावधी बदलताच निकाल अपडेट होतो.',
    senior: 'Senior Citizen (+0.50%)',
    amount: 'Amount',
    help: 'योग्य bank निवडण्यासाठी मदत हवी आहे का?',
    helpLink: 'Meera सोबत चॅट करा →',
    differencePrefix: 'सर्वोत्तम आणि कमी bank मधील फरक',
    differenceSuffix: '.',
    interestLabel: 'नफा',
    empty: 'या tenor साठी data उपलब्ध नाही.',
    connected: 'Connected',
    limited: 'Limited mode',
  },
  pa: {
    title: 'ਅੱਜ ਦੇ ਵਧੀਆ FD ਵਿਕਲਪ',
    subtitle: 'Amount ਅਤੇ tenor ਬਦਲਦੇ ਹੀ ਨਤੀਜੇ ਤੁਰੰਤ ਅਪਡੇਟ ਹੋਣਗੇ।',
    senior: 'Senior Citizen (+0.50%)',
    amount: 'Amount',
    help: 'ਸਹੀ bank ਚੁਣਨ ਲਈ ਮਦਦ ਚਾਹੀਦੀ?',
    helpLink: 'Meera ਨਾਲ ਗੱਲ ਕਰੋ →',
    differencePrefix: 'ਸਭ ਤੋਂ ਵਧੀਆ ਅਤੇ ਘੱਟ bank ਵਿੱਚ ਫਰਕ',
    differenceSuffix: '।',
    interestLabel: 'ਲਾਭ',
    empty: 'ਇਸ tenor ਲਈ data ਉਪਲਬਧ ਨਹੀਂ।',
    connected: 'Connected',
    limited: 'Limited mode',
  },
  kn: {
    title: 'ಇಂದಿನ ಅತ್ಯುತ್ತಮ FD ಆಯ್ಕೆಗಳು',
    subtitle: 'Amount ಮತ್ತು tenor ಬದಲಿಸಿದ ತಕ್ಷಣ ಫಲಿತಾಂಶ ನವೀಕರಿಸುತ್ತದೆ.',
    senior: 'Senior Citizen (+0.50%)',
    amount: 'Amount',
    help: 'ಸರಿಯಾದ bank ಆಯ್ಕೆ ಮಾಡಲು ಸಹಾಯ ಬೇಕೇ?',
    helpLink: 'Meera ಜೊತೆ ಚಾಟ್ ಮಾಡಿ →',
    differencePrefix: 'ಉತ್ತಮ ಮತ್ತು ಕಡಿಮೆ bank ನಡುವಿನ ವ್ಯತ್ಯಾಸ',
    differenceSuffix: '.',
    interestLabel: 'ಲಾಭ',
    empty: 'ಈ tenor ಗೆ data ಲಭ್ಯವಿಲ್ಲ.',
    connected: 'Connected',
    limited: 'Limited mode',
  },
  ml: {
    title: 'ഇന്നത്തെ മികച്ച FD ഓപ്ഷനുകൾ',
    subtitle: 'Amount അല്ലെങ്കിൽ tenor മാറ്റിയാൽ ഫലം ഉടൻ അപ്ഡേറ്റ് ചെയ്യും.',
    senior: 'Senior Citizen (+0.50%)',
    amount: 'Amount',
    help: 'ശരിയായ bank തിരഞ്ഞെടുക്കാൻ സഹായം വേണോ?',
    helpLink: 'Meeraയുമായി ചാറ്റ് ചെയ്യൂ →',
    differencePrefix: 'മികച്ചതും കുറഞ്ഞതുമായ bank തമ്മിലുള്ള വ്യത്യാസം',
    differenceSuffix: '.',
    interestLabel: 'ലാഭം',
    empty: 'ഈ tenorയ്ക്ക് data ലഭ്യമല്ല.',
    connected: 'Connected',
    limited: 'Limited mode',
  },
  gu: {
    title: 'આજના શ્રેષ્ઠ FD વિકલ્પો',
    subtitle: 'Amount અને tenor બદલતા જ પરિણામ તરત અપડેટ થશે.',
    senior: 'Senior Citizen (+0.50%)',
    amount: 'Amount',
    help: 'યોગ્ય bank પસંદ કરવા મદદ જોઈએ?',
    helpLink: 'Meera સાથે વાત કરો →',
    differencePrefix: 'શ્રેષ્ઠ અને નીચા bank વચ્ચેનો તફાવત',
    differenceSuffix: '.',
    interestLabel: 'લાભ',
    empty: 'આ tenor માટે data ઉપલબ્ધ નથી.',
    connected: 'Connected',
    limited: 'Limited mode',
  },
  or: {
    title: 'ଆଜିର ସର୍ବୋତ୍ତମ FD ବିକଳ୍ପ',
    subtitle: 'Amount ଓ tenor ବଦଳିଲେ ଫଳାଫଳ ସହିତସହିତ ଅପଡେଟ୍ ହେବ।',
    senior: 'Senior Citizen (+0.50%)',
    amount: 'Amount',
    help: 'ଠିକ bank ବାଛିବାରେ ସହାୟତା ଦରକାର କି?',
    helpLink: 'Meera ସହ କଥା ହୋନ୍ତୁ →',
    differencePrefix: 'ସର୍ବୋତ୍ତମ ଓ କମ୍ bank ମଧ୍ୟର ତାଫାତ',
    differenceSuffix: '।',
    interestLabel: 'ଲାଭ',
    empty: 'ଏହି tenor ପାଇଁ data ମିଳୁନି।',
    connected: 'Connected',
    limited: 'Limited mode',
  },
  bho: {
    title: 'आज के सबसे बढ़िया एफडी विकल्प',
    subtitle: 'राशि आ अवधि बदलतहीं नतीजा तुरंत बदली।',
    senior: 'वरिष्ठ नागरिक (+0.50%)',
    amount: 'राशि',
    help: 'ठीक बैंक चुने में मदद चाहीं?',
    helpLink: 'मीरा से बतियाईं →',
    differencePrefix: 'सबसे बढ़िया आ सबसे कम बैंक में अंतर',
    differenceSuffix: 'बा।',
    interestLabel: 'फायदा',
    empty: 'एह अवधि खातिर जानकारी उपलब्ध नइखे।',
    connected: 'कनेक्शन सक्रिय',
    limited: 'सीमित मोड',
  },
};

function getCopy() {
  return UI_COPY[langCode] || UI_COPY.hi;
}

function getLanguageName() {
  return LANG_NAME[langCode] || 'hindi';
}

function nearestTenor(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 12;
  return TENORS.reduce((best, curr) => Math.abs(curr - n) < Math.abs(best - n) ? curr : best, TENORS[0]);
}

const state = {
  tenor: nearestTenor(localStorage.getItem('fd_compare_tenor') || 12),
  amount: Math.min(1000000, Math.max(10000, Number(localStorage.getItem('fd_compare_amount') || 100000))),
  isSenior: localStorage.getItem('fd_compare_senior') === 'yes',
};

const loadingOverlay = document.getElementById('loadingOverlay');
const tenorTabsEl = document.getElementById('cmp4TenorTabs');
const seniorToggleEl = document.getElementById('cmp4SeniorToggle');
const amountSliderEl = document.getElementById('cmp4AmountSlider');
const amountValueEl = document.getElementById('cmp4AmountValue');
const rowsEl = document.getElementById('cmp4Rows');
const diffEl = document.getElementById('cmp4Difference');
const festivalEl = document.getElementById('cmp4Festival');
const liveMetaEl = document.getElementById('cmp4LiveMeta');
const connStatusEl = document.getElementById('cmp4ConnStatus');

function applyText() {
  const c = getCopy();
  document.getElementById('cmp4Title').textContent = c.title;
  document.getElementById('cmp4Subtitle').textContent = c.subtitle;
  document.getElementById('cmp4SeniorLabel').textContent = c.senior;
  document.getElementById('cmp4AmountLabel').textContent = c.amount;
  document.getElementById('cmp4HelpText').textContent = c.help;
  document.getElementById('cmp4HelpLink').textContent = c.helpLink;
}

function persistState() {
  localStorage.setItem('fd_compare_tenor', String(state.tenor));
  localStorage.setItem('fd_compare_amount', String(state.amount));
  localStorage.setItem('fd_compare_senior', state.isSenior ? 'yes' : 'no');
  localStorage.setItem('fd_last_tenor', String(state.tenor));
}

function renderTenorTabs() {
  tenorTabsEl.innerHTML = TENORS.map((tenor) => `
    <button
      type="button"
      class="cmp4-tenor-btn ${tenor === state.tenor ? 'active' : ''}"
      data-tenor="${tenor}"
    >${tenor}M</button>
  `).join('');

  tenorTabsEl.querySelectorAll('[data-tenor]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.tenor = Number(btn.dataset.tenor);
      persistState();
      renderTenorTabs();
      renderComparison();
    });
  });
}

function getDisplayBankName(entry) {
  if (langCode === 'hi' && entry.name_hi) return entry.name_hi;
  return entry.name;
}

function renderConnectionStatus(session) {
  if (!connStatusEl) return;
  const c = getCopy();

  if (session && session.authenticated) {
    const model = session.model ? ` · ${session.model}` : '';
    connStatusEl.textContent = `${c.connected}${model}`;
  } else {
    connStatusEl.textContent = c.limited;
  }
}

function formatLiveMeta() {
  const meta = FDData.getLiveRatesMeta ? FDData.getLiveRatesMeta() : null;
  if (!liveMetaEl || !meta) return;

  const ts = meta.fetchedAt ? new Date(meta.fetchedAt).toLocaleString('en-IN') : '-';
  const modeMap = {
    live: 'live',
    cached: 'cached',
    local: 'local',
  };

  if (langCode === 'en') {
    liveMetaEl.textContent = `Rate source: ${modeMap[meta.mode] || 'local'} | Updated: ${ts} | ${meta.note || ''}`.trim();
    return;
  }

  liveMetaEl.textContent = `दर स्रोत: ${modeMap[meta.mode] || 'local'} | अद्यतन: ${ts} | ${meta.note || ''}`.trim();
}

function renderComparison() {
  const c = getCopy();
  amountValueEl.textContent = FDData.formatINR(state.amount);
  formatLiveMeta();

  const comparison = FDData.getComparison(state.tenor, state.amount, state.isSenior);
  const rows = comparison.all || [];

  if (!rows.length) {
    rowsEl.innerHTML = `<div class="cmp4-bank" style="text-align:center;color:#617487;">${c.empty}</div>`;
    diffEl.textContent = c.empty;
    festivalEl.style.display = 'none';
    return;
  }

  const maxMaturity = Math.max(...rows.map((r) => r.maturityAmount));

  rowsEl.innerHTML = rows.map((entry, index) => {
    const width = Math.max(8, (entry.maturityAmount / maxMaturity) * 100);

    return `
      <article class="cmp4-bank ${index === 0 ? 'best' : ''}">
        <div class="cmp4-bank-head">
          <div>
            <div class="cmp4-bank-name-line">
              <div class="cmp4-bank-name">${getDisplayBankName(entry)}</div>
              ${index === 0 ? '<span class="cmp4-crown">👑</span>' : ''}
            </div>
            <div class="cmp4-bank-type">${entry.type}</div>
          </div>
          <div class="cmp4-rate">${entry.rate.toFixed(2)}<span>%</span></div>
        </div>

        <div class="cmp4-track">
          <div class="cmp4-fill" style="width:${width.toFixed(1)}%"></div>
        </div>

        <div class="cmp4-bank-meta">
          <span class="maturity">${FDData.formatINR(entry.maturityAmount)}</span>
          <span>${c.interestLabel}: ${FDData.formatINR(entry.interest)}</span>
        </div>

        <div class="cmp4-badges">
          ${entry.isPSU ? '<span class="cmp4-badge safe">Safe</span>' : ''}
          <span class="cmp4-badge">DICGC Insured ✅</span>
          <span class="cmp4-badge">RBI Regulated ✅</span>
        </div>
      </article>
    `;
  }).join('');

  if (langCode === 'en') {
    diffEl.textContent = `${c.differencePrefix} ${FDData.formatINR(comparison.differenceInRs)}${c.differenceSuffix}`;
  } else {
    diffEl.textContent = `${c.differencePrefix} ${FDData.formatINR(comparison.differenceInRs)} ${c.differenceSuffix} ${comparison.differenceAnalogy_hi}`;
  }

  const festivalAlert = CulturalEngine.getFestivalAlert(state.tenor, getLanguageName());
  if (festivalAlert) {
    festivalEl.style.display = 'block';
    festivalEl.textContent = festivalAlert;
  } else {
    festivalEl.style.display = 'none';
    festivalEl.textContent = '';
  }
}

function initSession() {
  if (typeof PuterInit === 'undefined') return;

  if (typeof PuterInit.onSessionStateChange === 'function') {
    PuterInit.onSessionStateChange((session) => {
      renderConnectionStatus(session);
    });
  }

  renderConnectionStatus(PuterInit.getSessionState ? PuterInit.getSessionState() : null);

  Promise.resolve()
    .then(() => PuterInit.bootstrapSession({ interactive: false }))
    .catch(() => {});
}

async function init() {
  applyText();
  initSession();

  seniorToggleEl.checked = state.isSenior;
  amountSliderEl.value = String(state.amount);

  seniorToggleEl.addEventListener('change', () => {
    state.isSenior = seniorToggleEl.checked;
    persistState();
    renderComparison();
  });

  amountSliderEl.addEventListener('input', () => {
    state.amount = Number(amountSliderEl.value);
    persistState();
    renderComparison();
  });

  renderTenorTabs();
  renderComparison();

  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
  }

  try {
    await FDData.loadRates();
  } catch (err) {
    console.warn('[CompareUI] FD rates load failed, using local fallback', err);
  }

  renderComparison();
}

init();
