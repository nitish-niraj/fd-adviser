/* ========================================
   AI Engine — Vernacular + Script Purity + Streaming
   ======================================== */

const AIEngine = (() => {
  let userIsConfused = false;

  const langCodeToName = {
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

  const langNameToCode = Object.entries(langCodeToName).reduce((acc, [code, name]) => {
    acc[name] = code;
    return acc;
  }, {});

  const romanAllowedTokens = new Set([
    'fd', 'rbi', 'dicgc', 'tds', 'kyc', 'upi', 'sbi', 'hdfc', 'au', 'sfb',
    'ai', 'api', 'inr', 'rs', 'bk', 'gpt', 'claude', 'gemini',
  ]);

  const languagePolicies = {
    hindi: {
      name: 'शुद्ध हिंदी',
      scriptHint: 'देवनागरी लिपि',
      instruction: [
        'केवल देवनागरी लिपि में उत्तर दें।',
        'हिंदी शब्द रोमन में न लिखें।',
        'अनावश्यक अंग्रेज़ी शब्दों से बचें।',
        'केवल बैंक नाम/संक्षेप जैसे SBI, HDFC, FD, RBI रहने दें।',
      ].join(' '),
      confusionPrompt: 'यूज़र भ्रमित है। अगला उत्तर बहुत सरल, छोटा और नए उदाहरण के साथ दें।',
    },
    bhojpuri: {
      name: 'भोजपुरी',
      scriptHint: 'देवनागरी लिपि',
      instruction: [
        'भोजपुरी में देवनागरी लिपि का ही प्रयोग करें।',
        'भोजपुरी शब्द रोमन में न लिखें।',
        'स्वर प्राकृतिक रखें: बा, होई, रउआ, कइसे जैसे प्रयोग स्वीकार्य हैं।',
      ].join(' '),
      confusionPrompt: 'यूज़र ना समझल। बहुत आसान भोजपुरी में एक लाइन में फेर समझाईं।',
    },
    english: {
      name: 'English',
      scriptHint: 'Latin script',
      instruction: 'Respond in clear Indian English with short, practical sentences.',
      confusionPrompt: 'User is confused. Re-explain with a very simple one-line analogy.',
    },
    bengali: {
      name: 'বাংলা',
      scriptHint: 'Bengali script',
      instruction: 'Respond in conversational Bengali script. Avoid Romanized Bengali.',
      confusionPrompt: 'ব্যবহারকারী বিভ্রান্ত। খুব সহজভাবে আবার বোঝান।',
    },
    tamil: {
      name: 'தமிழ்',
      scriptHint: 'Tamil script',
      instruction: 'Respond in clear spoken Tamil script. Avoid Romanized Tamil.',
      confusionPrompt: 'பயனர் குழப்பத்தில் உள்ளார். மிகவும் எளிமையாக மீண்டும் விளக்கவும்.',
    },
    telugu: {
      name: 'తెలుగు',
      scriptHint: 'Telugu script',
      instruction: 'Respond in clear conversational Telugu script. Avoid Romanized Telugu.',
      confusionPrompt: 'వినియోగదారు గందరగోళంలో ఉన్నారు. చాలా సులభంగా మళ్లీ చెప్పండి.',
    },
    marathi: {
      name: 'मराठी',
      scriptHint: 'Devanagari script',
      instruction: 'Respond in simple Marathi (Devanagari) and avoid Romanized Marathi.',
      confusionPrompt: 'वापरकर्ता गोंधळला आहे. अतिशय सोप्या भाषेत पुन्हा समजवा.',
    },
    punjabi: {
      name: 'ਪੰਜਾਬੀ',
      scriptHint: 'Gurmukhi script',
      instruction: 'Respond in Punjabi using Gurmukhi script only.',
      confusionPrompt: 'ਯੂਜ਼ਰ ਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਬਹੁਤ ਸੌਖੇ ਤਰੀਕੇ ਨਾਲ ਫਿਰ ਸਮਝਾਓ।',
    },
    kannada: {
      name: 'ಕನ್ನಡ',
      scriptHint: 'Kannada script',
      instruction: 'Respond in simple Kannada script only.',
      confusionPrompt: 'ಬಳಕೆದಾರರಿಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ತುಂಬಾ ಸರಳವಾಗಿ ಮತ್ತೆ ತಿಳಿಸಿ.',
    },
    malayalam: {
      name: 'മലയാളം',
      scriptHint: 'Malayalam script',
      instruction: 'Respond in conversational Malayalam script only.',
      confusionPrompt: 'ഉപയോക്താവ് കുഴങ്ങി. വളരെ ലളിതമായി വീണ്ടും വിശദീകരിക്കുക.',
    },
    gujarati: {
      name: 'ગુજરાતી',
      scriptHint: 'Gujarati script',
      instruction: 'Respond in conversational Gujarati script only.',
      confusionPrompt: 'વપરાશકર્તા ગૂંચવાયા છે. ખૂબ સરળ રીતે ફરી સમજાવો.',
    },
    odia: {
      name: 'ଓଡ଼ିଆ',
      scriptHint: 'Odia script',
      instruction: 'Respond in conversational Odia script only.',
      confusionPrompt: 'ଉପଭୋକ୍ତା ଅବାକ୍। ଅତ୍ୟନ୍ତ ସହଜ ଭାବରେ ପୁଣି କହନ୍ତୁ।',
    },
  };

  const quickReplyDefaults = {
    hindi: ['सबसे अच्छा एफडी विकल्प बताइए', '₹50,000 पर कितना लाभ होगा?', 'एफडी में टीडीएस क्या होता है?'],
    bhojpuri: ['सबसे बढ़िया एफडी बताईं', '₹50,000 पे कतना फायदा होई?', 'टीडीएस का होला?'],
    english: ['Show best FD option', 'Calculate return for ₹50,000', 'Explain TDS simply'],
    bengali: ['সেরা FD বলুন', '₹50,000 দিলে কত পাব?', 'TDS সহজে বোঝান'],
    tamil: ['சிறந்த FD எது?', '₹50,000க்கு எவ்வளவு வரும்?', 'TDS எளிதாக சொல்லுங்கள்'],
    telugu: ['మంచి FD ఏది?', '₹50,000కు ఎంత వస్తుంది?', 'TDS ని సులభంగా చెప్పండి'],
    marathi: ['सर्वोत्तम FD सांगा', '₹50,000 वर किती मिळेल?', 'TDS सोप्या भाषेत समजवा'],
    punjabi: ['ਸਭ ਤੋਂ ਵਧੀਆ FD ਦੱਸੋ', '₹50,000 ਤੇ ਕਿੰਨਾ ਮਿਲੇਗਾ?', 'TDS ਸੌਖੇ ਤਰੀਕੇ ਨਾਲ ਸਮਝਾਓ'],
    kannada: ['ಉತ್ತಮ FD ಯಾವುದು?', '₹50,000ಕ್ಕೆ ಎಷ್ಟು ಸಿಗುತ್ತದೆ?', 'TDS ಸರಳವಾಗಿ ಹೇಳಿ'],
    malayalam: ['മികച്ച FD ഏത്?', '₹50,000ക്ക് എത്ര കിട്ടും?', 'TDS ലളിതമായി പറയൂ'],
    gujarati: ['સારો FD વિકલ્પ જણાવો', '₹50,000 પર કેટલું મળશે?', 'TDS સરળ ભાષામાં સમજાવો'],
    odia: ['ସର୍ବୋତ୍ତମ FD କୁହନ୍ତୁ', '₹50,000 ରେ କେତେ ମିଳିବ?', 'TDS ସହଜରେ ବୁଝାନ୍ତୁ'],
  };

  const greetingTemplates = {
    hindi: {
      kisan: 'नमस्ते! मैं मीरा हूँ। मैं एफडी को खेती के उदाहरण से बहुत आसान तरीके से समझाऊँगी। बताइए, आज किस बात से शुरू करें?',
      teacher: 'नमस्ते! मैं मीरा हूँ। मैं आपको एफडी बिल्कुल क्रमवार और स्पष्ट तरीके से समझाऊँगी। पहले क्या जानना चाहते हैं?',
      dukandaar: 'नमस्ते! मैं मीरा हूँ। मैं एफडी को व्यापार और लाभ के आसान उदाहरणों से समझाऊँगी। क्या तुलना चाहिए या गणना?',
      retired: 'नमस्ते! मैं मीरा हूँ। मैं सुरक्षित और नियमित आय वाली एफडी योजनाएँ सरल भाषा में बताऊँगी। आपको मासिक आय वाली योजना देखनी है?',
      student: 'नमस्ते! मैं मीरा हूँ। मैं एफडी को बहुत सरल और सीधे तरीके से समझाऊँगी ताकि निर्णय आसान हो। क्या आप राशि बताकर गणना देखना चाहेंगे?',
      doctor: 'नमस्ते! मैं मीरा हूँ। आपातकालीन चिकित्सा निधि और दीर्घकालीन स्वास्थ्य सुरक्षा के लिए एफडी योजना आसान भाषा में समझाऊँगी। आप कितनी राशि सुरक्षित रखना चाहते हैं?',
      parent: 'नमस्ते! मैं मीरा हूँ। बच्चों की शिक्षा, विवाह और भविष्य सुरक्षा के लिए एफडी योजना सरल तरीके से समझाऊँगी। पहले क्या जानना चाहते हैं?',
      business: 'नमस्ते! मैं मीरा हूँ। व्यावसायिक निधि और आरक्षित पूंजी के लिए एफडी विकल्प सीधे भाषा में बताऊँगी। कितना निवेश सोच रहे हैं?',
      nurse: 'नमस्ते! मैं मीरा हूँ। नियमित आय और सेवानिवृत्ति योजना के लिए सुरक्षित एफडी विकल्प समझाऊँगी। शुरुआत कहाँ से करें?',
      freelancer: 'नमस्ते! मैं मीरा हूँ। अनियमित आय को स्थिर करने के लिए बहु-परत निवेश रणनीति आसान भाषा में बताऊँगी। पहले कितना जमा रख सकते हैं?',
    },
    bhojpuri: {
      kisan: 'प्रणाम! हम मीरा बानी। एफडी के बहुत आसान भाषा में समझाइब, जेकरा से तुरंते बात बुझा जाव। पहिले का जानल चाहत बानी?',
      teacher: 'प्रणाम! हम मीरा बानी। एफडी के क्रम से, साफ-साफ समझाइब। रउआ पहिले का पूछे चाहत बानी?',
      dukandaar: 'प्रणाम! हम मीरा बानी। एफडी के नफा-नुकसान वाला सीधा हिसाब से बताइब। तुलना चाहीं कि गणना?',
      retired: 'प्रणाम! हम मीरा बानी। सुरक्षित आ नियमित आमदनी वाला एफडी विकल्प आसान भोजपुरी में बताइब। मासिक आमदनी वाला देखब?',
      student: 'प्रणाम! हम मीरा बानी। एफडी के सीधा आ आसान तरीका से समझाइब। रउआ राशि बताईं, हम तुरंत हिसाब दे देब।',
      doctor: 'प्रणाम! हम मीरा बानी। आपातकालीन दवा के पैसा आ लंबे समय के स्वास्थ्य सुरक्षा के लिए एफडी योजना आसान भाषा में बुझइहे। रउआ कतना राशि राखल चाहत बानी?',
      parent: 'प्रणाम! हम मीरा बानी। लइका के पढ़ाई, बियाह आ भविष्य सुरक्षा के लिए एफडी योजना सीधा तरीका से बतइहे। पहिले का जानल चाहत बानी?',
      business: 'प्रणाम! हम मीरा बानी। कारोबारी निधि आ आरक्षण राशि के लिए एफडी विकल्प सीधा भाषा में देब। कतना निवेश सोच रहल बानी?',
      nurse: 'प्रणाम! हम मीरा बानी। नियमित आमदनी आ सेवानिवृत्ति योजना के लिए सुरक्षित एफडी बुझइहे। शुरुआत कहाँ से करब?',
      freelancer: 'प्रणाम! हम मीरा बानी। अनियमित आमदनी स्थिर करला के लिए कई तरह के निवेश रणनीति आसान भाषा में बतइहे। पहिले कतना जमा राख सकत बानी?',
    },
    english: {
      kisan: 'Namaste, I am Meera. I will explain FD in simple farming analogies. What do you want to start with?',
      teacher: 'Hello, I am Meera. I will explain FD in clear step-by-step form. What should we begin with?',
      dukandaar: 'Hello, I am Meera. I can break FD into practical business-style numbers. Need comparison or calculation first?',
      retired: 'Namaste, I am Meera. I will focus on safe and stable FD options for regular income. Should we check monthly payout plans?',
      student: 'Hi, I am Meera. I will keep FD explanations short and practical so you can decide quickly. Want a quick return calculation?',
      doctor: 'Hello, I am Meera. I will explain FD options for medical emergencies and long-term health security in simple terms. How much would you like to invest?',
      parent: 'Hi, I am Meera. I will explain FD plans for child education, marriage, and future security in practical language. What should we start with?',
      business: 'Hello, I am Meera. I can explain FD for business reserve funds and growth capital in straightforward terms. How much are you thinking of investing?',
      nurse: 'Hello, I am Meera. I will focus on FD for regular income and retirement planning in simple language. Where should we begin?',
      freelancer: 'Hi, I am Meera. I will explain multi-layer investment strategy to stabilize irregular income in easy terms. How much can you invest initially?',
    },
  };

  const fallbackRates = [
    { name: 'Suryoday Small Finance Bank', rate12: 8.5 },
    { name: 'Utkarsh Small Finance Bank', rate12: 8.25 },
    { name: 'Jana Small Finance Bank', rate12: 8.0 },
    { name: 'AU Small Finance Bank', rate12: 7.75 },
    { name: 'HDFC Bank', rate12: 7.0 },
    { name: 'SBI', rate12: 6.5 },
  ];

  function normalizeLanguage(language) {
    const key = String(language || 'hindi').toLowerCase();
    return languagePolicies[key] ? key : 'hindi';
  }

  function heuristicDetectLanguage(text) {
    const sample = String(text || '');
    if (!sample) return 'hindi';

    if (/[\u0B80-\u0BFF]/.test(sample)) return 'tamil';
    if (/[\u0C00-\u0C7F]/.test(sample)) return 'telugu';
    if (/[\u0980-\u09FF]/.test(sample)) return 'bengali';
    if (/[\u0A00-\u0A7F]/.test(sample)) return 'punjabi';
    if (/[\u0C80-\u0CFF]/.test(sample)) return 'kannada';
    if (/[\u0D00-\u0D7F]/.test(sample)) return 'malayalam';
    if (/[\u0A80-\u0AFF]/.test(sample)) return 'gujarati';
    if (/[\u0B00-\u0B7F]/.test(sample)) return 'odia';
    if (/[\u0900-\u097F]/.test(sample)) return 'hindi';
    if (/[A-Za-z]/.test(sample)) return 'english';

    return 'hindi';
  }

  async function detectLanguage(text) {
    const heuristic = heuristicDetectLanguage(text);

    try {
      const result = await PuterInit.chat(
        [{ role: 'user', content: String(text || '') }],
        {
          stream: false,
          system: 'Detect language and return exactly one lowercase word from: hindi,bhojpuri,bengali,tamil,telugu,marathi,punjabi,kannada,malayalam,gujarati,odia,english',
        }
      );

      const raw = String(PuterInit.extractResponseText(result.response) || '').trim().toLowerCase();
      const valid = Object.keys(langNameToCode);
      const hit = valid.find((x) => raw.includes(x));
      return hit || heuristic;
    } catch {
      return heuristic;
    }
  }

  function detectConfusion(message) {
    const lower = String(message || '').toLowerCase();
    const signals = [
      'समझ नहीं', 'नहीं समझा', 'फिर से', 'दोबारा',
      'na samajh', 'samjha nahi', 'phir se', 'again', 'repeat',
      'confused', 'not clear', 'easy mein',
    ];

    const confused = signals.some((token) => lower.includes(token));
    if (confused) userIsConfused = true;
    return confused;
  }

  function getPolicy(language) {
    return languagePolicies[normalizeLanguage(language)] || languagePolicies.hindi;
  }

  function buildFDDataBlock() {
    const rows = fallbackRates
      .map((row, index) => `${index + 1}. ${row.name} — 12M: ${row.rate12.toFixed(2)}%`)
      .join('\n');

    return [
      'Use these baseline FD references when no fresher table is provided:',
      rows,
      'All examples should mention DICGC cover up to ₹5,00,000 per depositor per bank.',
    ].join('\n');
  }

  function buildSystemPrompt(language, persona, chatHistory) {
    const lang = normalizeLanguage(language);
    const policy = getPolicy(lang);
    const personaInfo = (typeof PersonaEngine !== 'undefined' && typeof PersonaEngine.getPersonaContext === 'function')
      ? PersonaEngine.getPersonaContext(persona, lang)
      : `Persona: ${persona || 'kisan'}`;

    const confusionBlock = userIsConfused ? policy.confusionPrompt : '';
    userIsConfused = false;

    return [
      'You are Meera, a trusted Fixed Deposit advisor for Indian users.',
      `Language mode: ${policy.name} (${policy.scriptHint}).`,
      policy.instruction,
      'Keep response short: 3-5 sentences.',
      'Explain jargon immediately in plain terms when it appears.',
      'When comparing options, use a numbered list and mark best option with ⭐.',
      'After response, append exactly this tag format with 2-3 follow-ups in same language:',
      '[QUICK_REPLIES: ["..."]]',
      buildFDDataBlock(),
      personaInfo,
      confusionBlock,
    ].filter(Boolean).join('\n\n');
  }

  function parseAmount(text) {
    const amountMatch = String(text || '').match(/(?:₹|rs\.?|inr)?\s*([\d,]{3,})(?!\.)/i);
    if (!amountMatch) return null;
    const value = Number(amountMatch[1].replace(/,/g, ''));
    return Number.isFinite(value) ? value : null;
  }

  function parseTenorMonths(text) {
    const sample = String(text || '').toLowerCase();
    const monthMatch = sample.match(/(\d+(?:\.\d+)?)\s*(months?|month|mahine|mahina|महीने|महीना)/i);
    if (monthMatch) return Math.max(1, Math.round(Number(monthMatch[1])));

    const yearMatch = sample.match(/(\d+(?:\.\d+)?)\s*(years?|year|saal|sal|साल)/i);
    if (yearMatch) return Math.max(1, Math.round(Number(yearMatch[1]) * 12));

    return null;
  }

  function formatINR(amount) {
    return '₹' + Math.round(Number(amount || 0)).toLocaleString('en-IN');
  }

  function getInitialQuickReplies(language) {
    const lang = normalizeLanguage(language);
    return (quickReplyDefaults[lang] || quickReplyDefaults.hindi).slice(0, 4);
  }

  function containsForbiddenRoman(text, language) {
    const lang = normalizeLanguage(language);
    if (!(lang === 'hindi' || lang === 'bhojpuri')) return false;

    const words = String(text || '').match(/[A-Za-z]{2,}/g) || [];
    if (!words.length) return false;

    return words.some((word) => !romanAllowedTokens.has(word.toLowerCase()));
  }

  function localRomanCleanup(text) {
    const dict = {
      rate: 'ब्याज दर',
      tenor: 'अवधि',
      maturity: 'परिपक्वता',
      compare: 'तुलना',
      booking: 'बुकिंग',
      details: 'विवरण',
      simple: 'सरल',
      safe: 'सुरक्षित',
      option: 'विकल्प',
      interest: 'ब्याज',
      bank: 'बैंक',
    };

    let output = String(text || '');
    Object.entries(dict).forEach(([key, value]) => {
      const pattern = new RegExp(`\\b${key}\\b`, 'gi');
      output = output.replace(pattern, value);
    });

    return output;
  }

  async function repairScriptIfNeeded(text, language) {
    const lang = normalizeLanguage(language);
    if (!containsForbiddenRoman(text, lang)) {
      return { text, repaired: false };
    }

    try {
      const policy = getPolicy(lang);
      const repairPrompt = [
        `Convert the following reply into ${policy.name} using ${policy.scriptHint}.`,
        'Keep meaning, numbers, and bank abbreviations (SBI/HDFC/FD/RBI/DICGC/TDS) unchanged.',
        'Return only final rewritten text.',
        '',
        text,
      ].join('\n');

      const result = await PuterInit.chat(
        [{ role: 'user', content: repairPrompt }],
        { stream: false }
      );

      const repairedText = String(PuterInit.extractResponseText(result.response) || '').trim();
      if (repairedText && !containsForbiddenRoman(repairedText, lang)) {
        return { text: repairedText, repaired: true };
      }
    } catch {}

    const cleaned = localRomanCleanup(text);
    return { text: cleaned, repaired: cleaned !== text };
  }

  function parseQuickReplies(text) {
    const rawText = String(text || '');
    let quickReplies = [];
    let cleanText = rawText;

    const qrRegex = /\[QUICK_REPLIES:\s*\[(.*?)\]\s*\]/s;
    const match = rawText.match(qrRegex);

    if (match) {
      try {
        quickReplies = JSON.parse(`[${match[1]}]`);
      } catch {
        quickReplies = match[1]
          .split(',')
          .map((x) => x.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }

      cleanText = rawText.replace(qrRegex, '').trim();
    }

    return {
      cleanText,
      quickReplies: Array.isArray(quickReplies) ? quickReplies.filter(Boolean).slice(0, 3) : [],
    };
  }

  function buildOfflineReply(userMessage, language) {
    const lang = normalizeLanguage(language);
    const amount = parseAmount(userMessage);
    const tenor = parseTenorMonths(userMessage) || 12;

    if (amount) {
      const rate = 8.5;
      const interest = (amount * rate * (tenor / 12)) / 100;
      const maturity = amount + interest;

      const textByLang = {
        hindi: `${formatINR(amount)} को ${tenor} महीने के लिए रखने पर अनुमानित परिपक्व राशि ${formatINR(maturity)} होगी। अनुमानित लाभ ${formatINR(interest)} है। चाहें तो मैं सर्वोत्तम बैंक तुलना भी दिखा सकती हूँ।`,
        bhojpuri: `${formatINR(amount)} के ${tenor} महीना रखल जाय, त अनुमानित परिपक्व राशि ${formatINR(maturity)} होई। अनुमानित फायदा ${formatINR(interest)} बा। चाहीं त सबसे बढ़िया बैंक तुलना भी देखाईं।`,
        english: `If you place ${formatINR(amount)} for ${tenor} months, estimated maturity is ${formatINR(maturity)}. Estimated gain is ${formatINR(interest)}. I can also compare best FD options now.`,
      };

      return {
        fullText: textByLang[lang] || textByLang.hindi,
        quickReplies: getInitialQuickReplies(lang).slice(0, 3),
      };
    }

    const generic = {
      hindi: 'मैं आपकी भाषा में एफडी, ब्याज, अवधि, टीडीएस और बुकिंग प्रक्रिया सरल तरीके से समझा सकती हूँ। राशि और समय बताइए, मैं तुरंत गणना दूँगी।',
      bhojpuri: 'हम रउआ भाषा में एफडी, ब्याज, अवधि, टीडीएस आ बुकिंग सब आसान तरीका से समझा सकत बानी। राशि आ समय बताईं, तुरंत हिसाब देब।',
      english: 'I can explain FD terms, returns, safety, and booking flow in plain language. Share amount and duration, and I will calculate instantly.',
    };

    return {
      fullText: generic[lang] || generic.hindi,
      quickReplies: getInitialQuickReplies(lang).slice(0, 3),
    };
  }

  async function sendMessage(userMessage, chatHistory, language, persona, streamCallback) {
    detectConfusion(userMessage);

    const lang = normalizeLanguage(language);
    const history = Array.isArray(chatHistory) ? chatHistory : [];
    const system = buildSystemPrompt(lang, persona, history);
    const messages = history.map((m) => ({ role: m.role, content: m.content }));
    messages.push({ role: 'user', content: String(userMessage || '') });

    try {
      await PuterInit.waitForPuter();
      const connected = await PuterInit.ensureAuthenticated({ interactive: false, reason: 'chat-send' });

      if (!connected) {
        const fallback = buildOfflineReply(userMessage, lang);
        if (typeof streamCallback === 'function') streamCallback(fallback.fullText);

        return {
          ...fallback,
          meta: {
            source: 'offline-fallback',
            model: null,
            repaired: false,
          },
        };
      }

      const { response, model, provider } = await PuterInit.chat(messages, {
        stream: true,
        system,
      });

      let fullText = '';

      if (response && typeof response[Symbol.asyncIterator] === 'function') {
        for await (const chunk of response) {
          const piece = String(chunk?.text || chunk?.message?.content?.[0]?.text || '');
          if (!piece) continue;
          fullText += piece;
          if (typeof streamCallback === 'function') streamCallback(piece);
        }
      } else {
        fullText = PuterInit.extractResponseText(response);
        if (typeof streamCallback === 'function' && fullText) {
          streamCallback(fullText);
        }
      }

      const { cleanText, quickReplies } = parseQuickReplies(fullText);
      const repaired = await repairScriptIfNeeded(cleanText, lang);

      return {
        fullText: repaired.text,
        quickReplies: quickReplies.length ? quickReplies : getInitialQuickReplies(lang).slice(0, 3),
        meta: {
          source: 'puter-ai',
          model: model || null,
          provider: provider || null,
          repaired: Boolean(repaired.repaired),
        },
      };
    } catch (err) {
      console.error('[AIEngine] sendMessage failed:', err);
      const fallback = buildOfflineReply(userMessage, lang);
      if (typeof streamCallback === 'function') streamCallback(fallback.fullText);

      return {
        ...fallback,
        meta: {
          source: 'offline-fallback',
          model: null,
          repaired: false,
        },
      };
    }
  }

  async function getGreeting(language, persona, userName) {
    const lang = normalizeLanguage(language);
    const templates = greetingTemplates[lang] || greetingTemplates.hindi;
    let text = templates[persona] || templates.kisan;

    if (userName) {
      if (lang === 'hindi') text = `नमस्ते ${userName}! ${text.replace(/^नमस्ते!?\s*/, '')}`;
      if (lang === 'bhojpuri') text = `प्रणाम ${userName}! ${text.replace(/^प्रणाम!?\s*/, '')}`;
      if (lang === 'english') text = `Hello ${userName}! ${text.replace(/^(Namaste|Hello|Hi),?\s*/i, '')}`;
    }

    const repaired = await repairScriptIfNeeded(text, lang);
    return repaired.text;
  }

  return {
    detectLanguage,
    buildSystemPrompt,
    sendMessage,
    detectConfusion,
    getGreeting,
    getInitialQuickReplies,
    langCodeToName,
    langNameToCode,
    parseQuickReplies,
  };
})();
