// ===== State =====
  const langCode = localStorage.getItem('fd_lang') || 'hi';
  let language = AIEngine.langCodeToName[langCode] || 'hindi';
  const persona = localStorage.getItem('fd_persona') || 'kisan';
  console.log('[ChatUI Init] Persisted values - langCode:', langCode, 'language:', language, 'persona:', persona);
  const CHAT_SESSION_KEY = 'fd_chat_session_v1';
  const DEMO_MODE = new URLSearchParams(window.location.search).get('demo') === 'true';
  const MESSAGE_ONLY_MODE = true;

  // ===== Localized UI Strings =====
  const L = {
    thinkingText: {
      hindi: 'मीरा सोच रही है... 🤔',
      english: 'Meera is thinking... 🤔',
      bengali: 'মীরা ভাবছে... 🤔',
      tamil: 'மீரா யோசிக்கிறாள்... 🤔',
      telugu: 'మీరా ఆలోచిస్తోంది... 🤔',
      marathi: 'मीरा विचार करतेय... 🤔',
      punjabi: 'ਮੀਰਾ ਸੋਚ ਰਹੀ ਹੈ... 🤔',
      kannada: 'ಮೀರಾ ಯೋಚಿಸುತ್ತಿದ್ದಾಳೆ... 🤔',
      malayalam: 'മീര ആലോചിക്കുന്നു... 🤔',
      gujarati: 'મીરા વિચારે છે... 🤔',
      odia: 'ମୀରା ଭାବୁଛି... 🤔',
      bhojpuri: 'मीरा सोच रहल बिया... 🤔',
    },
    placeholder: {
      hindi: 'हिंदी में टाइप करें...',
      english: 'Type your question...',
      bengali: 'বাংলায় টাইপ করুন...',
      tamil: 'தமிழில் டைப் செய்யுங்கள்...',
      telugu: 'తెలుగులో టైప్ చేయండి...',
      marathi: 'मराठीत टाइप करा...',
      punjabi: 'ਪੰਜਾਬੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ...',
      kannada: 'ಕನ್ನಡದಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...',
      malayalam: 'മലയാളത്തിൽ ടൈപ്പ് ചെയ്യൂ...',
      gujarati: 'ગુજરાતીમાં ટાઈપ કરો...',
      odia: 'ଓଡ଼ିଆରେ ଟାଇପ କରନ୍ତୁ...',
      bhojpuri: 'भोजपुरी में टाइप करीं...',
    },
    online: {
      hindi: 'ऑनलाइन', english: 'Online', bengali: 'অনলাইন', tamil: 'ஆன்லைன்',
      telugu: 'ఆన్‌లైన్', marathi: 'ऑनलाइन', punjabi: 'ਔਨਲਾਈਨ', kannada: 'ಆನ್‌ಲೈನ್',
      malayalam: 'ഓൺലൈൻ', gujarati: 'ઓનલાઇન', odia: 'ଅନଲାଇନ', bhojpuri: 'ऑनलाइन',
    },
    voiceModeOn: {
      hindi: 'वॉइस मोड चालू', english: 'Voice Mode ON', bengali: 'ভয়েস মোড চালু',
      tamil: 'குரல் பயன்முறை இயக்கம்', telugu: 'వాయిస్ మోడ్ ఆన్', marathi: 'व्हॉइस मोड चालू',
      punjabi: 'ਵੌਇਸ ਮੋਡ ਚਾਲੂ', kannada: 'ವಾಯ್ಸ್ ಮೋಡ್ ಆನ್', malayalam: 'വോയ്സ് മോഡ് ഓൺ',
      gujarati: 'વૉઇસ મોડ ચાલુ', odia: 'ଭଏସ ମୋଡ ଚାଲୁ', bhojpuri: 'वॉइस मोड चालू',
    },
    speak: {
      hindi: 'बोलिए...', english: 'Speak...', bengali: 'বলুন...', tamil: 'பேசுங்கள்...',
      telugu: 'చెప్పండి...', marathi: 'बोला...', punjabi: 'ਬੋਲੋ...', kannada: 'ಮಾತನಾಡಿ...',
      malayalam: 'പറയൂ...', gujarati: 'બોલો...', odia: 'କୁହନ୍ତୁ...', bhojpuri: 'बोलीं...',
    },
    listening: {
      hindi: 'सुन रहे हैं...', english: 'Listening...', bengali: 'শুনছি...', tamil: 'கேட்கிறேன்...',
      telugu: 'వింటున్నాను...', marathi: 'ऐकतोय...', punjabi: 'ਸੁਣ ਰਿਹਾ ਹਾਂ...', kannada: 'ಕೇಳುತ್ತಿದ್ದೇನೆ...',
      malayalam: 'കേൾക്കുന്നു...', gujarati: 'સાંભળી રહ્યા છીએ...', odia: 'ଶୁଣୁଛି...', bhojpuri: 'सुन रहल बानी...',
    },
    recording: {
      hindi: 'रिकॉर्ड हो रहा है...', english: 'Recording...', bengali: 'রেকর্ড হচ্ছে...',
      tamil: 'பதிவு செய்கிறது...', telugu: 'రికార్డ్ అవుతోంది...', marathi: 'रेकॉर्ड होतंय...',
      punjabi: 'ਰਿਕਾਰਡ ਹੋ ਰਿਹਾ ਹੈ...', kannada: 'ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ...',
      malayalam: 'റെക്കോർഡ് ചെയ്യുന്നു...', gujarati: 'રેકોર્ડ થઈ રહ્યું છે...', odia: 'ରେକର୍ଡ ହେଉଛି...',
      bhojpuri: 'रिकॉर्ड हो रहल बा...',
    },
    tryAgain: {
      hindi: 'दोबारा बोलिए', english: 'Please try again', bengali: 'আবার বলুন',
      tamil: 'மீண்டும் முயற்சிக்கவும்', telugu: 'మళ్ళీ ప్రయత్నించండి', marathi: 'पुन्हा बोला',
      punjabi: 'ਦੁਬਾਰਾ ਬੋਲੋ', kannada: 'ಮತ್ತೆ ಹೇಳಿ', malayalam: 'വീണ്ടും പറയൂ',
      gujarati: 'ફરી બોલો', odia: 'ପୁଣି କୁହନ୍ତୁ', bhojpuri: 'दोबारा बोलीं',
    },
    readyPrompt: {
      hindi: 'आप तैयार हों तो बोलिए 😊', english: 'Speak when you are ready 😊',
      bengali: 'তৈরি হলে বলুন 😊', tamil: 'தயாரானால் பேசுங்கள் 😊',
      telugu: 'సిద్ధంగా ఉంటే చెప్పండి 😊', marathi: 'तयार असाल तर बोला 😊',
      punjabi: 'ਤਿਆਰ ਹੋ ਤਾਂ ਬੋਲੋ 😊', kannada: 'ಸಿದ್ಧವಾಗಿದ್ದರೆ ಹೇಳಿ 😊',
      malayalam: 'തയ്യാറായാൽ പറയൂ 😊', gujarati: 'તૈયાર હો તો બોલો 😊',
      odia: 'ପ୍ରସ୍ତୁତ ହେଲେ କୁହନ୍ତୁ 😊', bhojpuri: 'तैयार होखीं त बोलीं 😊',
    },
    today: {
      hindi: 'आज', english: 'Today', bengali: 'আজ', tamil: 'இன்று',
      telugu: 'ఈ రోజు', marathi: 'आज', punjabi: 'ਅੱਜ', kannada: 'ಇಂದು',
      malayalam: 'ഇന്ന്', gujarati: 'આજે', odia: 'ଆଜି', bhojpuri: 'आज',
    },
    encryptionNotice: {
      hindi: '🔒 AI सलाहकार। आपकी बैंकिंग जानकारी सुरक्षित है।',
      english: '🔒 AI-powered advisor. Your banking details are not stored.',
      bengali: '🔒 AI উপদেষ্টা। আপনার ব্যাংকিং তথ্য সুরক্ষিত।',
      tamil: '🔒 AI ஆலோசகர். உங்கள் வங்கி தகவல்கள் பாதுகாப்பானவை.',
      telugu: '🔒 AI సలహాదారు. మీ బ్యాంకింగ్ వివరాలు భద్రంగా ఉన్నాయి.',
      marathi: '🔒 AI सल्लागार. तुमची बँकिंग माहिती सुरक्षित आहे.',
      punjabi: '🔒 AI ਸਲਾਹਕਾਰ। ਤੁਹਾਡੀ ਬੈਂਕਿੰਗ ਜਾਣਕਾਰੀ ਸੁਰੱਖਿਅਤ ਹੈ।',
      kannada: '🔒 AI ಸಲಹೆಗಾರ. ನಿಮ್ಮ ಬ್ಯಾಂಕಿಂಗ್ ಮಾಹಿತಿ ಸುರಕ್ಷಿತ.',
      malayalam: '🔒 AI ഉപദേശകൻ. നിങ്ങളുടെ ബാങ്കിംഗ് വിവരങ്ങൾ സുരക്ഷിതം.',
      gujarati: '🔒 AI સલાહકાર. તમારી બેંકિંગ માહિતી સુરક્ષિત છે.',
      odia: '🔒 AI ଉପଦେଷ୍ଟା। ଆପଣଙ୍କ ବ୍ୟାଙ୍କିଂ ତଥ୍ୟ ସୁରକ୍ଷିତ।',
      bhojpuri: '🔒 AI सलाहकार। रउआ के बैंकिंग जानकारी सुरक्षित बा।',
    },
    bookingStart: {
      hindi: 'ठीक है! आपकी बुकिंग शुरू करते हैं...',
      english: 'Great! Let us start your FD booking now...',
      bengali: 'বাহ! আপনার বুকিং শুরু করি...',
      tamil: 'சரி! உங்கள் FD புக்கிங் தொடங்குகிறோம்...',
      telugu: 'సరే! మీ FD బుకింగ్ ప్రారంభిస్తాం...',
      marathi: 'ठीक आहे! तुमची बुकिंग सुरू करतो...',
      punjabi: 'ਠੀਕ ਹੈ! ਤੁਹਾਡੀ ਬੁਕਿੰਗ ਸ਼ੁਰੂ ਕਰਦੇ ਹਾਂ...',
      kannada: 'ಸರಿ! ನಿಮ್ಮ ಬುಕಿಂಗ್ ಪ್ರಾರಂಭಿಸೋಣ...',
      malayalam: 'ശരി! നിങ്ങളുടെ ബുക്കിംഗ് ആരംഭിക്കാം...',
      gujarati: 'ઠીક છે! તમારી બુકિંગ શરૂ કરીએ...',
      odia: 'ଠିକ ଅଛି! ଆପଣଙ୍କ ବୁକିଂ ଆରମ୍ଭ କରୁଛୁ...',
      bhojpuri: 'ठीक बा! रउआ के बुकिंग शुरू करत बानी...',
    },
  };

  function getL(key) {
    const map = L[key];
    if (!map) return key;
    return map[language] || map.hindi || key;
  }

  const chatMessagesEl = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const micBtn = document.getElementById('micBtn');
  const connectBtn = document.getElementById('connectBtn');
  const aiSettingsToggle = document.getElementById('aiSettingsToggle');
  const aiSettingsPanel = document.getElementById('aiSettingsPanel');
  const aiProviderSelect = document.getElementById('aiProviderSelect');
  const aiModelSelect = document.getElementById('aiModelSelect');
  const refreshModelsBtn = document.getElementById('refreshModelsBtn');
  const speechStyleToggle = document.getElementById('speechStyleToggle');
  const aiSettingsStatus = document.getElementById('aiSettingsStatus');
  const langBadge = document.getElementById('langBadge');
  const headerStatus = document.getElementById('headerStatus');
  const voiceModeBtn = document.getElementById('voiceModeBtn');
  const voiceModeBadge = document.getElementById('voiceModeBadge');
  const voiceReadyPrompt = document.getElementById('voiceReadyPrompt');
  const installBanner = document.getElementById('installBanner');
  const installBannerBtn = document.getElementById('installBannerBtn');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const myBookingsSheet = document.getElementById('myBookingsSheet');
  const myBookingsBackdrop = document.getElementById('myBookingsBackdrop');
  const myBookingsList = document.getElementById('myBookingsList');

  // Full chat history for AI context
  let chatHistory = [];
  let isTyping = false;
  let lastDiscussedTenorMonths = Number(localStorage.getItem('fd_last_tenor') || localStorage.getItem('fd_compare_tenor') || 12);
  let myBookingsInterval = null;
  let voiceModeEnabled = localStorage.getItem('fd_voice_mode') === 'on';
  let continuousVoiceMode = false;
  let voiceModeBeforeContinuous = false;
  let isVoiceCaptureInProgress = false;
  let micPressTimer = null;
  let micLongPressTriggered = false;
  let voiceLoopTimer = null;
  let installBannerShown = localStorage.getItem('fd_install_prompt_seen') === 'yes';
  let firstAIInteractionDone = false;
  let demoModeRunning = false;
  let isRestoringChatSession = false;
  let uiMessages = [];
  let sessionState = {
    sdkReady: false,
    authenticated: false,
    degraded: true,
    model: null,
    modelProvider: null,
    modelSelectionSource: 'default',
    preferredProvider: null,
    preferredModel: null,
    reason: '',
  };
  let removeSessionListener = null;
  let lastSessionNotice = '';
  let modelMetaShown = false;
  let connectHintShown = false;
  let isConnectingCloud = false;
  let autoConnectAttempted = false;
  let aiSettingsOpen = false;
  let speechStyleEnabled = true;
  let lastSpeechPathNotice = '';

  const LAST_CALC_KEY = 'fd_last_calc_share';

  function updateInputPlaceholder() {
    if (!chatInput) return;
    chatInput.placeholder = getL('placeholder');
  }

  function getConnectivityLabel() {
    const modelTag = sessionState.model ? ` · ${sessionState.model}` : '';
    const providerTag = sessionState.modelProvider ? ` (${sessionState.modelProvider})` : '';

    if (language === 'english') {
      return sessionState.authenticated ? `Connected${modelTag}${providerTag}` : 'Limited mode';
    }

    if (sessionState.authenticated) {
      return `संपर्क सक्रिय${modelTag}${providerTag}`;
    }

    return 'सीमित मोड';
  }

  function getConnectButtonMeta() {
    if (isConnectingCloud) {
      return {
        icon: '⏳',
        disabled: true,
        title: language === 'english' ? 'Connecting cloud AI...' : 'क्लाउड एआई कनेक्ट हो रहा है...'
      };
    }

    if (sessionState.authenticated) {
      return {
        icon: '✅',
        disabled: false,
        title: language === 'english' ? 'Cloud AI connected' : 'क्लाउड एआई कनेक्ट है'
      };
    }

    return {
      icon: '🔐',
      disabled: false,
      title: language === 'english' ? 'Connect cloud AI' : 'क्लाउड एआई कनेक्ट करें'
    };
  }

  function renderConnectButton() {
    if (!connectBtn) return;

    const meta = getConnectButtonMeta();
    connectBtn.textContent = meta.icon;
    connectBtn.disabled = meta.disabled;
    connectBtn.title = meta.title;
    connectBtn.setAttribute('aria-label', meta.title);
  }

  function escapeOptionLabel(text) {
    const div = document.createElement('div');
    div.textContent = String(text || '');
    return div.innerHTML;
  }

  function setAISettingsStatus(text) {
    if (!aiSettingsStatus) return;
    aiSettingsStatus.textContent = text || '';
  }

  function getAISettingsStatusText(type, details = '') {
    const map = {
      loading: language === 'english' ? 'Loading providers and models...' : 'प्रोवाइडर और मॉडल लोड हो रहे हैं...',
      ready: language === 'english' ? 'Provider/model preferences are ready.' : 'प्रोवाइडर/मॉडल सेटिंग तैयार है।',
      unsupported: language === 'english' ? 'Model controls are unavailable right now.' : 'मॉडल कंट्रोल अभी उपलब्ध नहीं हैं।',
      empty: language === 'english' ? 'No models available in current context.' : 'वर्तमान स्थिति में मॉडल उपलब्ध नहीं हैं।',
      applyingProvider: language === 'english' ? 'Applying provider preference...' : 'प्रोवाइडर सेटिंग लागू की जा रही है...',
      applyingModel: language === 'english' ? 'Applying model preference...' : 'मॉडल सेटिंग लागू की जा रही है...',
      refreshed: language === 'english' ? 'Model catalog refreshed.' : 'मॉडल सूची अपडेट हो गई।',
      failed: language === 'english' ? 'Could not load model controls.' : 'मॉडल कंट्रोल लोड नहीं हो पाए।',
    };

    const base = map[type] || map.ready;
    return details ? `${base} ${details}` : base;
  }

  function getModelOptionLabel(model) {
    const id = String(model?.id || '').trim();
    if (!id) return '';

    const name = String(model?.name || '').trim();
    const provider = String(model?.provider || '').trim();
    if (name && name.toLowerCase() !== id.toLowerCase()) {
      return `${name} (${id})${provider ? ` · ${provider}` : ''}`;
    }

    return `${id}${provider ? ` · ${provider}` : ''}`;
  }

  function renderProviderOptions(providers, selectedProvider = '') {
    if (!aiProviderSelect) return;

    const selectedKey = String(selectedProvider || '').trim().toLowerCase();
    const list = Array.isArray(providers) ? providers : [];
    const options = ['<option value="">Auto</option>'];

    list.forEach((provider) => {
      const value = String(provider || '').trim();
      if (!value) return;
      const selected = value.toLowerCase() === selectedKey ? 'selected' : '';
      options.push(`<option value="${escapeOptionLabel(value)}" ${selected}>${escapeOptionLabel(value)}</option>`);
    });

    aiProviderSelect.innerHTML = options.join('');
  }

  function renderModelOptions(models, selectedModel = '') {
    if (!aiModelSelect) return;

    const selectedKey = String(selectedModel || '').trim().toLowerCase();
    const list = Array.isArray(models) ? models : [];
    const options = ['<option value="">Auto</option>'];

    list.forEach((model) => {
      const id = String(model?.id || '').trim();
      if (!id) return;
      const label = getModelOptionLabel(model);
      const selected = id.toLowerCase() === selectedKey ? 'selected' : '';
      options.push(`<option value="${escapeOptionLabel(id)}" ${selected}>${escapeOptionLabel(label)}</option>`);
    });

    aiModelSelect.innerHTML = options.join('');
  }

  function syncSpeechStyleState() {
    if (typeof VoiceEngine !== 'undefined' && typeof VoiceEngine.getSpeechStyleState === 'function') {
      const state = VoiceEngine.getSpeechStyleState();
      speechStyleEnabled = Boolean(state?.enabled);
    } else if (typeof window.getSpeechStyleState === 'function') {
      const state = window.getSpeechStyleState();
      speechStyleEnabled = Boolean(state?.enabled);
    }

    if (speechStyleToggle) {
      speechStyleToggle.checked = speechStyleEnabled;
    }
  }

  function setSpeechStyleMode(enabled) {
    const nextEnabled = Boolean(enabled);

    if (typeof VoiceEngine !== 'undefined' && typeof VoiceEngine.setSpeechStyleEnabled === 'function') {
      speechStyleEnabled = Boolean(VoiceEngine.setSpeechStyleEnabled(nextEnabled));
    } else if (typeof window.setSpeechStyleMode === 'function') {
      speechStyleEnabled = Boolean(window.setSpeechStyleMode(nextEnabled));
    } else {
      speechStyleEnabled = nextEnabled;
    }

    if (speechStyleToggle) {
      speechStyleToggle.checked = speechStyleEnabled;
    }

    return speechStyleEnabled;
  }

  function announceSpeechPath(path) {
    if (!path || path === lastSpeechPathNotice) return;
    lastSpeechPathNotice = path;

    if (path === 'speech2speech') {
      const msg = language === 'english'
        ? 'Speech path: speech2speech style mode is active.'
        : 'स्पीच पाथ: speech2speech स्टाइल मोड सक्रिय है।';
      addInfoBubble(msg, 'voice');
      return;
    }

    if (path === 'txt2speech') {
      const msg = language === 'english'
        ? 'Speech path: direct text-to-speech fallback in use.'
        : 'स्पीच पाथ: direct text-to-speech fallback उपयोग में है।';
      addInfoBubble(msg, 'voice');
      return;
    }

    if (path === 'browser') {
      const msg = language === 'english'
        ? 'Speech path: browser voice fallback in use.'
        : 'स्पीच पाथ: ब्राउज़र वॉइस fallback उपयोग में है।';
      addInfoBubble(msg, 'voice');
    }
  }

  function setAISettingsPanelOpen(nextOpen) {
    aiSettingsOpen = Boolean(nextOpen);
    if (aiSettingsPanel) {
      aiSettingsPanel.hidden = !aiSettingsOpen;
    }
    if (aiSettingsToggle) {
      aiSettingsToggle.classList.toggle('active', aiSettingsOpen);
    }
  }

  function getCloudConnectHintText() {
    return language === 'english'
      ? 'Tap 🔐 to connect cloud AI for live responses.'
      : 'लाइव उत्तर के लिए ऊपर 🔐 दबाकर क्लाउड एआई कनेक्ट करें।';
  }

  async function connectCloudAI(options = {}) {
    const {
      source = 'manual',
      showSuccessBubble = true,
      showFailureBubble = true,
    } = options;

    if (isConnectingCloud) {
      return false;
    }

    if (typeof PuterInit === 'undefined' || typeof PuterInit.ensureAuthenticated !== 'function') {
      if (showFailureBubble) {
        const msg = language === 'english'
          ? 'Cloud service is unavailable right now. Local guidance is still active.'
          : 'क्लाउड सेवा अभी उपलब्ध नहीं है। स्थानीय सलाह जारी है।';
        addInfoBubble(msg, 'voice');
      }
      return false;
    }

    isConnectingCloud = true;
    renderConnectButton();

    try {
      const connected = await PuterInit.ensureAuthenticated({ interactive: true, reason: `chat-${source}` });

      if (typeof PuterInit.getSessionState === 'function') {
        sessionState = {
          ...sessionState,
          ...PuterInit.getSessionState(),
        };
      }

      if (connected) {
        connectHintShown = false;
        await refreshAISettings({ forceRefresh: true, silent: true });
        if (showSuccessBubble) {
          const msg = language === 'english'
            ? 'Cloud AI connected. You will now get live responses.'
            : 'क्लाउड एआई कनेक्ट हो गया। अब लाइव उत्तर मिलेंगे।';
          addInfoBubble(msg, 'voice');
        }
        return true;
      }

      if (showFailureBubble) {
        const msg = language === 'english'
          ? 'Connection is still limited. Local guidance will continue.'
          : 'कनेक्शन अभी सीमित है। स्थानीय सलाह जारी रहेगी।';
        addInfoBubble(msg, 'voice');
      }
      return false;
    } catch (err) {
      console.warn('[ChatUI] connectCloudAI failed:', err);
      if (showFailureBubble) {
        const msg = language === 'english'
          ? 'Cloud connection failed. Local guidance will continue.'
          : 'क्लाउड कनेक्शन असफल रहा। स्थानीय सलाह जारी रहेगी।';
        addInfoBubble(msg, 'voice');
      }
      return false;
    } finally {
      isConnectingCloud = false;
      applyBaseHeaderStatus();
      renderConnectButton();
    }
  }

  async function refreshModelsForCurrentProvider(forceRefresh = false) {
    if (!aiModelSelect) return [];

    if (typeof PuterInit === 'undefined' || typeof PuterInit.listModels !== 'function') {
      renderModelOptions([], '');
      return [];
    }

    const provider = String(aiProviderSelect?.value || '').trim();
    const models = await PuterInit.listModels(provider || null, forceRefresh);
    const preference = typeof PuterInit.getPreferredModelSelection === 'function'
      ? PuterInit.getPreferredModelSelection()
      : { model: null };

    renderModelOptions(models, preference?.model || sessionState.preferredModel || sessionState.model || '');
    return models;
  }

  async function resolveAndSyncModelPreference(options = {}) {
    const { announce = false, source = 'settings' } = options;

    if (typeof PuterInit === 'undefined' || typeof PuterInit.resolveChatModel !== 'function') {
      return;
    }

    const resolved = await PuterInit.resolveChatModel(true);

    if (typeof PuterInit.getSessionState === 'function') {
      sessionState = {
        ...sessionState,
        ...PuterInit.getSessionState(),
      };
    }

    applyBaseHeaderStatus();
    renderConnectButton();

    if (announce && resolved?.model) {
      const line = language === 'english'
        ? `Using ${resolved.model}${resolved.provider ? ` (${resolved.provider})` : ''} for chat.`
        : `अब चैट के लिए ${resolved.model}${resolved.provider ? ` (${resolved.provider})` : ''} उपयोग होगा।`;
      addInfoBubble(line, 'fact');
    }

    if (source === 'provider') {
      setAISettingsStatus(getAISettingsStatusText('ready', resolved?.provider ? `(provider: ${resolved.provider})` : ''));
    } else if (source === 'model') {
      setAISettingsStatus(getAISettingsStatusText('ready', resolved?.model ? `(model: ${resolved.model})` : ''));
    } else {
      setAISettingsStatus(getAISettingsStatusText('ready'));
    }
  }

  async function refreshAISettings(options = {}) {
    const {
      forceRefresh = false,
      silent = false,
    } = options;

    syncSpeechStyleState();

    if (!aiProviderSelect || !aiModelSelect) {
      return;
    }

    if (
      typeof PuterInit === 'undefined' ||
      typeof PuterInit.listModelProviders !== 'function' ||
      typeof PuterInit.listModels !== 'function'
    ) {
      aiProviderSelect.disabled = true;
      aiModelSelect.disabled = true;
      setAISettingsStatus(getAISettingsStatusText('unsupported'));
      return;
    }

    aiProviderSelect.disabled = true;
    aiModelSelect.disabled = true;
    setAISettingsStatus(getAISettingsStatusText('loading'));

    try {
      const preference = typeof PuterInit.getPreferredModelSelection === 'function'
        ? PuterInit.getPreferredModelSelection()
        : { provider: null, model: null };

      const providers = await PuterInit.listModelProviders(forceRefresh);
      renderProviderOptions(providers, preference?.provider || sessionState.preferredProvider || '');

      const models = await refreshModelsForCurrentProvider(forceRefresh);
      aiProviderSelect.disabled = false;
      aiModelSelect.disabled = false;

      if (!models.length) {
        setAISettingsStatus(getAISettingsStatusText('empty'));
      } else {
        const selectedProvider = String(aiProviderSelect.value || '').trim();
        const details = selectedProvider
          ? `(provider: ${selectedProvider}, models: ${models.length})`
          : `(models: ${models.length})`;
        setAISettingsStatus(getAISettingsStatusText(forceRefresh ? 'refreshed' : 'ready', details));
      }

      if (forceRefresh && !silent) {
        const msg = language === 'english'
          ? 'Provider/model catalog refreshed.'
          : 'प्रोवाइडर/मॉडल सूची अपडेट हो गई।';
        addInfoBubble(msg, 'fact');
      }
    } catch (err) {
      console.warn('[ChatUI] refreshAISettings failed:', err);
      aiProviderSelect.disabled = false;
      aiModelSelect.disabled = false;
      setAISettingsStatus(getAISettingsStatusText('failed'));
    }
  }

  function bindAISettingsControls() {
    if (aiSettingsToggle) {
      aiSettingsToggle.addEventListener('click', async () => {
        const nextOpen = !aiSettingsOpen;
        setAISettingsPanelOpen(nextOpen);
        if (nextOpen) {
          await refreshAISettings({ forceRefresh: false, silent: true });
        }
      });
    }

    if (refreshModelsBtn) {
      refreshModelsBtn.addEventListener('click', async () => {
        await refreshAISettings({ forceRefresh: true });
      });
    }

    if (aiProviderSelect) {
      aiProviderSelect.addEventListener('change', async () => {
        if (typeof PuterInit === 'undefined' || typeof PuterInit.setPreferredProvider !== 'function') {
          return;
        }

        const provider = String(aiProviderSelect.value || '').trim() || null;
        PuterInit.setPreferredProvider(provider);
        setAISettingsStatus(getAISettingsStatusText('applyingProvider'));

        await refreshModelsForCurrentProvider(true);
        await resolveAndSyncModelPreference({ announce: true, source: 'provider' });
      });
    }

    if (aiModelSelect) {
      aiModelSelect.addEventListener('change', async () => {
        if (typeof PuterInit === 'undefined' || typeof PuterInit.setPreferredModel !== 'function') {
          return;
        }

        const model = String(aiModelSelect.value || '').trim() || null;
        const provider = String(aiProviderSelect?.value || '').trim() || null;
        PuterInit.setPreferredModel(model, provider);
        setAISettingsStatus(getAISettingsStatusText('applyingModel'));

        await resolveAndSyncModelPreference({ announce: true, source: 'model' });
      });
    }

    if (speechStyleToggle) {
      speechStyleToggle.addEventListener('change', () => {
        const enabled = setSpeechStyleMode(Boolean(speechStyleToggle.checked));
        const msg = enabled
          ? (language === 'english' ? 'Speech style mode enabled.' : 'स्पीच स्टाइल मोड चालू हो गया।')
          : (language === 'english' ? 'Speech style mode disabled.' : 'स्पीच स्टाइल मोड बंद हो गया।');
        addInfoBubble(msg, 'voice');
      });
    }
  }

  function applyBaseHeaderStatus() {
    if (!headerStatus) return;
    if (isTyping) return;

    if (voiceModeEnabled || continuousVoiceMode) {
      headerStatus.textContent = getL('voiceModeOn');
      headerStatus.style.fontStyle = 'normal';
      renderConnectButton();
      return;
    }

    headerStatus.textContent = getConnectivityLabel();
    headerStatus.style.fontStyle = sessionState.authenticated ? 'normal' : 'italic';
    renderConnectButton();
  }

  function renderTrustStrip() {
    const row = document.createElement('div');
    row.className = 'trust-strip';
    row.innerHTML = `
      <div class="trust-card">
        <div class="trust-title">🔎 जार्गन सरल</div>
        <div class="trust-text">कठिन बैंक शब्द तुरंत आसान भाषा में।</div>
      </div>
      <div class="trust-card">
        <div class="trust-title">⭐ बेहतर विकल्प</div>
        <div class="trust-text">तुलना में शीर्ष विकल्प साफ़ दिखेगा।</div>
      </div>
      <div class="trust-card">
        <div class="trust-title">🧭 अगला कदम</div>
        <div class="trust-text">समझ से बुकिंग तक मार्गदर्शन लगातार।</div>
      </div>
    `;
    chatMessagesEl.appendChild(row);
    scrollToBottom();
  }

  function setLanguage(languageName) {
    if (!languageName || !AIEngine.langNameToCode[languageName]) return;

    language = languageName;
    const code = AIEngine.langNameToCode[languageName];
    localStorage.setItem('fd_lang', code);
    if (langBadge) {
      langBadge.textContent = code.toUpperCase();
    }
    updateInputPlaceholder();
    renderConnectButton();
  }

  function resolveLanguageAlias(value) {
    const alias = String(value || '').trim().toLowerCase();
    const lookup = {
      hi: 'hindi',
      hindi: 'hindi',
      '\u0939\u093f\u0902\u0926\u0940': 'hindi',
      en: 'english',
      english: 'english',
      ta: 'tamil',
      tamil: 'tamil',
      '\u0ba4\u0bae\u0bbf\u0bb4\u0bcd': 'tamil',
      te: 'telugu',
      telugu: 'telugu',
      '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41': 'telugu',
      bn: 'bengali',
      bengali: 'bengali',
      bangla: 'bengali',
      mr: 'marathi',
      marathi: 'marathi',
      pa: 'punjabi',
      punjabi: 'punjabi',
      kn: 'kannada',
      kannada: 'kannada',
      ml: 'malayalam',
      malayalam: 'malayalam',
      gu: 'gujarati',
      gujarati: 'gujarati',
      or: 'odia',
      odia: 'odia',
      oriya: 'odia',
      bho: 'bhojpuri',
      bhojpuri: 'bhojpuri',
      'भोजपुरी': 'bhojpuri',
      gorakhpuri: 'bhojpuri',
    };

    return lookup[alias] || null;
  }

  function parseLanguageSwitchIntent(text) {
    const raw = String(text || '').trim();
    if (!raw) return null;

    const slashMatch = raw.match(/^\/lang\s+([\w\u0900-\u0D7F]+)/i);
    if (slashMatch) {
      return resolveLanguageAlias(slashMatch[1]);
    }

    const lowered = raw.toLowerCase();
    const intents = [
      /(?:change|switch)\s+language\s+to\s+([a-z]+)/i,
      /([a-z]+)\s+mein\s+baat\s+karo/i,
      /speak\s+in\s+([a-z]+)/i,
    ];

    for (const pattern of intents) {
      const match = lowered.match(pattern);
      if (match && match[1]) {
        const resolved = resolveLanguageAlias(match[1]);
        if (resolved) return resolved;
      }
    }

    return null;
  }

  function getLanguageSwitchAck(languageName) {
    const copy = {
      hindi: '\u0920\u0940\u0915 \u0939\u0948, \u0905\u092c \u0938\u0947 \u092e\u0948\u0902 \u0939\u093f\u0902\u0926\u0940 \u092e\u0947\u0902 \u0939\u0940 \u091c\u0935\u093e\u092c \u0926\u0942\u0901\u0917\u0940\u0964',
      english: 'Done. I will continue in English now.',
      tamil: '\u0b9a\u0bb0\u0bbf, \u0b87\u0ba9\u0bbf \u0ba8\u0bbe\u0ba9\u0bcd \u0ba4\u0bae\u0bbf\u0bb4\u0bbf\u0bb2\u0bcd \u0baa\u0ba4\u0bbf\u0bb2\u0bcd \u0b9a\u0bca\u0bb2\u0bcd\u0bb5\u0bc7\u0ba9\u0bcd\u0964',
      telugu: '\u0c38\u0c30\u0c47, \u0c07\u0c15 \u0c28\u0c41\u0c02\u0c1a\u0c3f \u0c28\u0c47\u0c28\u0c41 \u0c24\u0c46\u0c32\u0c41\u0c17\u0c41\u0c32\u0c4b\u0c28\u0c47 \u0c38\u0c2e\u0c3e\u0c27\u0c3e\u0c28\u0c02 \u0c07\u0c38\u0c4d\u0c24\u0c3e\u0c28\u0c41\u0964',
      bengali: '\u09a0\u09bf\u0995 \u0986\u099b\u09c7, \u098f\u0996\u09a8 \u09a5\u09c7\u0995\u09c7 \u0986\u09ae\u09bf \u09ac\u09be\u0982\u09b2\u09be\u09af\u09bc\u0987 \u0989\u09a4\u09cd\u09a4\u09b0 \u09a6\u09c7\u09ac\u0964',
      marathi: '\u0920\u0940\u0915 \u0906\u0939\u0947, \u0906\u0924\u093e\u092a\u093e\u0938\u0942\u0928 \u092e\u0940 \u092e\u0930\u093e\u0920\u0940\u0924\u091a \u0909\u0924\u094d\u0924\u0930 \u0926\u0947\u0908\u0928\u0964',
      punjabi: '\u0a20\u0a40\u0a15 \u0a39\u0a48, \u0a39\u0a41\u0a23 \u0a24\u0a4b\u0a02 \u0a2e\u0a48\u0a02 \u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40 \u0a35\u0a3f\u0a71\u0a1a \u0a39\u0a40 \u0a1c\u0a35\u0a3e\u0a2c \u0a26\u0a47\u0a35\u0a3e\u0a02\u0a17\u0a40\u0964',
      kannada: '\u0cb8\u0cb0\u0cbf, \u0c88\u0c97\u0cbf\u0ca8\u0cbf\u0c82\u0ca6 \u0ca8\u0cbe\u0ca8\u0cc1 \u0c95\u0ca8\u0ccd\u0ca8\u0ca1\u0ca6\u0cb2\u0ccd\u0cb2\u0cbf\u0caf\u0cc7 \u0c89\u0ca4\u0ccd\u0ca4\u0cb0 \u0ca8\u0cc0\u0ca1\u0cc1\u0ca4\u0ccd\u0ca4\u0cc7\u0ca8\u0cc6\u0964',
      malayalam: '\u0d36\u0d30\u0d3f, \u0d07\u0d28\u0d3f \u0d2e\u0d41\u0d24\u0d7d \u0d1e\u0d3e\u0d7b \u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d24\u0d4d\u0d24\u0d3f\u0d7d \u0d24\u0d28\u0d4d\u0d28\u0d46 \u0d2e\u0d31\u0d41\u0d2a\u0d1f\u0d3f \u0d28\u0d7d\u0d15\u0d41\u0d02\u0964',
      gujarati: '\u0ab8\u0abe\u0ab0\u0ac1\u0a82, \u0ab9\u0ab5\u0ac7 \u0aa5\u0ac0 \u0ab9\u0ac1\u0a82 \u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0\u0aae\u0abe\u0a82 \u0a9c \u0a9c\u0ab5\u0abe\u0aac \u0a86\u0aaa\u0ac0\u0ab6\u0964',
      odia: '\u0b20\u0b3f\u0b15\u0b4d \u0b05\u0b1b\u0b3f, \u0b0f\u0b2c\u0b47\u0b20\u0b3e\u0b30\u0b41 \u0b2e\u0b41\u0b01 \u0b13\u0b21\u0b3c\u0b3f\u0b06\u0b30\u0b47 \u0b39\u0b3f\u0b01 \u0b09\u0b24\u0b4d\u0b24\u0b30 \u0b26\u0b47\u0b2c\u0b3f\u0964',
    };

    return copy[languageName] || copy.hindi;
  }

  function resetMessageShell() {
    chatMessagesEl.innerHTML = MESSAGE_ONLY_MODE
      ? ''
      : `
      <div class="date-pill"><span>${getL('today')}</span></div>
      <div class="encryption-notice">
        <span>${getL('encryptionNotice')}</span>
      </div>
    `;
  }

  function persistChatSession() {
    try {
      sessionStorage.setItem(CHAT_SESSION_KEY, JSON.stringify({
        language,
        chatHistory,
        uiMessages,
        lastDiscussedTenorMonths,
        updatedAt: Date.now(),
      }));
    } catch (err) {
      console.warn('Could not persist chat session', err);
    }
  }

  function restoreChatSession() {
    try {
      const raw = sessionStorage.getItem(CHAT_SESSION_KEY);
      if (!raw) return false;

      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.uiMessages) || parsed.uiMessages.length === 0) {
        return false;
      }

      if (typeof parsed.language === 'string') {
        setLanguage(parsed.language);
      }

      if (Number.isFinite(Number(parsed.lastDiscussedTenorMonths))) {
        lastDiscussedTenorMonths = Number(parsed.lastDiscussedTenorMonths);
      }

      resetMessageShell();
      isRestoringChatSession = true;
      uiMessages = [];

      parsed.uiMessages.forEach((msg) => {
        if (!msg || typeof msg.text !== 'string') return;

        if (msg.role === 'user') {
          addUserMessage(msg.text, { persist: false });
        } else if (msg.role === 'assistant') {
          addAssistantMessage(msg.text, { autoSpeak: false, loopAfterSpeak: false, persist: false });
        } else if (msg.role === 'info') {
          addInfoBubble(msg.text, msg.type || 'fact', { persist: false });
        }
      });

      isRestoringChatSession = false;
      chatHistory = Array.isArray(parsed.chatHistory) ? parsed.chatHistory : [];
      uiMessages = parsed.uiMessages;
      scrollToBottom();
      return true;
    } catch (err) {
      console.warn('Could not restore chat session', err);
      isRestoringChatSession = false;
      return false;
    }
  }

  function setupKeyboardSafeArea() {
    if (!window.visualViewport) return;

    const applyOffset = () => {
      const vv = window.visualViewport;
      const keyboardOffset = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      document.documentElement.style.setProperty('--kb-offset', `${keyboardOffset}px`);
      scrollToBottom();
    };

    window.visualViewport.addEventListener('resize', applyOffset);
    window.visualViewport.addEventListener('scroll', applyOffset);
    window.addEventListener('orientationchange', () => setTimeout(applyOffset, 180));
    applyOffset();
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function typeAndSendDemoMessage(message) {
    chatInput.focus({ preventScroll: true });
    chatInput.value = '';
    updateInputButtons();

    for (const char of message) {
      chatInput.value += char;
      updateInputButtons();
      await delay(20);
    }

    await delay(220);
    await handleSend();
  }

  async function runDemoModeSequence() {
    if (!DEMO_MODE || demoModeRunning) return;

    demoModeRunning = true;
    addInfoBubble('🎬 Demo mode active: scripted journey start ho rahi hai.', 'fact');

    const sequence = [
      'FD jargon simple mein samjhao: tenor aur TDS kya hota hai?',
      'Agar ₹50,000 ko 12 months FD mein daalu to kitna milega?',
      '12 months ke liye best bank compare karo.',
      'Mujhe FD booking start karni hai.',
    ];

    for (const message of sequence) {
      await delay(2000);
      await typeAndSendDemoMessage(message);
    }
  }

  // Auth stays non-blocking at startup; explicit connect is user-triggered.

  // ===== Init =====
  async function init() {
    // Set language badge
    if (langBadge) {
      langBadge.textContent = langCode.toUpperCase();
    }
    updateInputPlaceholder();

    // Subscribe immediately; bootstrap runs in background to keep first paint responsive.
    if (typeof PuterInit !== 'undefined') {
      if (typeof PuterInit.onSessionStateChange === 'function') {
        removeSessionListener = PuterInit.onSessionStateChange((nextState) => {
          sessionState = {
            ...sessionState,
            ...nextState,
          };
          applyBaseHeaderStatus();

          if (!nextState.authenticated && lastSessionNotice !== 'degraded') {
            lastSessionNotice = 'degraded';
            addInfoBubble('कनेक्शन सीमित है। मुख्य सलाह जारी रहेगी, कुछ सुविधाएँ स्थानीय मोड में चलेंगी।', 'voice');
          }
          if (nextState.authenticated && lastSessionNotice !== 'connected') {
            lastSessionNotice = 'connected';
            connectHintShown = false;
            addInfoBubble('कनेक्शन सक्रिय है। एआई और सुरक्षित क्लाउड भंडारण उपलब्ध है।', 'voice');
            refreshAISettings({ forceRefresh: true, silent: true });
          }
        });
      }

      Promise.resolve()
        .then(() => PuterInit.bootstrapSession({ interactive: false }))
        .catch((err) => {
          console.warn('[ChatUI] bootstrapSession failed:', err);
        });
    }

    Promise.resolve()
      .then(() => FDData.loadRates())
      .catch((e) => {
        console.warn('FD rates load failed, using local fallback', e);
      });

    // Hide loading quickly; deferred tasks continue in background.
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
    }

    setupKeyboardSafeArea();
    bindAISettingsControls();
    setAISettingsPanelOpen(false);
    syncSpeechStyleState();
    applyVoiceModeUI();
    setupMicInteractions();
    refreshAISettings({ forceRefresh: false, silent: true });

    const restoredSession = restoreChatSession();

    if (!restoredSession) {
      if (!MESSAGE_ONLY_MODE) {
        // Show greeting from Meera - force fresh read of persisted values
        const freshLangCode = localStorage.getItem('fd_lang') || 'hi';
        const freshLanguage = AIEngine.langCodeToName[freshLangCode] || 'hindi';
        const freshPersona = localStorage.getItem('fd_persona') || 'kisan';
        console.log('[ChatUI Greeting] Using fresh values - lang:', freshLanguage, 'persona:', freshPersona);
        const greeting = await AIEngine.getGreeting(freshLanguage, freshPersona);
        addAssistantMessage(greeting, {
          autoSpeak: voiceModeEnabled,
          loopAfterSpeak: false,
        });
        renderTrustStrip();

        // Add greeting to chat history
        chatHistory.push({ role: 'assistant', content: greeting });
        persistChatSession();

        // Show initial quick replies
        const initialReplies = AIEngine.getInitialQuickReplies(language);
        showQuickReplies(initialReplies);
      }
    } else {
      firstAIInteractionDone = chatHistory.length > 0;
    }

    if (voiceModeEnabled) {
      showVoicePrompt(getL('speak'));
    }

    applyBaseHeaderStatus();

    setTimeout(() => {
      chatInput.focus({ preventScroll: true });
      scrollToBottom();
    }, 120);

    if (DEMO_MODE && !restoredSession) {
      runDemoModeSequence();
    }

    window.addEventListener('fd-install-available', () => {
      if (firstAIInteractionDone && !installBannerShown) {
        showInstallBanner();
      }
    });

    if (typeof PWAHelper !== 'undefined' && PWAHelper && PWAHelper.canInstall && PWAHelper.canInstall() && firstAIInteractionDone && !installBannerShown) {
      showInstallBanner();
    }

    window.addEventListener('beforeunload', persistChatSession);
    window.addEventListener('beforeunload', () => {
      if (typeof removeSessionListener === 'function') {
        removeSessionListener();
      }
    });
  }

  // ===== Message Rendering =====

  function getTimeString() {
    return new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
  }

  function addUserMessage(text, options = {}) {
    const { persist = true } = options;

    const row = document.createElement('div');
    row.className = 'message-row user';
    row.innerHTML = `
      <div>
        <div class="msg-bubble">${escapeHtml(text)}</div>
        <div class="msg-time">${getTimeString()}</div>
      </div>
    `;
    chatMessagesEl.appendChild(row);
    scrollToBottom();

    if (persist && !isRestoringChatSession) {
      uiMessages.push({ role: 'user', text });
      persistChatSession();
    }
  }

  function addAssistantMessage(text, options = {}) {
    const {
      autoSpeak = voiceModeEnabled,
      loopAfterSpeak = false,
      persist = true,
    } = options;

    const row = document.createElement('div');
    row.className = 'message-row assistant';
    row.innerHTML = `
      <div class="msg-avatar">👩‍💼</div>
      <div>
        <div class="msg-bubble">${escapeHtml(text)}</div>
        <div class="msg-meta">
          <div class="msg-time">${getTimeString()}</div>
          <button class="bubble-speaker-btn" title="Speak">🔈</button>
        </div>
      </div>
    `;

    const speakerBtn = row.querySelector('.bubble-speaker-btn');
    enableBubbleSpeech(speakerBtn, text, {
      autoPlay: autoSpeak,
      loopAfterSpeak,
    });

    chatMessagesEl.appendChild(row);
    scrollToBottom();

    if (persist && !isRestoringChatSession) {
      uiMessages.push({ role: 'assistant', text });
      persistChatSession();
    }

    return { row, speakerBtn };
  }

  /**
   * Create a streaming assistant bubble that will be updated chunk-by-chunk.
   * Returns an object with update(text) and finalize() methods.
   */
  function createStreamingBubble() {
    const row = document.createElement('div');
    row.className = 'message-row assistant';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = '👩‍💼';

    const wrapper = document.createElement('div');
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = '<span class="streaming-cursor">▊</span>';

    const meta = document.createElement('div');
    meta.className = 'msg-meta';

    const timeEl = document.createElement('div');
    timeEl.className = 'msg-time';
    timeEl.textContent = getTimeString();

    const speakerBtn = document.createElement('button');
    speakerBtn.className = 'bubble-speaker-btn';
    speakerBtn.title = 'Speak';
    speakerBtn.textContent = '🔈';
    speakerBtn.style.display = 'none';

    wrapper.appendChild(bubble);
    meta.appendChild(timeEl);
    meta.appendChild(speakerBtn);
    wrapper.appendChild(meta);
    row.appendChild(avatar);
    row.appendChild(wrapper);
    chatMessagesEl.appendChild(row);
    scrollToBottom();

    let accumulated = '';

    return {
      update(chunk) {
        accumulated += chunk;
        bubble.innerHTML = escapeHtml(accumulated) + '<span class="streaming-cursor">▊</span>';
        scrollToBottom();
      },
      finalize(cleanText) {
        bubble.innerHTML = escapeHtml(cleanText || accumulated);
        // Remove cursor
        const cursor = bubble.querySelector('.streaming-cursor');
        if (cursor) cursor.remove();
        speakerBtn.style.display = 'inline-flex';
        scrollToBottom();
      },
      getText() {
        return accumulated;
      },
      speakerBtn,
      bubbleEl: bubble,
      row,
    };
  }

  // Typing indicator
  function showTyping(label) {
    const displayLabel = label || getL('thinkingText');
    isTyping = true;
    headerStatus.textContent = displayLabel;
    headerStatus.style.fontStyle = 'italic';

    const row = document.createElement('div');
    row.className = 'typing-row';
    row.id = 'typingIndicator';
    row.innerHTML = `
      <div class="msg-avatar">👩‍💼</div>
      <div class="typing-bubble">
        <div class="typing-label">${escapeHtml(label)}</div>
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    chatMessagesEl.appendChild(row);
    scrollToBottom();
  }

  function hideTyping() {
    isTyping = false;
    applyBaseHeaderStatus();
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  function showQuickReplies(replies) {
    if (MESSAGE_ONLY_MODE) return;
    if (!replies || replies.length === 0) return;

    // Remove any existing quick replies
    removeQuickReplies();

    const container = document.createElement('div');
    container.className = 'quick-replies';
    container.id = 'quickRepliesContainer';

    replies.forEach(text => {
      const chip = document.createElement('button');
      chip.className = 'quick-chip';
      chip.textContent = text;
      chip.onclick = () => {
        removeQuickReplies();
        handleSend(text);
      };
      container.appendChild(chip);
    });

    chatMessagesEl.appendChild(container);
    scrollToBottom();
  }

  function removeQuickReplies() {
    const existing = document.getElementById('quickRepliesContainer');
    if (existing) existing.remove();
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    });
  }

  function isFDCalculationResponse(text) {
    if (!text) return false;

    const hasFDWords = /(fd|interest|rate|maturity|tenor|duration|principal|return|faayda|fayda|profit)/i.test(text);
    const hasNumbers = /₹\s*[\d,]+|\d+\.?\d*\s*%|\d+\s*(month|months|mahine|saal|year)/i.test(text);

    return hasFDWords && hasNumbers;
  }

  function parseCurrencyValue(raw) {
    if (!raw) return null;
    const clean = raw.toString().replace(/[,₹\s]/g, '');
    const value = Number(clean);
    return Number.isFinite(value) ? value : null;
  }

  function extractTenorMonths(text) {
    if (!text) return null;

    const monthMatch = text.match(/(\d+(?:\.\d+)?)\s*(months?|month|mahine|mahina)/i);
    if (monthMatch) {
      const months = Math.round(Number(monthMatch[1]));
      return months > 0 ? months : null;
    }

    const yearMatch = text.match(/(\d+(?:\.\d+)?)\s*(years?|year|saal|sal)/i);
    if (yearMatch) {
      const months = Math.round(Number(yearMatch[1]) * 12);
      return months > 0 ? months : null;
    }

    return null;
  }

  function extractCurrencyAmounts(text) {
    if (!text) return [];

    const amounts = [];
    const rsMatches = text.matchAll(/(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)/gi);
    for (const match of rsMatches) {
      const value = parseCurrencyValue(match[1]);
      if (value) amounts.push(value);
    }

    const unitMatches = text.matchAll(/(\d+(?:\.\d+)?)\s*(lakh|lac|lakhs|crore|crores)/gi);
    for (const match of unitMatches) {
      const num = Number(match[1]);
      if (!Number.isFinite(num)) continue;
      const unit = match[2].toLowerCase();
      const multiplier = unit.startsWith('crore') ? 10000000 : 100000;
      amounts.push(Math.round(num * multiplier));
    }

    return amounts;
  }

  function extractInterestAmount(text) {
    if (!text) return null;

    const direct = text.match(/(?:interest|faayda|fayda|profit|byaj|ब्याज|लाभ)[^\n₹\d]*(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)/i);
    if (direct) {
      return parseCurrencyValue(direct[1]);
    }

    const amounts = extractCurrencyAmounts(text);
    if (amounts.length >= 2) {
      const min = Math.min(...amounts);
      const max = Math.max(...amounts);
      const diff = Math.round(max - min);
      if (diff > 100) return diff;
    }

    if (amounts.length > 0) {
      return Math.round(amounts[0]);
    }

    return null;
  }

  function saveSharePlanFromResponse(fullText, combinedText) {
    const tenor = extractTenorMonths(combinedText) || lastDiscussedTenorMonths || 12;
    const amounts = extractCurrencyAmounts(fullText);
    if (!amounts.length) return;

    const minAmount = Math.min(...amounts);
    const maxAmount = Math.max(...amounts);
    let amount = Number(localStorage.getItem('fd_calc_amount') || minAmount || 0);
    let maturityAmount = maxAmount || 0;

    if (!amount || amount >= maturityAmount) {
      amount = minAmount;
    }

    const impliedRate = amount > 0 && tenor > 0
      ? ((maturityAmount - amount) / amount) * (12 / tenor) * 100
      : 0;

    const safeRate = Math.max(0, Math.min(25, Number.isFinite(impliedRate) ? impliedRate : 0));

    localStorage.setItem(LAST_CALC_KEY, JSON.stringify({
      amount,
      maturityAmount,
      tenor,
      rate: safeRate,
    }));
  }

  function getPersonaAnalogy(personaId, text) {
    if (typeof PersonaEngine === 'undefined' || typeof PersonaEngine.getPersona !== 'function') {
      return null;
    }

    const profile = PersonaEngine.getPersona(personaId);
    const analogies = profile?.sample_analogies || {};
    const lower = (text || '').toLowerCase();

    if (/(maturity|mature|unlock|returns? back|मैच्योरिटी)/i.test(lower)) {
      return analogies.maturity || null;
    }
    if (/(month|months|mahine|mahina|saal|year|tenor|duration|lock)/i.test(lower)) {
      return analogies.tenor || null;
    }
    return analogies.rate || null;
  }

  function getDidYouKnowPrefix(languageName) {
    const prefixes = {
      hindi: 'Kya aap jaante the? 🤔',
      bengali: 'Janen ki? 🤔',
      tamil: 'Theriyuma? 🤔',
      telugu: 'Telusa? 🤔',
      marathi: 'Mahit aahe ka? 🤔',
      english: 'Did you know? 🤔',
      punjabi: 'Pata hai? 🤔',
      kannada: 'Gotta? 🤔',
      malayalam: 'Ariyaamo? 🤔',
      gujarati: 'Khabar chhe? 🤔',
      odia: 'Janichha ki? 🤔',
    };

    return prefixes[languageName] || prefixes.hindi;
  }

  function getListeningText() {
    return getL('listening');
  }

  function getVoiceTryAgainText() {
    return getL('tryAgain');
  }

  function getVoiceReadyTimeoutText() {
    return getL('readyPrompt');
  }

  function showVoicePrompt(text) {
    if (!voiceReadyPrompt) return;
    voiceReadyPrompt.textContent = text;
    voiceReadyPrompt.classList.add('show');
  }

  function hideVoicePrompt() {
    if (!voiceReadyPrompt) return;
    voiceReadyPrompt.classList.remove('show');
  }

  function setMicVisualState(state) {
    micBtn.classList.remove('recording', 'transcribing', 'ready');

    if (state === 'recording') {
      micBtn.classList.add('recording');
      micBtn.innerHTML = '<span class="mic-wave"><span></span><span></span><span></span></span>';
      headerStatus.textContent = getL('recording');
      headerStatus.style.fontStyle = 'normal';
      return;
    }

    if (state === 'transcribing') {
      micBtn.classList.add('transcribing');
      micBtn.innerHTML = '<span class="mic-spinner"></span>';
      showVoicePrompt(getListeningText());
      headerStatus.textContent = getListeningText();
      headerStatus.style.fontStyle = 'italic';
      return;
    }

    if ((voiceModeEnabled || continuousVoiceMode) && !isTyping) {
      micBtn.classList.add('ready');
      showVoicePrompt(getL('speak'));
      headerStatus.textContent = getL('voiceModeOn');
      headerStatus.style.fontStyle = 'normal';
      micBtn.textContent = '🎤';
      return;
    }

    micBtn.textContent = '🎤';
    if (!isTyping) {
      applyBaseHeaderStatus();
    }
  }

  function showInstallBanner() {
    if (!installBanner || installBannerShown) return;
    if (!PWAHelper || !PWAHelper.canInstall || !PWAHelper.canInstall()) return;

    installBanner.hidden = false;
    installBanner.classList.add('show');
  }

  function dismissInstallBanner() {
    if (!installBanner) return;

    installBanner.classList.remove('show');
    installBanner.hidden = true;
    installBannerShown = true;
    localStorage.setItem('fd_install_prompt_seen', 'yes');
  }

  async function triggerInstallPrompt() {
    if (!PWAHelper || typeof PWAHelper.promptInstall !== 'function') return;

    const accepted = await PWAHelper.promptInstall();

    if (installBannerBtn) {
      installBannerBtn.textContent = accepted ? 'Installed' : 'Try Again';
    }

    if (accepted) {
      dismissInstallBanner();
    }
  }

  function buildSharePayload(plan) {
    if (!plan) return null;

    const amount = FDData.formatINR(plan.amount || 0);
    const maturity = FDData.formatINR(plan.maturityAmount || 0);
    const tenor = Number(plan.tenor || 0);
    const rate = Number(plan.rate || 0).toFixed(2);
    const appUrl = window.location.origin + '/index.html';

    const text = [
      '🏦 Maine Bharat Ka Apna FD Advisor se FD plan kiya!',
      `${amount} → ${maturity} in ${tenor} months @${rate}%`,
      `Aap bhi try karo: ${appUrl}`,
    ].join('\n');

    return {
      title: 'Bharat Ka Apna FD Advisor',
      text,
      url: appUrl,
    };
  }

  function getLastSharedPlan() {
    try {
      const raw = localStorage.getItem(LAST_CALC_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  async function shareCurrentFDPlan() {
    const plan = getLastSharedPlan();
    if (!plan) {
      addInfoBubble('Pehle FD calculation kar lijiye, phir share karein.', 'fact');
      return;
    }

    const payload = buildSharePayload(plan);
    if (!payload) return;

    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') {
        return;
      }
    }

    const fallback = 'https://wa.me/?text=' + encodeURIComponent(payload.text);
    window.open(fallback, '_blank');
  }

  function applyVoiceModeUI() {
    const isOn = voiceModeEnabled || continuousVoiceMode;

    voiceModeBtn.classList.toggle('active', isOn);
    voiceModeBadge.classList.toggle('show', isOn);

    if (!isOn) {
      hideVoicePrompt();
    }

    setMicVisualState('idle');
    updateInputButtons();
  }

  function toggleVoiceMode(forceState = null) {
    const next = (typeof forceState === 'boolean') ? forceState : !voiceModeEnabled;
    voiceModeEnabled = next;
    localStorage.setItem('fd_voice_mode', voiceModeEnabled ? 'on' : 'off');

    if (!voiceModeEnabled) {
      clearTimeout(voiceLoopTimer);
      voiceLoopTimer = null;
      VoiceEngine.stopSpeaking();
    } else {
      showVoicePrompt(getL('voiceModeOn'));
      setTimeout(() => {
        if (voiceModeEnabled || continuousVoiceMode) showVoicePrompt(getL('speak'));
      }, 900);
    }

    applyVoiceModeUI();
  }

  function setupMicInteractions() {
    const clearPress = () => {
      if (micPressTimer) {
        clearTimeout(micPressTimer);
        micPressTimer = null;
      }
    };

    micBtn.addEventListener('pointerdown', () => {
      micLongPressTriggered = false;

      micPressTimer = setTimeout(() => {
        micLongPressTriggered = true;
        startContinuousVoiceMode();
      }, 550);
    });

    micBtn.addEventListener('pointerup', clearPress);
    micBtn.addEventListener('pointerleave', clearPress);
    micBtn.addEventListener('pointercancel', clearPress);

    micBtn.addEventListener('click', (e) => {
      if (micLongPressTriggered) {
        e.preventDefault();
        micLongPressTriggered = false;
        return;
      }
      toggleMic();
    });
  }

  function scheduleVoiceLoopMic(delayMs = 350) {
    if (!(voiceModeEnabled || continuousVoiceMode)) return;
    if (isTyping || isVoiceCaptureInProgress) return;

    clearTimeout(voiceLoopTimer);
    showVoicePrompt(getL('speak'));

    voiceLoopTimer = setTimeout(() => {
      startVoiceCapture({ fromLoop: true });
    }, delayMs);
  }

  function enableBubbleSpeech(button, text, options = {}) {
    if (!button || !text) return;

    const {
      autoPlay = false,
      loopAfterSpeak = false,
    } = options;

    button.style.display = 'inline-flex';
    button.textContent = '🔈';

    let playLock = false;

    async function play() {
      if (playLock) return;
      playLock = true;

      await VoiceEngine.speakResponse(text, language, {
        autoPlay: true,
        onPathResolved: (path) => {
          announceSpeechPath(path);
        },
        onStart: () => {
          button.classList.add('playing');
          button.textContent = '🔊';
        },
        onEnd: () => {
          button.classList.remove('playing');
          button.textContent = '🔈';
          playLock = false;

          if (loopAfterSpeak && (voiceModeEnabled || continuousVoiceMode)) {
            scheduleVoiceLoopMic(450);
          }
        },
        onError: () => {
          button.classList.remove('playing');
          button.textContent = '🔈';
          playLock = false;
        },
      });
    }

    button.onclick = play;

    if (autoPlay) {
      play();
    }
  }

  async function startVoiceCapture({ fromLoop = false } = {}) {
    if (isVoiceCaptureInProgress || isTyping) return;

    if (!VoiceEngine.isSupported()) {
      addAssistantMessage(getVoiceTryAgainText(), { autoSpeak: false, loopAfterSpeak: false });
      return;
    }

    isVoiceCaptureInProgress = true;
    if (!fromLoop) showVoicePrompt(getL('speak'));

    const transcript = await VoiceEngine.startVoiceInput({
      language,
      inputElement: chatInput,
      sendFn: async (spokenText) => {
        hideVoicePrompt();
        await handleSend(spokenText);
      },
      noSpeechTimeoutMs: 3000,
      onStateChange: (phase) => {
        if (phase === 'recording') {
          setMicVisualState('recording');
        } else if (phase === 'transcribing') {
          setMicVisualState('transcribing');
        } else {
          setMicVisualState('idle');
        }
      },
      onTranscript: (spokenText) => {
        chatInput.value = spokenText;
        updateInputButtons();
      },
      onNoSpeechTimeout: () => {
        addAssistantMessage(getVoiceReadyTimeoutText(), { autoSpeak: false, loopAfterSpeak: false });
      },
      onError: (friendlyMessage) => {
        addAssistantMessage(friendlyMessage || getVoiceTryAgainText(), {
          autoSpeak: false,
          loopAfterSpeak: false,
        });
      },
    });

    isVoiceCaptureInProgress = false;
    setMicVisualState('idle');

    if (continuousVoiceMode && !transcript) {
      scheduleVoiceLoopMic(1200);
    }
  }

  function startContinuousVoiceMode() {
    if (continuousVoiceMode) return;

    voiceModeBeforeContinuous = voiceModeEnabled;
    continuousVoiceMode = true;

    if (!voiceModeEnabled) {
      toggleVoiceMode(true);
    } else {
      applyVoiceModeUI();
    }

    const cvmMsg = language === 'english'
      ? '🎧 Continuous voice mode ON. Tap mic to stop.'
      : '🎧 ' + getL('voiceModeOn') + '। माइक दबाकर रोकें।';
    addInfoBubble(cvmMsg, 'voice');
    startVoiceCapture({ fromLoop: false });
  }

  function stopContinuousVoiceMode() {
    continuousVoiceMode = false;
    clearTimeout(voiceLoopTimer);
    voiceLoopTimer = null;

    if (!voiceModeBeforeContinuous) {
      toggleVoiceMode(false);
    } else {
      applyVoiceModeUI();
    }

    voiceModeBeforeContinuous = false;
    hideVoicePrompt();
    const pauseMsg = language === 'english' ? 'Voice mode paused.' : 'वॉइस मोड रुका।';
    addInfoBubble(pauseMsg, 'voice');
  }

  function detectBookingIntent(text) {
    if (!text) return false;

    return /(book\s*karna\s*hai|fd\s*karna\s*chahta|fd\s*karna\s*chahti|kaise\s*karu|kaise\s*kare|fd\s*book|start\s*booking|booking\s*start|बुक|बुकिंग|शुरू)/i.test(text);
  }

  function getBookingStartMessage() {
    return getL('bookingStart');
  }

  function formatTenorLabel(months) {
    const m = Number(months);
    if (!Number.isFinite(m) || m <= 0) return '-';
    return `${m}M`;
  }

  function renderMyBookings(bookings) {
    if (!Array.isArray(bookings) || bookings.length === 0) {
      myBookingsList.innerHTML = '<div class="my-bookings-empty">Abhi tak koi FD booking save nahi hui.</div>';
      return;
    }

    myBookingsList.innerHTML = bookings.map((booking) => {
      const bank = booking?.bank?.name || booking?.bankName || '-';
      const amount = booking?.fd?.amount ?? booking?.amount;
      const tenor = booking?.fd?.tenorMonths ?? booking?.tenorMonths;
      const maturityDate = booking?.fd?.maturityDate || booking?.maturityDate || '-';
      const status = booking?.status || 'Confirmed';

      return `
        <div class="my-bookings-item">
          <div class="my-bookings-top">
            <div class="my-bookings-bank">${escapeHtml(bank)}</div>
            <div class="my-bookings-status">${escapeHtml(status)}</div>
          </div>
          <div class="my-bookings-meta">Amount: ${amount ? FDData.formatINR(amount) : '-'} | Tenor: ${formatTenorLabel(tenor)}</div>
          <div class="my-bookings-meta">Maturity: ${escapeHtml(maturityDate)}</div>
        </div>
      `;
    }).join('');
  }

  async function loadMyBookings() {
    if (typeof getMyBookings !== 'function') {
      myBookingsList.innerHTML = '<div class="my-bookings-empty">Booking module unavailable.</div>';
      return;
    }

    myBookingsList.innerHTML = '<div class="my-bookings-empty">Loading your bookings...</div>';

    try {
      const bookings = await getMyBookings();
      renderMyBookings(bookings);
    } catch (err) {
      console.warn('Could not load bookings:', err);
      myBookingsList.innerHTML = '<div class="my-bookings-empty">Bookings load nahi ho payi. Please try again.</div>';
    }
  }

  function openMyBookingsSheet() {
    myBookingsBackdrop.classList.add('open');
    myBookingsSheet.classList.add('open');
    myBookingsSheet.setAttribute('aria-hidden', 'false');
    loadMyBookings();

    if (myBookingsInterval) clearInterval(myBookingsInterval);
    myBookingsInterval = setInterval(loadMyBookings, 12000);
  }

  function closeMyBookingsSheet() {
    myBookingsBackdrop.classList.remove('open');
    myBookingsSheet.classList.remove('open');
    myBookingsSheet.setAttribute('aria-hidden', 'true');

    if (myBookingsInterval) {
      clearInterval(myBookingsInterval);
      myBookingsInterval = null;
    }
  }

  function persistTenorContext(tenorMonths) {
    const t = Number(tenorMonths);
    if (!Number.isFinite(t) || t <= 0) return;

    lastDiscussedTenorMonths = Math.round(t);
    localStorage.setItem('fd_last_tenor', String(lastDiscussedTenorMonths));
    localStorage.setItem('fd_compare_tenor', String(lastDiscussedTenorMonths));
  }

  function openCompareWithContext() {
    if (Number.isFinite(lastDiscussedTenorMonths) && lastDiscussedTenorMonths > 0) {
      localStorage.setItem('fd_compare_tenor', String(lastDiscussedTenorMonths));
    }
    window.location.href = 'compare.html';
  }

  function detectCalculatorIntent(text) {
    if (!text) return false;

    const lower = text.toLowerCase();
    const directKeywords = /(kitna\s*milega|calculate|calculation|return|returns|interest|byaj|fayda|faayda)/i.test(lower);
    const moneyIntent = /(paisa|amount|invest|investment|deposit|fd|laga|daal)/i.test(lower) && /(\d+|₹|rs\.?|inr|lakh|crore)/i.test(lower);

    return directKeywords || moneyIntent;
  }

  function nearestCalcTenor(tenorCandidate) {
    const options = [6, 12, 24, 36];
    const n = Number(tenorCandidate);
    if (!Number.isFinite(n) || n <= 0) return 12;

    return options.reduce((best, curr) => {
      return Math.abs(curr - n) < Math.abs(best - n) ? curr : best;
    }, options[0]);
  }

  function extractPrincipalFromText(text) {
    const amounts = extractCurrencyAmounts(text || '');
    const principal = amounts.find(v => v >= 1000 && v <= 100000000);
    return principal || null;
  }

  function addInlineCalculatorCard(initialAmount = 50000, initialTenor = 12) {
    const tenorOptions = [6, 12, 24, 36];
    let currentTenor = nearestCalcTenor(initialTenor);
    let currentIndex = tenorOptions.indexOf(currentTenor);
    const safeAmount = Math.max(1000, Math.round(Number(initialAmount) || 50000));
    const cardId = `inlineCalc${Date.now()}`;

    const row = document.createElement('div');
    row.className = 'message-row assistant';
    row.innerHTML = `
      <div class="msg-avatar" style="background: linear-gradient(135deg, #1f2937, #128C7E);">🧮</div>
      <div class="msg-bubble inline-calc-bubble">
        <div class="inline-calc-card" id="${cardId}">
          <div class="inline-calc-title">Quick FD Calculator</div>

          <div class="inline-calc-field">
            <label for="${cardId}-amount">Principal Amount (₹)</label>
            <input id="${cardId}-amount" type="number" min="1000" step="1000" value="${safeAmount}">
          </div>

          <div class="inline-calc-field">
            <div class="inline-calc-tenor-head">
              <label for="${cardId}-tenor">Tenor</label>
              <strong id="${cardId}-tenor-value">${currentTenor}M</strong>
            </div>
            <input id="${cardId}-tenor" type="range" min="0" max="3" step="1" value="${currentIndex}">
            <div class="inline-calc-tenor-labels" id="${cardId}-tenor-labels">
              ${tenorOptions.map(t => `<button type="button" data-tenor="${t}">${t}M</button>`).join('')}
            </div>
          </div>

          <div class="inline-calc-field">
            <label for="${cardId}-bank">Bank</label>
            <select id="${cardId}-bank"></select>
          </div>

          <div class="inline-calc-result" id="${cardId}-result"></div>
          <div class="inline-calc-note" id="${cardId}-festival" style="display:none;"></div>
          <div class="inline-calc-note persona" id="${cardId}-persona" style="display:none;"></div>
          <div class="inline-calc-note fact" id="${cardId}-local" style="display:none;"></div>

          <button type="button" class="inline-calc-book-btn" id="${cardId}-book">FD Book Karo</button>
        </div>
      </div>
    `;

    chatMessagesEl.appendChild(row);
    scrollToBottom();

    const amountInput = row.querySelector(`#${cardId}-amount`);
    const tenorInput = row.querySelector(`#${cardId}-tenor`);
    const tenorValueEl = row.querySelector(`#${cardId}-tenor-value`);
    const tenorLabelsEl = row.querySelector(`#${cardId}-tenor-labels`);
    const bankSelect = row.querySelector(`#${cardId}-bank`);
    const resultEl = row.querySelector(`#${cardId}-result`);
    const festivalEl = row.querySelector(`#${cardId}-festival`);
    const personaEl = row.querySelector(`#${cardId}-persona`);
    const localEl = row.querySelector(`#${cardId}-local`);
    const bookBtn = row.querySelector(`#${cardId}-book`);

    function updateTenorLabels() {
      tenorValueEl.textContent = `${currentTenor}M`;
      tenorLabelsEl.querySelectorAll('button[data-tenor]').forEach(btn => {
        btn.classList.toggle('active', Number(btn.dataset.tenor) === currentTenor);
      });
    }

    function populateBanks(preferredId) {
      const principal = Math.max(1000, Number(amountInput.value) || safeAmount);
      const comparison = FDData.getComparison(currentTenor, principal, false);
      const allBanks = comparison.all || [];

      if (!allBanks.length) {
        bankSelect.innerHTML = '';
        resultEl.textContent = 'Is tenor par bank rates abhi available nahi hain.';
        return;
      }

      const chosenId = preferredId && allBanks.some(b => b.id === preferredId)
        ? preferredId
        : allBanks[0].id;

      bankSelect.innerHTML = allBanks.map(bank => `
        <option value="${bank.id}" data-rate="${bank.rate}" data-bank="${bank.name}" ${bank.id === chosenId ? 'selected' : ''}>
          ${bank.name} — ${bank.rate.toFixed(2)}%
        </option>
      `).join('');
    }

    function renderCard() {
      const principal = Math.max(1000, Math.round(Number(amountInput.value) || safeAmount));
      amountInput.value = principal;

      if (!bankSelect.value) {
        populateBanks();
      }

      const selectedOption = bankSelect.options[bankSelect.selectedIndex];
      if (!selectedOption) return;

      const rate = Number(selectedOption.dataset.rate || 0);
      const calc = FDData.calculateFD(principal, rate, currentTenor, false);

      localStorage.setItem(LAST_CALC_KEY, JSON.stringify({
        amount: principal,
        maturityAmount: calc.maturityAmount,
        tenor: currentTenor,
        rate,
      }));

      resultEl.textContent = `${FDData.formatINR(calc.maturityAmount)} milega — matlab ${FDData.formatINR(calc.interest)} ka fayda!`;

      const festivalAlert = CulturalEngine.getFestivalAlert(currentTenor, language);
      if (festivalAlert) {
        festivalEl.style.display = 'block';
        festivalEl.textContent = festivalAlert;
      } else {
        festivalEl.style.display = 'none';
        festivalEl.textContent = '';
      }

      const personaProfile = (typeof PersonaEngine !== 'undefined' && PersonaEngine.getPersona)
        ? PersonaEngine.getPersona(persona)
        : null;

      if (personaProfile?.sample_analogies) {
        const personaText = personaProfile.sample_analogies.maturity || personaProfile.sample_analogies.rate;
        personaEl.style.display = 'block';
        personaEl.textContent = `${personaProfile.emoji} ${personaText}`;
      } else {
        personaEl.style.display = 'none';
      }

      const localKey = `${principal}-${currentTenor}-${rate}`;
      row.dataset.localKey = localKey;

      if (typeof CulturalEngine.getLocalAnalogy === 'function') {
        localEl.style.display = 'block';
        localEl.textContent = AI_THINKING_TEXT;

        CulturalEngine.getLocalAnalogy(calc.interest, language, persona).then((txt) => {
          if (row.dataset.localKey !== localKey) return;

          if (txt) {
            localEl.style.display = 'block';
            localEl.textContent = `${getDidYouKnowPrefix(language)} ${txt}`;
          } else {
            localEl.style.display = 'none';
            localEl.textContent = '';
          }
        }).catch(() => {
          localEl.style.display = 'none';
          localEl.textContent = '';
        });
      }

      persistTenorContext(currentTenor);
      localStorage.setItem('fd_calc_amount', String(principal));
    }

    tenorLabelsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-tenor]');
      if (!btn) return;

      currentTenor = Number(btn.dataset.tenor);
      currentIndex = tenorOptions.indexOf(currentTenor);
      tenorInput.value = String(currentIndex);
      updateTenorLabels();
      populateBanks(bankSelect.value);
      renderCard();
    });

    tenorInput.addEventListener('input', () => {
      currentIndex = Number(tenorInput.value);
      currentTenor = tenorOptions[currentIndex] || 12;
      updateTenorLabels();
      populateBanks(bankSelect.value);
      renderCard();
    });

    amountInput.addEventListener('input', () => {
      populateBanks(bankSelect.value);
      renderCard();
    });

    bankSelect.addEventListener('change', renderCard);

    bookBtn.addEventListener('click', () => {
      persistTenorContext(currentTenor);
      localStorage.setItem('fd_calc_amount', String(Math.max(1000, Number(amountInput.value) || safeAmount)));
      localStorage.setItem('fd_calc_bank', bankSelect.value || '');
      window.location.href = 'booking.html';
    });

    updateTenorLabels();
    populateBanks();
    renderCard();
  }

  // ===== Send Logic =====

  async function handleSend(text) {
    const message = text || chatInput.value.trim();
    if (!message || isTyping) return;

    clearTimeout(voiceLoopTimer);
    voiceLoopTimer = null;
    hideVoicePrompt();

    const shouldShowCalculatorCard = detectCalculatorIntent(message);
    const shouldStartBooking = detectBookingIntent(message);
    const userTenorMention = extractTenorMonths(message);
    if (userTenorMention) {
      persistTenorContext(userTenorMention);
    }

    chatInput.value = '';
    updateInputButtons();
    removeQuickReplies();

    // Keep input clean; connection is handled via header button and first-send attempt.

    // Show user message
    addUserMessage(message);

    // Add to history
    chatHistory.push({ role: 'user', content: message });
    persistChatSession();

    const requestedLanguage = parseLanguageSwitchIntent(message);
    if (requestedLanguage) {
      const alreadyActive = requestedLanguage === language;
      if (!alreadyActive) {
        setLanguage(requestedLanguage);
      }

      const switchAck = alreadyActive
        ? getLanguageSwitchAck(language)
        : getLanguageSwitchAck(requestedLanguage);

      addAssistantMessage(switchAck, {
        autoSpeak: voiceModeEnabled || continuousVoiceMode,
        loopAfterSpeak: false,
      });
      chatHistory.push({ role: 'assistant', content: switchAck });
      persistChatSession();
      return;
    }

    if (shouldStartBooking) {
      const startMsg = getBookingStartMessage();
      addAssistantMessage(startMsg, {
        autoSpeak: voiceModeEnabled || continuousVoiceMode,
        loopAfterSpeak: false,
      });
      chatHistory.push({ role: 'assistant', content: startMsg });
      persistChatSession();

      const code = AIEngine.langNameToCode[language] || langCode;
      localStorage.setItem('fd_lang', code);
      localStorage.setItem('fd_persona', persona);
      localStorage.setItem('fd_booking_lang', code);
      localStorage.setItem('fd_booking_persona', persona);

      setTimeout(() => {
        window.location.href = 'booking.html';
      }, 850);
      return;
    }

    if (!sessionState.authenticated && !autoConnectAttempted) {
      autoConnectAttempted = true;
      await connectCloudAI({
        source: 'first-send',
        showSuccessBubble: false,
        showFailureBubble: false,
      });
    }

    // Show typing indicator briefly, then replace with streaming bubble
    showTyping(getL('thinkingText'));

    // Small delay to show typing dots before streaming starts
    await new Promise(r => setTimeout(r, 500));
    hideTyping();

    // Create streaming bubble
    const streamBubble = createStreamingBubble();

    // Call AI with streaming
    const { fullText, quickReplies, meta = {} } = await AIEngine.sendMessage(
      message,
      chatHistory.slice(0, -1), // Don't include the user message we just added (sendMessage adds it internally)
      language,
      persona,
      (chunk) => {
        streamBubble.update(chunk);
      }
    );

    // Finalize the bubble with cleaned text (without QUICK_REPLIES tag)
    streamBubble.finalize(fullText);
    if (!isRestoringChatSession) {
      uiMessages.push({ role: 'assistant', text: fullText });
      persistChatSession();
    }

    enableBubbleSpeech(streamBubble.speakerBtn, fullText, {
      autoPlay: voiceModeEnabled || continuousVoiceMode,
      loopAfterSpeak: voiceModeEnabled || continuousVoiceMode,
    });

    // Add assistant response to history
    chatHistory.push({ role: 'assistant', content: fullText });
    persistChatSession();

    if (!MESSAGE_ONLY_MODE) {
      if (meta.source === 'offline-fallback') {
        addInfoBubble('कनेक्शन अस्थायी रूप से सीमित है, इसलिए स्थानीय उत्तर दिखाया गया है।', 'voice');
        if (!connectHintShown) {
          connectHintShown = true;
          addInfoBubble(getCloudConnectHintText(), 'fact');
        }
      } else if (meta.model && !modelMetaShown) {
        modelMetaShown = true;
        const providerText = meta.provider ? ` (${meta.provider})` : '';
        const modelTag = language === 'english'
          ? `AI model: ${meta.model}${providerText}`
          : `एआई मॉडल: ${meta.model}${providerText}`;
        addInfoBubble(modelTag, 'fact');
      }

      if (meta.repaired) {
        const repairMsg = language === 'english'
          ? 'Language output was auto-corrected for script consistency.'
          : 'भाषा की शुद्धता बनाए रखने के लिए उत्तर स्वतः सुधारा गया।';
        addInfoBubble(repairMsg, 'fact');
      }
    }

    if (!firstAIInteractionDone) {
      firstAIInteractionDone = true;
      if (!installBannerShown) {
        showInstallBanner();
      }
    }

    // --- Phase 3: Cultural + Persona Intelligence ---
    if (!MESSAGE_ONLY_MODE && isFDCalculationResponse(fullText)) {
      const combinedText = `${message}\n${fullText}`;
      saveSharePlanFromResponse(fullText, combinedText);

      // Persona-specific explanation bubble for the same FD result.
      const personaAnalogy = getPersonaAnalogy(persona, fullText);
      if (personaAnalogy) {
        setTimeout(() => {
          const profile = (typeof PersonaEngine !== 'undefined' && PersonaEngine.getPersona)
            ? PersonaEngine.getPersona(persona)
            : { emoji: '💡' };
          addInfoBubble(`${profile.emoji} ${personaAnalogy}`, 'persona');
        }, 450);
      }

      // Festival maturity alert if tenor is present.
      const tenorMonths = extractTenorMonths(combinedText);
      if (tenorMonths) {
        persistTenorContext(tenorMonths);
        const festivalAlert = CulturalEngine.getFestivalAlert(tenorMonths, language);
        if (festivalAlert) {
          setTimeout(() => {
            addInfoBubble(festivalAlert, 'festival');
          }, 900);
        }
      }

      // Separate "Did you know" bubble with local analogy for interest earned.
      const interestAmount = extractInterestAmount(fullText) || extractInterestAmount(combinedText);
      if (interestAmount && interestAmount > 100 && typeof CulturalEngine.getLocalAnalogy === 'function') {
        (async () => {
          try {
            const localAnalogy = await CulturalEngine.getLocalAnalogy(interestAmount, language, persona);
            if (!localAnalogy) return;

            const didYouKnow = `${getDidYouKnowPrefix(language)} ${localAnalogy}`;
            setTimeout(() => {
              addInfoBubble(didYouKnow, 'fact');
            }, tenorMonths ? 1400 : 1000);
          } catch (err) {
            console.warn('Local analogy generation failed:', err);
          }
        })();
      }
    }

    if (!MESSAGE_ONLY_MODE && shouldShowCalculatorCard) {
      const principal = extractPrincipalFromText(message) || extractPrincipalFromText(fullText) || 50000;
      const inferredTenor = extractTenorMonths(`${message}\n${fullText}`) || lastDiscussedTenorMonths || 12;

      setTimeout(() => {
        addInlineCalculatorCard(principal, inferredTenor);
      }, 650);
    }

    // Show quick replies from AI or fallback
    if (!MESSAGE_ONLY_MODE) {
      const replies = quickReplies.length > 0
        ? quickReplies
        : AIEngine.getInitialQuickReplies(language).slice(0, 3);
      showQuickReplies(replies);
    }
  }

  function sendMessage() {
    handleSend();
  }

  // ===== Input Handling =====

  chatInput.addEventListener('input', updateInputButtons);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  function updateInputButtons() {
    const hasText = chatInput.value.trim().length > 0;

    if (voiceModeEnabled || continuousVoiceMode) {
      micBtn.style.display = 'flex';
      sendBtn.style.display = 'none';
      micBtn.classList.add('primary');
      return;
    }

    micBtn.classList.remove('primary');
    sendBtn.style.display = hasText ? 'flex' : 'none';
    micBtn.style.display = hasText ? 'none' : 'flex';
  }

  // ===== Voice =====

  function toggleMic() {
    if (continuousVoiceMode) {
      stopContinuousVoiceMode();
      return;
    }

    if (isVoiceCaptureInProgress) {
      return;
    }

    startVoiceCapture({ fromLoop: false });
  }

  function insertEmoji() {
    const emojis = ['🙏', '👍', '💰', '🤔', '😊', '📊', '🏦', '✅', '🎉', '💡'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    chatInput.value += randomEmoji;
    chatInput.focus();
    updateInputButtons();
  }

  // ===== Info Bubbles (Festival alerts, Did You Know) =====

  function addInfoBubble(text, type, options = {}) {
    if (MESSAGE_ONLY_MODE) return;

    const { persist = true } = options;

    const themes = {
      festival: {
        avatar: '🎉',
        avatarBg: 'linear-gradient(135deg, #FF9933, #e6802b)',
        bubbleBg: '#FFF7ED',
        borderColor: '#FF9933',
      },
      persona: {
        avatar: '🧠',
        avatarBg: 'linear-gradient(135deg, #128C7E, #25D366)',
        bubbleBg: '#ECFEF6',
        borderColor: '#128C7E',
      },
      fact: {
        avatar: '💡',
        avatarBg: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
        bubbleBg: '#EFF6FF',
        borderColor: '#2563eb',
      },
      voice: {
        avatar: '🎧',
        avatarBg: 'linear-gradient(135deg, #334155, #0f766e)',
        bubbleBg: '#F8FAFC',
        borderColor: '#0f766e',
      },
    };

    const theme = themes[type] || themes.fact;

    const row = document.createElement('div');
    row.className = 'message-row assistant';
    row.innerHTML = `
      <div class="msg-avatar" style="background: ${theme.avatarBg}">
        ${theme.avatar}
      </div>
      <div>
        <div class="msg-bubble" style="background: ${theme.bubbleBg}; border-left: 3px solid ${theme.borderColor};">
          ${escapeHtml(text)}
        </div>
      </div>
    `;
    chatMessagesEl.appendChild(row);
    scrollToBottom();

    if (persist && !isRestoringChatSession) {
      uiMessages.push({ role: 'info', type, text });
      persistChatSession();
    }
  }

  // ===== Boot =====
  window.triggerInstallPrompt = triggerInstallPrompt;
  window.dismissInstallBanner = dismissInstallBanner;
  window.shareCurrentFDPlan = shareCurrentFDPlan;
  window.connectCloudAI = connectCloudAI;
  window.refreshAISettings = () => refreshAISettings({ forceRefresh: true });

  init();
