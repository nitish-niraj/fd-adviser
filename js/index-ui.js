let selectedLang = null;
  let selectedPersona = null;
  let detectedLangCode = null;
  let landingSessionUnsubscribe = null;

  const LANGUAGE_META = {
    hi: { name: 'Hindi', script: 'हिंदी' },
    bn: { name: 'Bengali', script: 'বাংলা' },
    ta: { name: 'Tamil', script: 'தமிழ்' },
    te: { name: 'Telugu', script: 'తెలుగు' },
    mr: { name: 'Marathi', script: 'मराठी' },
    pa: { name: 'Punjabi', script: 'ਪੰਜਾਬੀ' },
    kn: { name: 'Kannada', script: 'ಕನ್ನಡ' },
    ml: { name: 'Malayalam', script: 'മലയാളം' },
    gu: { name: 'Gujarati', script: 'ગુજરાતી' },
    or: { name: 'Odia', script: 'ଓଡ଼ିଆ' },
    bho: { name: 'Bhojpuri', script: 'भोजपुरी' },
    en: { name: 'English', script: 'English' },
  };

  const LANGUAGE_ALIASES = {
    hi: ['hi', 'hindi', 'हिंदी', 'hindustani'],
    bn: ['bn', 'bangla', 'bengali', 'বাংলা'],
    ta: ['ta', 'tamil', 'தமிழ்'],
    te: ['te', 'telugu', 'తెలుగు'],
    mr: ['mr', 'marathi', 'मराठी'],
    pa: ['pa', 'punjabi', 'panjabi', 'ਪੰਜਾਬੀ'],
    kn: ['kn', 'kannada', 'ಕನ್ನಡ'],
    ml: ['ml', 'malayalam', 'മലയാളം'],
    gu: ['gu', 'gujarati', 'ગુજરાતી'],
    or: ['or', 'odia', 'oriya', 'ଓଡ଼ିଆ'],
    bho: ['bho', 'bhojpuri', 'भोजपुरी', 'gorakhpuri'],
    en: ['en', 'english'],
  };

  const BROWSER_LANG_MAP = {
    hi: 'hi',
    bn: 'bn',
    ta: 'ta',
    te: 'te',
    mr: 'mr',
    pa: 'pa',
    kn: 'kn',
    ml: 'ml',
    gu: 'gu',
    or: 'or',
    bho: 'bho',
    en: 'en',
  };

  const MAP_GEOJSON_URL = 'https://code.highcharts.com/mapdata/countries/in/in-all.geo.json';
  const STATIC_MAP_IMAGE_PATH = 'assets/india-map.png';

  const LANGUAGE_MAP_COLORS = {
    hi: '#FF9933',
    bn: '#138808',
    ta: '#8B0000',
    te: '#003366',
    mr: '#6B2D8B',
    pa: '#FFD700',
    kn: '#CC0000',
    ml: '#006400',
    gu: '#FF6600',
    or: '#008080',
    bho: '#D4760A',
    en: '#5B6B82',
  };

  const STATE_LANGUAGE_MAP = {
    andhrapradesh: 'te',
    arunachalpradesh: 'en',
    assam: 'en',
    bihar: 'hi',
    chhattisgarh: 'hi',
    delhi: 'hi',
    nctofdelhi: 'hi',
    goa: 'en',
    gujarat: 'gu',
    haryana: 'hi',
    himachalpradesh: 'hi',
    jharkhand: 'hi',
    karnataka: 'kn',
    kerala: 'ml',
    madhyapradesh: 'hi',
    maharashtra: 'mr',
    manipur: 'en',
    meghalaya: 'en',
    mizoram: 'en',
    nagaland: 'en',
    odisha: 'or',
    orissa: 'or',
    punjab: 'pa',
    rajasthan: 'hi',
    sikkim: 'en',
    tamilnadu: 'ta',
    telangana: 'te',
    tripura: 'bn',
    uttarpradesh: 'hi',
    uttarakhand: 'hi',
    westbengal: 'bn',
    jammuandkashmir: 'hi',
    ladakh: 'hi',
    andamandnicobarislands: 'en',
    dadraandnagarhavelianddamanandiu: 'gu',
    lakshadweep: 'ml',
    puducherry: 'ta',
    pondicherry: 'ta',
    chandigarh: 'hi',
  };

  const STATE_NAME_ALIASES = {
    jammukashmir: 'jammuandkashmir',
    jammuandkashmirut: 'jammuandkashmir',
    unionterritoryofjammuandkashmir: 'jammuandkashmir',
    theunionterritoryofjammuandkashmir: 'jammuandkashmir',
    theunionterritoryofladakh: 'ladakh',
    nctdelhi: 'nctofdelhi',
  };

  const REQUIRED_MAP_STATE_IDS = ['jammuandkashmir', 'ladakh'];

  const LEGACY_MAP_REGION_DEFS = [
    { id: 'jammuandkashmir', state: 'Jammu and Kashmir', lang: 'hi', color: '#FF9933', script: 'हिंदी', d: 'M124 52 L164 50 L172 78 L134 86 L116 70 Z' },
    { id: 'ladakh', state: 'Ladakh', lang: 'hi', color: '#FF9933', script: 'हिंदी', d: 'M166 44 L210 46 L220 78 L174 84 Z' },
    { id: 'punjab', state: 'Punjab', lang: 'pa', color: '#FFD700', script: 'ਪੰਜਾਬੀ', d: 'M120 78 L148 80 L146 102 L122 104 Z' },
    { id: 'haryana', state: 'Haryana', lang: 'hi', color: '#FF9933', script: 'हिंदी', d: 'M150 95 L170 96 L170 118 L148 118 Z' },
    { id: 'delhi', state: 'Delhi', lang: 'hi', color: '#FF9933', script: 'हिंदी', d: 'M171 103 L179 103 L179 112 L171 112 Z' },
    { id: 'rajasthan', state: 'Rajasthan', lang: 'hi', color: '#FF9933', script: 'हिंदी', d: 'M108 110 L150 108 L156 160 L120 178 L96 150 Z' },
    { id: 'gujarat', state: 'Gujarat', lang: 'gu', color: '#FF6600', script: 'ગુજરાતી', d: 'M78 152 L116 178 L114 214 L82 226 L60 190 Z' },
    { id: 'madhyapradesh', state: 'Madhya Pradesh', lang: 'hi', color: '#FF9933', script: 'हिंदी', d: 'M150 126 L206 126 L214 176 L154 188 L128 168 Z' },
    { id: 'uttarpradesh', state: 'Uttar Pradesh', lang: 'hi', color: '#FF9933', script: 'हिंदी', d: 'M174 96 L238 98 L250 124 L178 126 Z' },
    { id: 'bihar', state: 'Bihar', lang: 'hi', color: '#FF9933', script: 'हिंदी', d: 'M240 106 L274 108 L282 128 L246 132 Z' },
    { id: 'jharkhand', state: 'Jharkhand', lang: 'bn', color: '#138808', script: 'বাংলা', d: 'M226 136 L260 136 L262 156 L232 164 Z' },
    { id: 'westbengal', state: 'West Bengal', lang: 'bn', color: '#138808', script: 'বাংলা', d: 'M276 126 L300 130 L300 184 L278 184 Z' },
    { id: 'odisha', state: 'Odisha', lang: 'or', color: '#008080', script: 'ଓଡ଼ିଆ', d: 'M246 162 L284 164 L292 206 L256 212 Z' },
    { id: 'maharashtra', state: 'Maharashtra', lang: 'mr', color: '#6B2D8B', script: 'मराठी', d: 'M142 190 L220 186 L232 244 L160 254 L124 220 Z' },
    { id: 'telangana', state: 'Telangana', lang: 'te', color: '#003366', script: 'తెలుగు', d: 'M214 230 L246 232 L248 262 L216 268 Z' },
    { id: 'andhrapradesh', state: 'Andhra Pradesh', lang: 'te', color: '#003366', script: 'తెలుగు', d: 'M246 232 L286 236 L294 302 L254 322 Z' },
    { id: 'karnataka', state: 'Karnataka', lang: 'kn', color: '#CC0000', script: 'ಕನ್ನಡ', d: 'M162 254 L218 250 L220 322 L176 332 L148 286 Z' },
    { id: 'tamilnadu', state: 'Tamil Nadu', lang: 'ta', color: '#8B0000', script: 'தமிழ்', d: 'M188 332 L232 328 L242 390 L200 400 Z' },
    { id: 'kerala', state: 'Kerala', lang: 'ml', color: '#006400', script: 'മലയാളം', d: 'M170 336 L188 334 L194 404 L176 410 Z' },
  ];

  const personaPreviews = {
    kisan: {
      default: 'मीरा ऐसे समझाएगी: जैसे खेत में सही खाद देने पर पैदावार बढ़ती है, वैसे ही एफडी में राशि पर सुरक्षित बढ़ोतरी मिलती है।',
      bhojpuri: 'मीरा अइसन समझइहे: जइसे खेत में सही खाद देला पर पैदावार बढ़ेला, ओइसहीं एफडी में धन सुरक्षित रूप से बढ़ेला।',
      english: 'Meera will explain FD like this: Think of FD like improving your crop yield over time.',
    },
    teacher: {
      default: 'मीरा क्रम से समझाएगी: साधारण ब्याज सूत्र SI = P × R × T / 100। ₹50,000 पर 8.50% में लगभग ₹4,250 लाभ।',
      bhojpuri: 'मीरा क्रम से बुझइहे: साधारण ब्याज सूत्र SI = P × R × T / 100। ₹50,000 पर 8.50% से करीब ₹4,250 फायदा।',
      english: 'Meera will explain FD like this: SI = P × R × T / 100, step by step.',
    },
    dukandaar: {
      default: 'मीरा व्यापार की भाषा में समझाएगी: ₹50,000 सुरक्षित रखकर अवधि पूरी होने पर तय लाभ मिलेगा।',
      bhojpuri: 'मीरा कारोबार के हिसाब से बुझइहे: ₹50,000 सुरक्षित राखीं, समय पूरा होते तय फायदा मिली।',
      english: 'Meera will explain FD like this: A guaranteed profit deal, like safe business margin.',
    },
    retired: {
      default: 'मीरा सुरक्षित आय पर ध्यान देगी: ₹5 लाख पर नियमित और भरोसेमंद आय का विकल्प समझाएगी।',
      bhojpuri: 'मीरा सुरक्षित आमदनी पर जोर दीही: ₹5 लाख पर नियमित आ भरोसेमंद आमदनी के तरीका बतइहे।',
      english: 'Meera will explain FD like this: Safe pension-like income with guaranteed returns.',
    },
    student: {
      default: 'मीरा सरल तरीके से बताएगी: छोटी बचत भी समय के साथ तय लाभ देकर बड़ा लक्ष्य पूरा कर सकती है।',
      bhojpuri: 'मीरा आसान तरीका से बुझइहे: छोट बचत भी समय के साथ तय फायदा देके बड़ा लक्ष्य पूरा कर सकेला।',
      english: 'Meera will explain FD like this: Savings goal that auto-completes with bonus.',
    },
    doctor: {
      default: 'मीरा आपातकालीन चिकित्सा निधि और दीर्घकालीन स्वास्थ्य सुरक्षा पर ध्यान देगी।',
      bhojpuri: 'मीरा आपातकालीन दवा के पैसा आ लंबे समय के स्वास्थ्य सुरक्षा के बारे में बुझइहे।',
      english: 'Meera will focus on emergency medical fund and long-term health security.',
    },
    parent: {
      default: 'मीरा बच्चों की शिक्षा, विवाह और भविष्य की सुरक्षा पर ध्यान देगी।',
      bhojpuri: 'मीरा लइका के पढ़ाई, बियाह आ भविष्य सुरक्षा पर जोर दीही।',
      english: 'Meera will prioritize child education, marriage, and future security.',
    },
    business: {
      default: 'मीरा व्यावसायिक निधि, आरक्षित राशि और विकास पूंजी से जोड़ेगी।',
      bhojpuri: 'मीरा कारोबारी पैसा, आरक्षण राशि आ विकास पूंजी से जुड़ा देगा।',
      english: 'Meera will connect FD to business reserve funds and growth capital.',
    },
    nurse: {
      default: 'मीरा नियमित आय, कार्य स्थिरता और सेवानिवृत्ति योजना पर ध्यान देगी।',
      bhojpuri: 'मीरा नियमित आमदनी, काम स्थिरता आ सेवानिवृत्ति योजना पर जोर दीही।',
      english: 'Meera will focus on regular income, job security, and retirement planning.',
    },
    freelancer: {
      default: 'मीरा अनियमित आय को स्थिर करने और बहु-परत निवेश रणनीति बनाने में मदद देगी।',
      bhojpuri: 'मीरा अनियमित आमदनी स्थिर करला आ कई तरह के निवेश योजना बनाइहे।',
      english: 'Meera will help stabilize irregular income and build multi-layer investment strategy.',
    },
  };

  function compactModelLabel(modelId) {
    const id = String(modelId || '').trim();
    if (!id) return '';

    const plain = id.includes('/') ? id.split('/').pop() : id;
    return plain.replace(/[-_]+/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
  }

  function renderLandingSessionState(session) {
    const strip = document.getElementById('landingConnectionStrip');
    const titleEl = document.getElementById('connectionTitle');
    const subtitleEl = document.getElementById('connectionSubtitle');
    if (!strip || !titleEl || !subtitleEl) return;

    strip.classList.remove('online', 'degraded', 'limited');

    if (!session || !session.sdkReady) {
      strip.classList.add('limited');
      titleEl.textContent = 'कनेक्शन सीमित मोड में है';
      subtitleEl.textContent = 'स्थानीय मार्गदर्शन उपलब्ध है';
      return;
    }

    const readableModel = compactModelLabel(session.model);

    if (session.authenticated && !session.degraded) {
      strip.classList.add('online');
      titleEl.textContent = 'एआई कनेक्शन सक्रिय है';
      subtitleEl.textContent = readableModel ? `मॉडल: ${readableModel}` : 'मॉडल तैयार है';
      return;
    }

    strip.classList.add('degraded');
    titleEl.textContent = 'सीमित कनेक्शन: ऑफलाइन सहायक चालू';
    subtitleEl.textContent = session.reason || 'लॉगिन के बाद पूर्ण एआई सहायता मिलेगी';
  }

  async function bootstrapLandingSessionState() {
    if (typeof PuterInit === 'undefined') {
      renderLandingSessionState({ sdkReady: false, degraded: true, authenticated: false });
      return;
    }

    if (typeof PuterInit.onSessionStateChange === 'function') {
      if (landingSessionUnsubscribe) {
        landingSessionUnsubscribe();
      }

      landingSessionUnsubscribe = PuterInit.onSessionStateChange((session) => {
        renderLandingSessionState(session || null);
      });
    }

    if (typeof PuterInit.getSessionState === 'function') {
      renderLandingSessionState(PuterInit.getSessionState());
    }

    if (typeof PuterInit.bootstrapSession === 'function') {
      try {
        const snapshot = await PuterInit.bootstrapSession({ interactive: false });
        renderLandingSessionState(snapshot || null);
      } catch {
        renderLandingSessionState({ sdkReady: false, degraded: true, authenticated: false });
      }
    }
  }

  function getLanguageName(code) {
    const map = {
      hi: 'hindi',
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
      en: 'english',
    };

    return map[code] || 'hindi';
  }

  function updatePersonaPreview() {
    const preview = document.getElementById('personaPreview');
    const previewText = document.getElementById('personaPreviewText');
    if (!preview || !previewText) return;

    if (!selectedPersona) {
      preview.classList.remove('visible');
      previewText.textContent = 'व्यक्ति-प्रकार चुनते ही यहाँ पूर्वावलोकन दिखेगा।';
      return;
    }

    const language = getLanguageName(selectedLang);
    const previewConfig = personaPreviews[selectedPersona] || personaPreviews.kisan;
    const text = (language === 'english') ? previewConfig.english : (language === 'bhojpuri' && previewConfig.bhojpuri) ? previewConfig.bhojpuri : previewConfig.default;

    previewText.textContent = text || 'मीरा सरल उदाहरणों के साथ एफडी समझाएगी।';
    preview.classList.add('visible');
  }

  function setMapHint(text, persistent = false) {
    const chip = document.getElementById('mapLanguageChip');
    if (!chip) return;

    chip.textContent = text;
    chip.classList.toggle('persistent', persistent);
  }

  function animatePersonaTransition() {
    const section = document.getElementById('personaSection');
    if (!section) return;

    section.classList.add('persona-focus');
    setTimeout(() => section.classList.remove('persona-focus'), 800);
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function updateMapSelection(langCode) {
    document.querySelectorAll('.map-state').forEach((path) => {
      const isActive = langCode && path.dataset.lang === langCode;
      path.classList.toggle('active', Boolean(isActive));
    });
  }

  function selectLangCode(langCode, source = 'grid') {
    if (!langCode || !LANGUAGE_META[langCode]) return;

    selectedLang = langCode;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));

    const btn = document.querySelector(`.lang-btn[data-lang="${langCode}"]`);
    if (btn) btn.classList.add('active');

    updateMapSelection(langCode);
    setMapHint(`${LANGUAGE_META[langCode].script} चुनी गई`, true);

    updatePersonaPreview();
    checkReady();

    if (typeof PuterInit !== 'undefined' && typeof PuterInit.getSessionState === 'function') {
      renderLandingSessionState(PuterInit.getSessionState());
    }

    if (source !== 'auto') {
      const prompt = document.getElementById('langAutoDetect');
      if (prompt) prompt.hidden = true;
    }

    if (source === 'map' || source === 'typed') {
      animatePersonaTransition();
    }
  }

  function selectLang(btn) {
    if (!btn || !btn.dataset.lang) return;
    selectLangCode(btn.dataset.lang, 'grid');
  }

  function selectPersona(btn) {
    document.querySelectorAll('.persona-btn').forEach(b => {
      b.classList.remove('active');
      b.classList.remove('persona-pop');
    });

    btn.classList.add('active');
    requestAnimationFrame(() => {
      btn.classList.add('persona-pop');
      setTimeout(() => btn.classList.remove('persona-pop'), 420);
    });

    selectedPersona = btn.dataset.persona;
    updatePersonaPreview();
    checkReady();
  }

  function checkReady() {
    const btn = document.getElementById('startBtn');
    if (!btn) return;
    btn.disabled = !(selectedLang && selectedPersona);
  }

  function normalizeLangInput(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function resolveLanguageInput(inputValue) {
    const normalized = normalizeLangInput(inputValue);
    if (!normalized) return null;

    for (const [code, aliases] of Object.entries(LANGUAGE_ALIASES)) {
      if (aliases.some(alias => normalizeLangInput(alias) === normalized)) {
        return code;
      }
    }

    return null;
  }

  function applyTypedLanguage() {
    const input = document.getElementById('languageTypeInput');
    if (!input) return;

    const code = resolveLanguageInput(input.value);
    if (!code) {
      setMapHint('भाषा नहीं मिली। कृपया सूची से चुनें।', false);
      input.focus();
      return;
    }

    selectLangCode(code, 'typed');
  }

  function detectBrowserLanguageCode() {
    const candidates = [];
    if (Array.isArray(navigator.languages)) {
      candidates.push(...navigator.languages);
    }
    candidates.push(navigator.language || '');

    for (const entry of candidates) {
      const lower = String(entry || '').toLowerCase();
      if (!lower) continue;

      if (BROWSER_LANG_MAP[lower]) return BROWSER_LANG_MAP[lower];
      const short = lower.split('-')[0];
      if (BROWSER_LANG_MAP[short]) return BROWSER_LANG_MAP[short];
    }

    return null;
  }

  function showDetectedLanguagePrompt(code) {
    if (!code || !LANGUAGE_META[code]) return;

    detectedLangCode = code;
    const prompt = document.getElementById('langAutoDetect');
    const text = document.getElementById('langDetectText');

    if (!prompt || !text) return;

    text.textContent = `आपकी भाषा पहचानी गई: ${LANGUAGE_META[code].name}। क्या यह सही है?`;
    prompt.hidden = false;
  }

  function acceptDetectedLanguage() {
    if (detectedLangCode) {
      selectLangCode(detectedLangCode, 'auto');
    }

    const prompt = document.getElementById('langAutoDetect');
    if (prompt) prompt.hidden = true;
  }

  function changeDetectedLanguage() {
    selectedLang = null;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    updateMapSelection(null);
    checkReady();

    const prompt = document.getElementById('langAutoDetect');
    if (prompt) prompt.hidden = true;

    setMapHint('मानचित्र या इनपुट से भाषा चुनें', false);

    const input = document.getElementById('languageTypeInput');
    if (input) input.focus();
  }

  function normalizeStateName(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]/g, '');
  }

  function canonicalizeStateName(value) {
    const normalized = normalizeStateName(value);
    return STATE_NAME_ALIASES[normalized] || normalized;
  }

  function resolveStateLanguage(stateName) {
    const canonical = canonicalizeStateName(stateName);
    return STATE_LANGUAGE_MAP[canonical] || 'hi';
  }

  function createMapPath(svg, config) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', config.d);
    path.setAttribute('fill', config.color || LANGUAGE_MAP_COLORS[config.lang] || LANGUAGE_MAP_COLORS.hi);
    path.setAttribute('class', 'map-state');
    path.setAttribute('data-lang', config.lang);
    path.setAttribute('data-script', config.script);
    path.setAttribute('data-state', config.state);
    path.setAttribute('tabindex', '0');
    path.setAttribute('role', 'button');
    path.setAttribute('aria-label', `${config.state} - ${config.script}`);

    path.addEventListener('pointerenter', () => {
      setMapHint(`${config.script} (${config.state})`, false);
      path.classList.add('hovered');
    });

    path.addEventListener('pointerleave', () => {
      path.classList.remove('hovered');
      if (selectedLang && LANGUAGE_META[selectedLang]) {
        setMapHint(`${LANGUAGE_META[selectedLang].script} चुनी गई`, true);
      } else {
        setMapHint('भाषा देखने के लिए मानचित्र पर टैप या होवर करें', false);
      }
    });

    path.addEventListener('click', () => {
      selectLangCode(config.lang, 'map');
    });

    path.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectLangCode(config.lang, 'map');
      }
    });

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${config.state}: ${config.script}`;
    path.appendChild(title);

    svg.appendChild(path);
  }

  function walkCoordinates(node, visitor) {
    if (!Array.isArray(node)) return;

    if (typeof node[0] === 'number' && typeof node[1] === 'number') {
      visitor(node[0], node[1]);
      return;
    }

    node.forEach(child => walkCoordinates(child, visitor));
  }

  function computeGeoBounds(features) {
    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    features.forEach((feature) => {
      if (!feature || !feature.geometry) return;

      walkCoordinates(feature.geometry.coordinates, (lon, lat) => {
        if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      });
    });

    if (![minLon, maxLon, minLat, maxLat].every(Number.isFinite)) {
      return null;
    }

    return { minLon, maxLon, minLat, maxLat };
  }

  function createProjector(bounds, viewBox) {
    const lonSpan = Math.max(bounds.maxLon - bounds.minLon, 1e-6);
    const latSpan = Math.max(bounds.maxLat - bounds.minLat, 1e-6);
    const contentWidth = viewBox.width - (viewBox.padding * 2);
    const contentHeight = viewBox.height - (viewBox.padding * 2);
    const scale = Math.min(contentWidth / lonSpan, contentHeight / latSpan);
    const offsetX = viewBox.padding + ((contentWidth - (lonSpan * scale)) / 2);
    const offsetY = viewBox.padding + ((contentHeight - (latSpan * scale)) / 2);

    return (point) => {
      const [lon, lat] = point;
      const x = offsetX + ((lon - bounds.minLon) * scale);
      const y = viewBox.height - (offsetY + ((lat - bounds.minLat) * scale));
      return [x, y];
    };
  }

  function ringToPath(ring, project) {
    if (!Array.isArray(ring) || ring.length < 3) return '';

    return `${ring.map((point, index) => {
      const [x, y] = project(point);
      const prefix = index === 0 ? 'M' : 'L';
      return `${prefix} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ')} Z`;
  }

  function polygonToPath(polygon, project) {
    if (!Array.isArray(polygon)) return '';
    return polygon.map(ring => ringToPath(ring, project)).filter(Boolean).join(' ');
  }

  function geometryToPath(geometry, project) {
    if (!geometry || !geometry.type) return '';

    if (geometry.type === 'Polygon') {
      return polygonToPath(geometry.coordinates, project);
    }

    if (geometry.type === 'MultiPolygon') {
      return (geometry.coordinates || []).map(poly => polygonToPath(poly, project)).filter(Boolean).join(' ');
    }

    return '';
  }

  function getFeatureStateName(feature, index) {
    const props = feature && feature.properties ? feature.properties : {};
    return props.name || props.NAME_1 || props['hc-key'] || `State ${index + 1}`;
  }

  function renderLegacyMap(svg) {
    svg.innerHTML = '';

    const outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outline.setAttribute('class', 'map-outline');
    outline.setAttribute('d', 'M112 72 L164 60 L232 82 L292 124 L318 192 L304 282 L252 406 L194 436 L162 424 L142 352 L108 278 L84 208 L86 136 Z');
    svg.appendChild(outline);

    LEGACY_MAP_REGION_DEFS.forEach((config) => createMapPath(svg, config));
    updateMapSelection(selectedLang);
  }

  async function fetchIndiaGeoJson() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(MAP_GEOJSON_URL, {
        signal: controller.signal,
        cache: 'force-cache',
      });

      if (!response.ok) {
        throw new Error(`Map fetch failed with status ${response.status}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  function renderGeoJsonMap(svg, geojson) {
    const features = Array.isArray(geojson && geojson.features) ? geojson.features : [];
    if (features.length === 0) {
      throw new Error('GeoJSON has no features');
    }

    const renderedStateIds = new Set();

    const bounds = computeGeoBounds(features);
    if (!bounds) {
      throw new Error('Could not compute map bounds');
    }

    const project = createProjector(bounds, {
      width: 360,
      height: 460,
      padding: 14,
    });

    svg.innerHTML = '';

    features.forEach((feature, index) => {
      const d = geometryToPath(feature.geometry, project);
      if (!d) return;

      const state = getFeatureStateName(feature, index);
      const stateId = canonicalizeStateName(state) || `state-${index + 1}`;
      const lang = resolveStateLanguage(state);
      const script = (LANGUAGE_META[lang] && LANGUAGE_META[lang].script) || LANGUAGE_META.hi.script;
      const color = LANGUAGE_MAP_COLORS[lang] || LANGUAGE_MAP_COLORS.hi;

      renderedStateIds.add(stateId);

      createMapPath(svg, {
        id: stateId,
        state,
        lang,
        color,
        script,
        d,
      });
    });

    const missingRequiredStates = REQUIRED_MAP_STATE_IDS.filter((stateId) => !renderedStateIds.has(stateId));
    if (missingRequiredStates.length > 0) {
      throw new Error(`GeoJSON map missing required regions: ${missingRequiredStates.join(', ')}`);
    }

    updateMapSelection(selectedLang);
  }

  async function tryRenderStaticMapImage(svg) {
    const image = document.getElementById('indiaMapImage');
    if (!image) return false;

    const source = image.getAttribute('src') || STATIC_MAP_IMAGE_PATH;
    if (!image.getAttribute('src')) {
      image.setAttribute('src', source);
    }

    const loaded = await new Promise((resolve) => {
      if (image.complete) {
        resolve(Boolean(image.naturalWidth));
        return;
      }

      const handleLoad = () => resolve(Boolean(image.naturalWidth));
      const handleError = () => resolve(false);

      image.addEventListener('load', handleLoad, { once: true });
      image.addEventListener('error', handleError, { once: true });
      image.setAttribute('src', source);
    });

    if (!loaded) {
      image.hidden = true;
      if (svg) svg.hidden = false;
      return false;
    }

    image.hidden = false;
    if (svg) svg.hidden = true;
    setMapHint('चित्र मानचित्र सक्रिय है। भाषा चुनने के लिए नीचे बटन चुनें।', false);
    return true;
  }

  async function renderIndiaMap() {
    const svg = document.getElementById('indiaLanguageMap');
    if (!svg) return;

    const staticImageRendered = await tryRenderStaticMapImage(svg);
    if (staticImageRendered) {
      return;
    }

    try {
      const geojson = await fetchIndiaGeoJson();
      svg.hidden = false;
      renderGeoJsonMap(svg, geojson);
      return;
    } catch (err) {
      console.warn('Falling back to built-in map:', err);
      svg.hidden = false;
      renderLegacyMap(svg);
      setMapHint('बैकअप मानचित्र सक्रिय है (जम्मू-कश्मीर और लद्दाख सहित)', false);
    }
  }

  function startApp() {
    if (!selectedLang || !selectedPersona) return;

    // Save to localStorage
    localStorage.setItem('fd_lang', selectedLang);
    localStorage.setItem('fd_persona', selectedPersona);

    // Show loading
    document.getElementById('loadingOverlay').classList.remove('hidden');

    const isDemo = new URLSearchParams(window.location.search).get('demo') === 'true';
    const chatTarget = isDemo ? 'chat.html?demo=true' : 'chat.html';

    // Navigate after brief animation
    setTimeout(() => {
      window.location.href = chatTarget;
    }, 800);
  }

  function goBackFromLanding() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = 'chat.html';
  }

  // Auto-select if previously saved
  window.addEventListener('DOMContentLoaded', () => {
    renderIndiaMap();
    bootstrapLandingSessionState();

    window.addEventListener('beforeunload', () => {
      if (landingSessionUnsubscribe) {
        landingSessionUnsubscribe();
        landingSessionUnsubscribe = null;
      }
    });

    const languageInput = document.getElementById('languageTypeInput');
    if (languageInput) {
      languageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyTypedLanguage();
        }
      });
    }

    const savedLang = localStorage.getItem('fd_lang');
    const savedPersona = localStorage.getItem('fd_persona');

    if (savedLang && LANGUAGE_META[savedLang]) {
      selectLangCode(savedLang, 'saved');
    } else {
      const detectedCode = detectBrowserLanguageCode();
      if (detectedCode) {
        selectLangCode(detectedCode, 'auto');
        showDetectedLanguagePrompt(detectedCode);
      }
    }

    if (savedPersona) {
      const personaBtn = document.querySelector(`.persona-btn[data-persona="${savedPersona}"]`);
      if (personaBtn) selectPersona(personaBtn);
    }

    updatePersonaPreview();
  });
