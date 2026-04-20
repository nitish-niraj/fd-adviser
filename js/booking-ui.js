const LANG_CODE = localStorage.getItem('fd_lang') || 'hi';
const PERSONA = localStorage.getItem('fd_persona') || 'kisan';

const LANGUAGE_NAME_MAP = {
  hi: 'hindi',
  en: 'english',
  bn: 'bengali',
  ta: 'tamil',
  te: 'telugu',
  mr: 'marathi',
  pa: 'punjabi',
  kn: 'kannada',
  ml: 'malayalam',
  gu: 'gujarati',
  or: 'odia',
  bho: 'bhojpuri',
};

const GOALS = {
  padhai: {
    emoji: '🎓',
    labels: {
      hi: 'बच्चों की पढ़ाई',
      bho: 'लइका के पढ़ाई',
      en: 'Child Education',
    },
    tenor: 24,
  },
  shaadi: {
    emoji: '💒',
    labels: {
      hi: 'शादी',
      bho: 'बियाह',
      en: 'Marriage',
    },
    tenor: 18,
  },
  emergency: {
    emoji: '🏥',
    labels: {
      hi: 'आपातकालीन कोष',
      bho: 'आपातकालीन कोष',
      en: 'Emergency Fund',
    },
    tenor: 6,
  },
  teerth: {
    emoji: '🕌',
    labels: {
      hi: 'तीर्थ यात्रा',
      bho: 'तीरथ यात्रा',
      en: 'Pilgrimage',
    },
    tenor: 36,
  },
  bachat: {
    emoji: '📈',
    labels: {
      hi: 'सामान्य बचत',
      bho: 'सामान्य बचत',
      en: 'General Savings',
    },
    tenor: 12,
  },
};

const TENOR_OPTIONS = [6, 12, 18, 24, 36];

const BANK_BRANCHES = {
  'suryoday-sfb': {
    website: 'https://www.suryodaybank.com',
    nearest: 'Suryoday SFB, Fort Branch, Dadiseth Agyari Lane, Kalbadevi, Mumbai, Maharashtra 400002',
    short: 'Suryoday SFB',
  },
  'utkarsh-sfb': {
    website: 'https://www.utkarsh.bank',
    nearest: 'Utkarsh SFB, Connaught Place Branch, New Delhi, Delhi 110001',
    short: 'Utkarsh SFB',
  },
  'jana-sfb': {
    website: 'https://www.janabank.com',
    nearest: 'Jana SFB, MG Road Branch, Bengaluru, Karnataka 560001',
    short: 'Jana SFB',
  },
  'au-sfb': {
    website: 'https://www.aubank.in',
    nearest: 'AU SFB, C-Scheme Branch, Jaipur, Rajasthan 302001',
    short: 'AU SFB',
  },
  sbi: {
    website: 'https://sbi.co.in',
    nearest: 'SBI, Parliament Street Branch, New Delhi, Delhi 110001',
    short: 'SBI',
  },
  hdfc: {
    website: 'https://www.hdfcbank.com',
    nearest: 'HDFC Bank, Andheri East Branch, Mumbai, Maharashtra 400069',
    short: 'HDFC',
  },
};

const COPY = {
  hi: {
    header: 'एफडी बुकिंग — चरणबद्ध प्रक्रिया',
    s1Prompt: 'आप यह राशि किस उद्देश्य से जमा कर रहे हैं?',
    s2Prompt: 'आप कितनी राशि निवेश करना चाहते हैं?',
    s2Hint: 'न्यूनतम ₹1,000 | अधिकतम ₹5,00,000',
    s3Prompt: 'आपके लक्ष्य के अनुसार अवधि सुझाई गई है। पुष्टि करें या बदलें।',
    s4Prompt: 'अंतिम बुकिंग बैंक में होगी। ये विवरण केवल रिकॉर्ड के लिए हैं।',
    s5Prompt: 'कृपया सभी विवरण जाँच लें, फिर पुष्टि करें ✅ दबाएँ।',
    invalidAmount: 'कृपया ₹1,000 से ₹5,00,000 के बीच राशि दर्ज करें।',
    invalidName: 'कृपया पूरा नाम लिखें (आधार के अनुसार)।',
    invalidMobile: 'कृपया सही 10 अंकों का मोबाइल नंबर लिखें।',
    invalidPan: 'PAN प्रारूप गलत है। उदाहरण: ABCDE1234F',
    suggestTenor: 'मीरा का सुझाव',
    bestBank: 'सर्वोत्तम बैंक',
    continueBtn: 'आगे बढ़ें →',
    confirmBtn: 'पुष्टि करें ✅',
    shareBtn: 'व्हॉट्सऐप पर साझा करें',
    newFd: 'नई एफडी शुरू करें',
    goHome: 'चैट पर वापस जाएँ',
    reviewTitle: 'एफडी बुकिंग रसीद',
    seniorYes: 'हाँ',
    seniorNo: 'नहीं',
    bookedMessage: 'आपकी बुकिंग सुरक्षित हो गई है। अंतिम एफडी के लिए बैंक शाखा या वेबसाइट पर जाएँ।',
    stepLabels: ['लक्ष्य', 'राशि', 'अवधि', 'विवरण', 'समीक्षा'],
    panNote: 'PAN वैकल्पिक है। ब्याज पर कर रिपोर्टिंग के लिए उपयोगी है।',
    connected: 'कनेक्शन सक्रिय',
    limited: 'सीमित मोड',
    fallbackSaved: 'सुरक्षा हेतु यह बुकिंग स्थानीय मोड में सहेजी गई है। कनेक्शन मिलने पर स्वतः सिंक होगी।',
    amountCalc: (amount, maturity, months) => `${amount} को ${months} महीनों के लिए रखने पर अनुमानित परिपक्व राशि ${maturity} होगी।`,
    unavailableForTenor: 'इस अवधि के लिए दरें उपलब्ध नहीं हैं।',
    monthsLabel: 'अवधि',
    amountLabel: 'राशि',
    rateLabel: 'ब्याज दर',
    bankLabel: 'बैंक',
    maturityDateLabel: 'परिपक्वता तिथि',
    maturityAmountLabel: 'परिपक्व राशि',
    interestLabel: 'अनुमानित लाभ',
    seniorLabel: 'वरिष्ठ नागरिक',
    fullNameLabel: 'पूरा नाम (आधार अनुसार)',
    mobileLabel: 'मोबाइल नंबर (10 अंक)',
    panLabel: 'PAN (वैकल्पिक)',
    fullNamePlaceholder: 'उदाहरण: रवि कुमार',
    mobilePlaceholder: '9876543210',
    panPlaceholder: 'ABCDE1234F',
    saveProgress: 'सहेजा जा रहा है...',
    saveFailed: 'बुकिंग सहेजी नहीं जा सकी। कृपया फिर से प्रयास करें।',
    noRates: 'दरें अभी उपलब्ध नहीं हैं। कृपया कुछ देर बाद फिर प्रयास करें।',
    bookingConfirmed: 'बुकिंग की पुष्टि हो गई',
    reference: 'संदर्भ',
    branchInfo: 'शाखा जानकारी',
    branchFallback: 'शाखा विवरण आधिकारिक वेबसाइट पर उपलब्ध है।',
    rateSource: 'दर स्रोत',
    updatedAt: 'अद्यतन',
    modeLive: 'लाइव',
    modeCached: 'कैश्ड',
    modeLocal: 'स्थानीय',
    pendingSyncLabel: 'सिंक लंबित (स्थानीय)',
    syncedLabel: 'क्लाउड में सुरक्षित',
    today: 'आज',
  },
  en: {
    header: 'FD Booking — Step by Step',
    s1Prompt: 'What are you saving this money for?',
    s2Prompt: 'How much would you like to invest?',
    s2Hint: 'Minimum ₹1,000 | Maximum ₹5,00,000',
    s3Prompt: 'Based on your goal, Meera suggested this tenor. Confirm or change it.',
    s4Prompt: 'Final booking will happen at the bank. These details are only for your record.',
    s5Prompt: 'Please review all details, then tap Confirm ✅.',
    invalidAmount: 'Please enter an amount between ₹1,000 and ₹5,00,000.',
    invalidName: 'Please enter your full name (as per Aadhaar).',
    invalidMobile: 'Please enter a valid 10-digit mobile number.',
    invalidPan: 'PAN format is invalid. Example: ABCDE1234F',
    suggestTenor: 'Meera Suggestion',
    bestBank: 'Best Bank',
    continueBtn: 'Continue →',
    confirmBtn: 'Confirm ✅',
    shareBtn: 'Share on WhatsApp',
    newFd: 'Start New FD',
    goHome: 'Back to Chat',
    reviewTitle: 'FD Booking Receipt',
    seniorYes: 'Yes',
    seniorNo: 'No',
    bookedMessage: 'Your booking has been saved. Visit branch or bank website to complete FD.',
    stepLabels: ['Goal', 'Amount', 'Tenor', 'Details', 'Review'],
    panNote: 'PAN is optional. Helpful for tax reporting on interest.',
    connected: 'Connected',
    limited: 'Limited mode',
    fallbackSaved: 'This booking was saved locally for safety. It will auto-sync when connection is restored.',
    amountCalc: (amount, maturity, months) => `Estimated maturity for ${amount} over ${months} months is ${maturity}.`,
    unavailableForTenor: 'Rates are unavailable for this tenor.',
    monthsLabel: 'Tenor',
    amountLabel: 'Amount',
    rateLabel: 'Rate',
    bankLabel: 'Bank',
    maturityDateLabel: 'Maturity Date',
    maturityAmountLabel: 'Maturity Amount',
    interestLabel: 'Estimated Gain',
    seniorLabel: 'Senior Citizen',
    fullNameLabel: 'Full name (as per Aadhaar)',
    mobileLabel: 'Mobile number (10 digits)',
    panLabel: 'PAN (optional)',
    fullNamePlaceholder: 'e.g. Ravi Kumar',
    mobilePlaceholder: '9876543210',
    panPlaceholder: 'ABCDE1234F',
    saveProgress: 'Saving...',
    saveFailed: 'Booking could not be saved. Please try again.',
    noRates: 'Rates are unavailable right now. Please retry shortly.',
    bookingConfirmed: 'Booking Confirmed',
    reference: 'Reference',
    branchInfo: 'Branch Info',
    branchFallback: 'Branch details are available on the official website.',
    rateSource: 'Rate source',
    updatedAt: 'Updated',
    modeLive: 'live',
    modeCached: 'cached',
    modeLocal: 'local',
    pendingSyncLabel: 'Pending sync (local)',
    syncedLabel: 'Saved to cloud',
    today: 'Today',
  },
  bho: {
    header: 'एफडी बुकिंग — चरणबद्ध तरीका',
    s1Prompt: 'रउआ ई राशि कवन काम खातिर जमा करत बानी?',
    s2Prompt: 'रउआ कतना राशि निवेश करे चाहत बानी?',
    s2Hint: 'न्यूनतम ₹1,000 | अधिकतम ₹5,00,000',
    s3Prompt: 'रउआ लक्ष्य के हिसाब से अवधि सुझावल गइल बा। पुष्टि करीं चाहे बदलीं।',
    s4Prompt: 'अंतिम बुकिंग बैंक में होई। ई विवरण खाली रिकॉर्ड खातिर बा।',
    s5Prompt: 'सभे जानकारी जाँच लीं, फेर पुष्टि करीं ✅ दबाईं।',
    invalidAmount: 'कृपया ₹1,000 से ₹5,00,000 के बीच राशि डालीं।',
    invalidName: 'कृपया पूरा नाम लिखीं (आधार अनुसार)।',
    invalidMobile: 'कृपया सही 10 अंक वाला मोबाइल नंबर लिखीं।',
    invalidPan: 'PAN प्रारूप गलत बा। उदाहरण: ABCDE1234F',
    suggestTenor: 'मीरा के सुझाव',
    bestBank: 'सबसे बढ़िया बैंक',
    continueBtn: 'आगे बढ़ीं →',
    confirmBtn: 'पुष्टि करीं ✅',
    shareBtn: 'व्हॉट्सऐप पर साझा करीं',
    newFd: 'नया एफडी शुरू करीं',
    goHome: 'चैट पर लउटीं',
    reviewTitle: 'एफडी बुकिंग रसीद',
    seniorYes: 'हँव',
    seniorNo: 'नाहीं',
    bookedMessage: 'रउआ बुकिंग सुरक्षित हो गइल बा। अंतिम एफडी खातिर बैंक शाखा या वेबसाइट पर जाईं।',
    stepLabels: ['लक्ष्य', 'राशि', 'अवधि', 'विवरण', 'समीक्षा'],
    panNote: 'PAN वैकल्पिक बा। ब्याज पर कर रिपोर्टिंग में उपयोगी बा।',
    connected: 'कनेक्शन सक्रिय',
    limited: 'सीमित मोड',
    fallbackSaved: 'ई बुकिंग अभी स्थानीय मोड में सहेजल गइल बा। कनेक्शन मिलतहीं अपने-आप सिंक हो जाई।',
    amountCalc: (amount, maturity, months) => `${amount} के ${months} महीना रखल जाव त अनुमानित परिपक्व राशि ${maturity} होई।`,
    unavailableForTenor: 'एह अवधि खातिर दर उपलब्ध नइखे।',
    monthsLabel: 'अवधि',
    amountLabel: 'राशि',
    rateLabel: 'ब्याज दर',
    bankLabel: 'बैंक',
    maturityDateLabel: 'परिपक्वता तारीख',
    maturityAmountLabel: 'परिपक्व राशि',
    interestLabel: 'अनुमानित फायदा',
    seniorLabel: 'वरिष्ठ नागरिक',
    fullNameLabel: 'पूरा नाम (आधार अनुसार)',
    mobileLabel: 'मोबाइल नंबर (10 अंक)',
    panLabel: 'PAN (वैकल्पिक)',
    fullNamePlaceholder: 'उदाहरण: रवि कुमार',
    mobilePlaceholder: '9876543210',
    panPlaceholder: 'ABCDE1234F',
    saveProgress: 'सहेजल जा रहल बा...',
    saveFailed: 'बुकिंग सहेजल ना जा सकल। फेर कोशिश करीं।',
    noRates: 'दर अभी उपलब्ध नइखे। कुछ देर बाद फेर कोशिश करीं।',
    bookingConfirmed: 'बुकिंग के पुष्टि हो गइल',
    reference: 'संदर्भ',
    branchInfo: 'शाखा जानकारी',
    branchFallback: 'शाखा के जानकारी आधिकारिक वेबसाइट पर उपलब्ध बा।',
    rateSource: 'दर स्रोत',
    updatedAt: 'अद्यतन',
    modeLive: 'लाइव',
    modeCached: 'कैश्ड',
    modeLocal: 'स्थानीय',
    pendingSyncLabel: 'सिंक बाकी बा (स्थानीय)',
    syncedLabel: 'क्लाउड में सुरक्षित',
    today: 'आज',
  },
  bn: {
    header: 'FD Booking — Step by Step',
    s1Prompt: 'এই টাকা কিসের জন্য সঞ্চয় করছেন?',
    s2Prompt: 'কত টাকা বিনিয়োগ করতে চান?',
    s2Hint: 'Minimum ₹1,000 | Maximum ₹5,00,000',
    s3Prompt: 'আপনার লক্ষ্য অনুযায়ী tenor প্রস্তাব করা হয়েছে। নিশ্চিত করুন বা বদলান।',
    s4Prompt: 'Final booking bank-এ হবে। এই তথ্য রেকর্ডের জন্য।',
    s5Prompt: 'সব তথ্য যাচাই করুন, তারপর Confirm ✅ চাপুন।',
    invalidAmount: '₹1,000 থেকে ₹5,00,000 এর মধ্যে amount দিন।',
    invalidName: 'আপনার পূর্ণ নাম লিখুন (Aadhaar অনুযায়ী)।',
    invalidMobile: 'একটি valid 10-digit mobile number দিন।',
    invalidPan: 'PAN format ভুল। Example: ABCDE1234F',
    suggestTenor: 'Meera Suggestion',
    bestBank: 'Best Bank',
    continueBtn: 'পরের ধাপ →',
    confirmBtn: 'Confirm ✅',
    shareBtn: 'WhatsApp Share',
    newFd: 'নতুন FD',
    goHome: 'Chat এ ফিরুন',
    reviewTitle: 'FD Booking Receipt',
    seniorYes: 'হ্যাঁ',
    seniorNo: 'না',
    bookedMessage: 'Booking save হয়েছে। Final FD-এর জন্য branch বা website দেখুন।',
    stepLabels: ['Goal', 'Amount', 'Tenor', 'Details', 'Review'],
    panNote: 'PAN optional। Interest tax reporting-এর জন্য দরকার।',
  },
  ta: {
    header: 'FD Booking — Step by Step',
    s1Prompt: 'இந்த தொகையை எந்த நோக்கத்திற்காக சேமிக்கிறீர்கள்?',
    s2Prompt: 'எவ்வளவு முதலீடு செய்ய விரும்புகிறீர்கள்?',
    s2Hint: 'Minimum ₹1,000 | Maximum ₹5,00,000',
    s3Prompt: 'உங்கள் இலக்குக்கு tenor பரிந்துரைக்கப்பட்டது. உறுதிப்படுத்தவும் அல்லது மாற்றவும்.',
    s4Prompt: 'Final booking bank-ல் நடக்கும். இந்த விவரம் record-க்கு.',
    s5Prompt: 'அனைத்து விவரங்களையும் பார்க்கவும், பிறகு Confirm ✅ அழுத்தவும்.',
    invalidAmount: '₹1,000 முதல் ₹5,00,000 வரை amount கொடுங்கள்.',
    invalidName: 'முழு பெயர் கொடுங்கள் (Aadhaar படி).',
    invalidMobile: 'Valid 10-digit mobile number கொடுங்கள்.',
    invalidPan: 'PAN format தவறு. Example: ABCDE1234F',
    suggestTenor: 'Meera Suggestion',
    bestBank: 'Best Bank',
    continueBtn: 'அடுத்து →',
    confirmBtn: 'Confirm ✅',
    shareBtn: 'WhatsApp Share',
    newFd: 'புதிய FD',
    goHome: 'Chat க்கு திரும்பு',
    reviewTitle: 'FD Booking Receipt',
    seniorYes: 'ஆம்',
    seniorNo: 'இல்லை',
    bookedMessage: 'Booking save ஆனது. Final FDக்கு branch அல்லது website பார்க்கவும்.',
    stepLabels: ['Goal', 'Amount', 'Tenor', 'Details', 'Review'],
    panNote: 'PAN optional. Interest tax reportingக்கு உதவும்.',
  },
};

const chatEl = document.getElementById('bookingChat');
const inputAreaEl = document.getElementById('bookingInputArea');
const loadingOverlay = document.getElementById('loadingOverlay');
const bookingConnStatusEl = document.getElementById('bookingConnStatus');

let removeSessionListener = null;

const state = {
  step: 0,
  goalKey: null,
  amount: null,
  suggestedTenor: 12,
  tenor: 12,
  fullName: '',
  mobile: '',
  pan: '',
  seniorCitizen: false,
  bestBank: null,
  calc: null,
  festivalAlert: null,
  bookingId: null,
  isSaving: false,
  storageMode: null,
  syncState: null,
};

function getLangCopy() {
  return COPY[LANG_CODE] || COPY.hi;
}

function getLanguageName() {
  return LANGUAGE_NAME_MAP[LANG_CODE] || 'hindi';
}

function t(key, fallback = '') {
  const c = getLangCopy();
  if (typeof c[key] === 'undefined' || c[key] === null) {
    return COPY.en[key] || COPY.hi[key] || fallback || key;
  }
  return c[key];
}

function getGoalLabel(goal, code = LANG_CODE) {
  if (!goal || !goal.labels) return '';
  return goal.labels[code] || goal.labels.hi || goal.labels.en || '';
}

function localizeRateMode(mode) {
  const key = mode === 'live' ? 'modeLive' : mode === 'cached' ? 'modeCached' : 'modeLocal';
  return t(key, mode || 'local');
}

function updateConnectionStatus(session) {
  if (!bookingConnStatusEl) return;

  if (session && session.authenticated) {
    const model = session.model ? ` · ${session.model}` : '';
    bookingConnStatusEl.textContent = `${t('connected', 'Connected')}${model}`;
    return;
  }

  bookingConnStatusEl.textContent = t('limited', 'Limited mode');
}

function formatLiveRateMeta() {
  const meta = (typeof FDData !== 'undefined' && typeof FDData.getLiveRatesMeta === 'function')
    ? FDData.getLiveRatesMeta()
    : null;

  if (!meta) return '';

  const stamp = meta.fetchedAt ? new Date(meta.fetchedAt).toLocaleString('en-IN') : '-';
  const mode = localizeRateMode(meta.mode || 'local');
  const note = meta.note ? ` | ${meta.note}` : '';

  return `${t('rateSource', 'Rate source')}: ${mode} | ${t('updatedAt', 'Updated')}: ${stamp}${note}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text || '');
  return div.innerHTML;
}

function formatGoal(goalKey) {
  const goal = GOALS[goalKey];
  if (!goal) return '';
  return getGoalLabel(goal);
}

function addAssistantMessage(text) {
  const row = document.createElement('div');
  row.className = 'message-row assistant';
  row.innerHTML = `
    <div class="msg-avatar">👩‍💼</div>
    <div>
      <div class="msg-bubble">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
      <div class="msg-time">${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
    </div>
  `;
  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function addUserMessage(text) {
  const row = document.createElement('div');
  row.className = 'message-row user';
  row.innerHTML = `
    <div>
      <div class="msg-bubble">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
      <div class="msg-time">${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
    </div>
  `;
  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function updateProgress() {
  const stepEls = document.querySelectorAll('.progress-step');
  const capped = Math.min(state.step, 4);
  const allDone = state.step > 4;

  stepEls.forEach((el, idx) => {
    const circle = el.querySelector('.step-circle');
    const label = el.querySelector('.step-label');

    circle.classList.remove('active', 'done');
    label.classList.remove('active', 'done');

    if (allDone || idx < capped) {
      circle.classList.add('done');
      label.classList.add('done');
    } else if (idx === capped) {
      circle.classList.add('active');
      label.classList.add('active');
    }
  });
}

function computeBestBank() {
  if (!state.amount || !state.tenor) {
    state.bestBank = null;
    state.calc = null;
    state.festivalAlert = null;
    return;
  }

  const comparison = FDData.getComparison(state.tenor, state.amount, state.seniorCitizen);
  const best = comparison?.best?.data || null;

  state.bestBank = best;
  state.calc = best ? FDData.calculateFD(state.amount, best.rate, state.tenor, false) : null;
  state.festivalAlert = CulturalEngine.getFestivalAlert(state.tenor, getLanguageName());

  localStorage.setItem('fd_last_tenor', String(state.tenor));
  localStorage.setItem('fd_compare_tenor', String(state.tenor));
}

function getPromptForStep(step) {
  switch (step) {
    case 0: return t('s1Prompt');
    case 1: return t('s2Prompt');
    case 2: return t('s3Prompt');
    case 3: return t('s4Prompt');
    case 4: return t('s5Prompt');
    default: return t('bookedMessage');
  }
}

function goToStep(nextStep, announce = true) {
  state.step = nextStep;
  updateProgress();
  if (announce) {
    addAssistantMessage(getPromptForStep(nextStep));
  }
  renderStepInput();
}

function renderStepInput() {
  if (state.step === 0) renderGoalStep();
  else if (state.step === 1) renderAmountStep();
  else if (state.step === 2) renderTenorStep();
  else if (state.step === 3) renderDetailsStep();
  else if (state.step === 4) renderReviewStep();
  else renderConfirmedStep();
}

function renderGoalStep() {
  inputAreaEl.innerHTML = `
    <div class="bk-goal-grid">
      ${Object.entries(GOALS).map(([key, value]) => `
        <button class="bk-goal-card" onclick="selectGoal('${key}')">
          <span class="emoji">${value.emoji}</span>
          <span class="label">${escapeHtml(getGoalLabel(value))}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function selectGoal(goalKey) {
  const goal = GOALS[goalKey];
  if (!goal) return;

  state.goalKey = goalKey;
  state.suggestedTenor = goal.tenor;
  state.tenor = goal.tenor;

  addUserMessage(`${goal.emoji} ${getGoalLabel(goal)}`);
  goToStep(1);
}

function renderAmountStep() {
  const amountValue = state.amount || Number(localStorage.getItem('fd_calc_amount') || 50000);

  inputAreaEl.innerHTML = `
    <div class="bk-help-note">${escapeHtml(t('s2Hint'))}</div>
    <div class="bk-chip-row">
      <button class="bk-quick-chip" onclick="setQuickAmount(10000)">₹10K</button>
      <button class="bk-quick-chip" onclick="setQuickAmount(25000)">₹25K</button>
      <button class="bk-quick-chip" onclick="setQuickAmount(50000)">₹50K</button>
      <button class="bk-quick-chip" onclick="setQuickAmount(100000)">₹1L</button>
    </div>

    <input class="bk-input" id="amountInput" type="number" min="1000" max="500000" step="1000" value="${amountValue}">
    <button class="booking-next-btn" onclick="submitAmountStep()">${escapeHtml(t('continueBtn'))}</button>
  `;
}

function setQuickAmount(val) {
  const input = document.getElementById('amountInput');
  if (input) input.value = val;
}

function submitAmountStep() {
  const amount = Number(document.getElementById('amountInput').value || 0);

  if (!Number.isFinite(amount) || amount < 1000 || amount > 500000) {
    addAssistantMessage(t('invalidAmount'));
    return;
  }

  state.amount = Math.round(amount);
  addUserMessage(FDData.formatINR(state.amount));
  computeBestBank();
  goToStep(2);
}

function renderTenorStep() {
  computeBestBank();
  const liveMeta = formatLiveRateMeta();

  const calcLine = state.calc
    ? t('amountCalc')(FDData.formatINR(state.amount), FDData.formatINR(state.calc.maturityAmount), state.tenor)
    : t('unavailableForTenor');

  const bestBankText = state.bestBank
    ? `${t('bestBank')}: ${state.bestBank.name} (${state.bestBank.rate.toFixed(2)}%)`
    : `${t('bestBank')}: -`;

  inputAreaEl.innerHTML = `
    <div class="bk-summary-card">
      <div class="bk-summary-title">${escapeHtml(t('suggestTenor'))}: ${state.suggestedTenor}M</div>
      <div class="bk-summary-line"><strong>${escapeHtml(calcLine)}</strong></div>
    </div>

    ${liveMeta ? `<div class="bk-live-meta">${escapeHtml(liveMeta)}</div>` : ''}

    ${state.festivalAlert ? `<div class="bk-festival-alert">${escapeHtml(state.festivalAlert)}</div>` : ''}
    <div class="bk-best-bank">${escapeHtml(bestBankText)}</div>

    <div class="bk-tenor-buttons">
      ${TENOR_OPTIONS.map((months) => `<button class="bk-tenor-btn ${state.tenor === months ? 'active' : ''}" onclick="pickTenor(${months})">${months}M</button>`).join('')}
    </div>

    <button class="booking-next-btn" onclick="confirmTenorStep()">${escapeHtml(t('continueBtn'))}</button>
  `;
}

function pickTenor(months) {
  state.tenor = Number(months);
  computeBestBank();
  renderTenorStep();
}

function confirmTenorStep() {
  const tenorText = LANG_CODE === 'en' ? `${state.tenor} months` : `${state.tenor} महीने`;
  addUserMessage(tenorText);
  goToStep(3);
}

function renderDetailsStep() {
  inputAreaEl.innerHTML = `
    <div class="bk-help-note">${escapeHtml(t('panNote'))}<br>${escapeHtml(t('s4Prompt'))}</div>

    <div class="bk-form-grid">
      <div>
        <label>${escapeHtml(t('fullNameLabel'))}</label>
        <input class="bk-input" id="fullNameInput" type="text" value="${escapeHtml(state.fullName)}" placeholder="${escapeHtml(t('fullNamePlaceholder'))}">
      </div>
      <div>
        <label>${escapeHtml(t('mobileLabel'))}</label>
        <input class="bk-input" id="mobileInput" type="tel" maxlength="10" value="${escapeHtml(state.mobile)}" placeholder="${escapeHtml(t('mobilePlaceholder'))}">
      </div>
      <div>
        <label>${escapeHtml(t('panLabel'))}</label>
        <input class="bk-input" id="panInput" type="text" maxlength="10" value="${escapeHtml(state.pan)}" placeholder="${escapeHtml(t('panPlaceholder'))}">
      </div>
    </div>

    <div class="bk-switch-row">
      <div style="font-size:12px; font-weight:700; color:#344d64;">${escapeHtml(t('seniorLabel'))}</div>
      <label class="bk-switch">
        <input type="checkbox" id="seniorToggle" ${state.seniorCitizen ? 'checked' : ''}>
        <span class="bk-switch-slider"></span>
      </label>
    </div>

    <button class="booking-next-btn" onclick="submitDetailsStep()">${escapeHtml(t('continueBtn'))}</button>
  `;
}

function submitDetailsStep() {
  const fullName = (document.getElementById('fullNameInput').value || '').trim();
  const mobile = (document.getElementById('mobileInput').value || '').replace(/\D/g, '');
  const pan = (document.getElementById('panInput').value || '').trim().toUpperCase();
  const seniorCitizen = Boolean(document.getElementById('seniorToggle').checked);

  if (fullName.length < 3) {
    addAssistantMessage(t('invalidName'));
    return;
  }
  if (!/^\d{10}$/.test(mobile)) {
    addAssistantMessage(t('invalidMobile'));
    return;
  }
  if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
    addAssistantMessage(t('invalidPan'));
    return;
  }

  state.fullName = fullName;
  state.mobile = mobile;
  state.pan = pan;
  state.seniorCitizen = seniorCitizen;
  computeBestBank();

  addUserMessage(`${state.fullName} • ${state.mobile}`);
  goToStep(4);
}

function getBankShortName(bank) {
  if (!bank) return '-';
  const branch = BANK_BRANCHES[bank.id];
  return branch?.short || bank.name;
}

function buildShareText() {
  const bank = state.bestBank;
  const calc = state.calc;
  if (!bank || !calc) return '';

  const appUrl = `${window.location.origin}/index.html`;
  const amount = FDData.formatINR(state.amount);
  const maturity = FDData.formatINR(calc.maturityAmount);
  const rate = Number(bank.rate).toFixed(2);
  const tenor = state.tenor;

  if (LANG_CODE === 'en') {
    return [
      '🏦 I planned my FD with Bharat Ka Apna FD Advisor!',
      `${amount} → ${maturity} in ${tenor} months @${rate}%`,
      `Bank: ${bank.name}`,
      `Try now: ${appUrl}`,
    ].join('\n');
  }

  if (LANG_CODE === 'bho') {
    return [
      '🏦 हम Bharat Ka Apna FD Advisor से एफडी योजना बनवनी!',
      `${amount} → ${maturity} ${tenor} महीना में @${rate}%`,
      `बैंक: ${bank.name}`,
      `रउआ भी आजमाईं: ${appUrl}`,
    ].join('\n');
  }

  return [
    '🏦 मैंने Bharat Ka Apna FD Advisor से एफडी योजना बनाई!',
    `${amount} → ${maturity} ${tenor} महीनों में @${rate}%`,
    `बैंक: ${bank.name}`,
    `आप भी आजमाएँ: ${appUrl}`,
  ].join('\n');
}

async function shareOnWhatsApp() {
  const text = buildShareText();
  if (!text) return;

  const appUrl = `${window.location.origin}/index.html`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Bharat Ka Apna FD Advisor',
        text,
        url: appUrl,
      });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }

  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function renderReviewStep() {
  computeBestBank();
  const liveMeta = formatLiveRateMeta();

  if (!state.bestBank || !state.calc) {
    addAssistantMessage(t('noRates'));
    return;
  }

  const bank = state.bestBank;
  const calc = state.calc;

  inputAreaEl.innerHTML = `
    <div class="bk-receipt">
      <div class="bk-receipt-title">${escapeHtml(t('reviewTitle'))}</div>

      <div class="bk-receipt-row"><span class="bk-receipt-key">${escapeHtml(t('bankLabel'))}</span><span class="bk-receipt-value">${escapeHtml(bank.name)} (${escapeHtml(getBankShortName(bank))})</span></div>
      <div class="bk-receipt-row"><span class="bk-receipt-key">${escapeHtml(t('amountLabel'))}</span><span class="bk-receipt-value">${FDData.formatINR(state.amount)}</span></div>
      <div class="bk-receipt-row"><span class="bk-receipt-key">${escapeHtml(t('monthsLabel'))}</span><span class="bk-receipt-value">${state.tenor}M</span></div>
      <div class="bk-receipt-row"><span class="bk-receipt-key">${escapeHtml(t('rateLabel'))}</span><span class="bk-receipt-value">${bank.rate.toFixed(2)}%</span></div>
      <div class="bk-receipt-row"><span class="bk-receipt-key">${escapeHtml(t('maturityDateLabel'))}</span><span class="bk-receipt-value">${escapeHtml(calc.maturityDate)}</span></div>
      <div class="bk-receipt-row"><span class="bk-receipt-key">${escapeHtml(t('maturityAmountLabel'))}</span><span class="bk-receipt-value">${FDData.formatINR(calc.maturityAmount)}</span></div>
      <div class="bk-receipt-row"><span class="bk-receipt-key">${escapeHtml(t('interestLabel'))}</span><span class="bk-receipt-value">${FDData.formatINR(calc.interest)}</span></div>
      <div class="bk-receipt-row"><span class="bk-receipt-key">${escapeHtml(t('seniorLabel'))}</span><span class="bk-receipt-value">${state.seniorCitizen ? escapeHtml(t('seniorYes')) : escapeHtml(t('seniorNo'))}</span></div>
    </div>

    ${liveMeta ? `<div class="bk-live-meta">${escapeHtml(liveMeta)}</div>` : ''}
    ${state.festivalAlert ? `<div class="bk-festival-alert">${escapeHtml(state.festivalAlert)}</div>` : ''}

    <div class="bk-actions">
      <button class="bk-btn confirm" id="confirmBtn" onclick="confirmBookingStep()">${escapeHtml(t('confirmBtn'))}</button>
      <button class="bk-btn share" onclick="shareOnWhatsApp()">${escapeHtml(t('shareBtn'))}</button>
    </div>
  `;
}

async function confirmBookingStep() {
  if (state.isSaving) return;

  const confirmBtn = document.getElementById('confirmBtn');
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = t('saveProgress');
  }

  state.isSaving = true;

  try {
    const bank = state.bestBank;
    const calc = state.calc;

    const bookingData = {
      languageCode: LANG_CODE,
      persona: PERSONA,
      goal: {
        key: state.goalKey,
        label: formatGoal(state.goalKey),
      },
      customer: {
        fullName: state.fullName,
        mobile: state.mobile,
        pan: state.pan || null,
        seniorCitizen: state.seniorCitizen,
      },
      bank: {
        id: bank.id,
        name: bank.name,
        shortName: getBankShortName(bank),
      },
      fd: {
        amount: state.amount,
        tenorMonths: state.tenor,
        rate: bank.rate,
        maturityDate: calc.maturityDate,
        maturityAmount: calc.maturityAmount,
        interest: calc.interest,
      },
      festivalAlert: state.festivalAlert,
      status: 'Confirmed',
    };

    const bookingId = await saveBooking(bookingData);
    state.bookingId = bookingId;

    const pendingLocal = typeof isBookingPendingLocal === 'function' && isBookingPendingLocal(bookingId);
    state.storageMode = pendingLocal ? 'local_fallback' : 'puter_kv';
    state.syncState = pendingLocal ? 'pending_sync' : 'synced';

    if (pendingLocal) {
      addAssistantMessage(t('fallbackSaved'));
    }

    addUserMessage(t('confirmBtn'));
    goToStep(5);
  } catch (err) {
    console.error(err);
    addAssistantMessage(t('saveFailed'));
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = t('confirmBtn');
    }
  } finally {
    state.isSaving = false;
  }
}

function resetFlow() {
  state.step = 0;
  state.goalKey = null;
  state.amount = null;
  state.suggestedTenor = 12;
  state.tenor = Number(localStorage.getItem('fd_last_tenor') || 12);
  state.fullName = '';
  state.mobile = '';
  state.pan = '';
  state.seniorCitizen = false;
  state.bestBank = null;
  state.calc = null;
  state.festivalAlert = null;
  state.bookingId = null;
  state.isSaving = false;
  state.storageMode = null;
  state.syncState = null;

  chatEl.innerHTML = `<div class="date-pill"><span>${escapeHtml(t('today'))}</span></div>`;
  updateProgress();
  goToStep(0, true);
}

function renderConfirmedStep() {
  const bank = state.bestBank;
  const branchInfo = bank ? (BANK_BRANCHES[bank.id] || {}) : {};
  const bankName = bank ? bank.name : t('bankLabel');

  const confirmLine = LANG_CODE === 'en'
    ? `Your booking is saved. To complete the FD, visit ${bankName} branch or website.`
    : LANG_CODE === 'bho'
      ? `रउआ बुकिंग सहेजल गइल बा। अंतिम एफडी खातिर ${bankName} शाखा या वेबसाइट पर जाईं।`
      : `आपकी बुकिंग सहेजी जा चुकी है। अंतिम एफडी के लिए ${bankName} शाखा या वेबसाइट पर जाएँ।`;

  const syncTag = state.syncState === 'pending_sync'
    ? t('pendingSyncLabel')
    : t('syncedLabel');

  const liveMeta = formatLiveRateMeta();

  inputAreaEl.innerHTML = `
    <div class="bk-confirm-wrap">
      <div class="bk-confetti">
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="success-icon">🎉</div>
      <div style="font-size:14px; font-weight:800; color:#12465f; margin-bottom:2px;">${escapeHtml(t('bookingConfirmed'))}</div>
      <div style="font-size:12px; color:#4a6276; line-height:1.5;">${escapeHtml(confirmLine)}</div>
      <div class="bk-ref">${escapeHtml(t('reference'))}: ${escapeHtml(state.bookingId || '-')}</div>
      <div class="bk-live-meta" style="margin-top:8px;">${escapeHtml(syncTag)}</div>
      ${liveMeta ? `<div class="bk-live-meta">${escapeHtml(liveMeta)}</div>` : ''}

      <div class="bk-branch-box">
        <strong>${escapeHtml(bank ? bank.name : t('bankLabel'))} ${escapeHtml(t('branchInfo'))}</strong><br>
        ${escapeHtml(branchInfo.nearest || t('branchFallback'))}<br>
        ${branchInfo.website ? `Website: ${escapeHtml(branchInfo.website)}` : ''}
      </div>

      <div class="bk-center-actions">
        <button class="bk-btn share" onclick="shareOnWhatsApp()">${escapeHtml(t('shareBtn'))}</button>
        <button class="bk-btn secondary" onclick="resetFlow()">${escapeHtml(t('newFd'))}</button>
        <button class="bk-btn confirm" onclick="window.location.href='chat.html'">${escapeHtml(t('goHome'))}</button>
      </div>
    </div>
  `;
}

function initSession() {
  if (typeof PuterInit === 'undefined') return;

  if (typeof PuterInit.onSessionStateChange === 'function') {
    removeSessionListener = PuterInit.onSessionStateChange((session) => {
      updateConnectionStatus(session);

      if (session && session.authenticated && typeof syncLocalBookings === 'function') {
        syncLocalBookings().catch(() => {});
      }
    });
  }

  if (typeof PuterInit.getSessionState === 'function') {
    updateConnectionStatus(PuterInit.getSessionState());
  }

  Promise.resolve()
    .then(() => PuterInit.bootstrapSession({ interactive: false }))
    .catch(() => {});
}

async function init() {
  document.getElementById('bookingHeaderTitle').textContent = t('header');

  const labels = t('stepLabels');
  document.getElementById('lblStep1').textContent = labels?.[0] || COPY.hi.stepLabels[0];
  document.getElementById('lblStep2').textContent = labels?.[1] || COPY.hi.stepLabels[1];
  document.getElementById('lblStep3').textContent = labels?.[2] || COPY.hi.stepLabels[2];
  document.getElementById('lblStep4').textContent = labels?.[3] || COPY.hi.stepLabels[3];
  document.getElementById('lblStep5').textContent = labels?.[4] || COPY.hi.stepLabels[4];

  initSession();
  resetFlow();

  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
  }

  Promise.resolve()
    .then(() => FDData.loadRates())
    .then(() => {
      if (state.step >= 2) {
        computeBestBank();
        renderStepInput();
      }
    })
    .catch((err) => {
      console.warn('[BookingUI] FD rates load failed, using local fallback', err);
    });

  window.addEventListener('beforeunload', () => {
    if (typeof removeSessionListener === 'function') {
      removeSessionListener();
    }
  });
}

window.selectGoal = selectGoal;
window.setQuickAmount = setQuickAmount;
window.submitAmountStep = submitAmountStep;
window.pickTenor = pickTenor;
window.confirmTenorStep = confirmTenorStep;
window.submitDetailsStep = submitDetailsStep;
window.confirmBookingStep = confirmBookingStep;
window.shareOnWhatsApp = shareOnWhatsApp;
window.resetFlow = resetFlow;

init();
