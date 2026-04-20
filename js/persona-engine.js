/* ========================================
   Persona Engine — Persona Profiles + Context
   ======================================== */

const PersonaEngine = (() => {
  const PERSONAS = {
    kisan: {
      id: 'kisan',
      emoji: '👨‍🌾',
      name_hi: 'किसान',
      analogy_style: 'farming',
      sample_analogies: {
        hi: {
          rate: 'जैसे खेत में सही खाद देने पर पैदावार बढ़ती है, वैसे ही एफडी में धन बढ़ता है।',
          tenor: 'जैसे फसल पकने का समय तय होता है, वैसे ही एफडी की अवधि तय होती है।',
          maturity: 'अवधि पूरी होने पर मूलधन के साथ ब्याज भी मिलता है।',
        },
        bho: {
          rate: 'जइसे खेत में सही खाद देला पर पैदावार बढ़ेला, ओइसहीं एफडी में धन बढ़ेला।',
          tenor: 'जइसे फसल पाके में तय समय लागेला, ओइसहीं एफडी के अवधि तय रहेले।',
          maturity: 'समय पूरा होतहीं मूलधन संगे ब्याजो वापस मिलेला।',
        },
        en: {
          rate: 'FD growth is like better crop yield with the right inputs.',
          tenor: 'Tenor is the fixed growing period before harvest.',
          maturity: 'At maturity, you receive principal plus interest.',
        },
      },
    },
    teacher: {
      id: 'teacher',
      emoji: '👩‍🏫',
      name_hi: 'शिक्षक',
      analogy_style: 'mathematical',
      sample_analogies: {
        hi: {
          rate: 'साधारण ब्याज: SI = P × R × T / 100।',
          tenor: 'अवधि (T) समय को दर्शाती है, जैसे 12 महीने = 1 वर्ष।',
          maturity: 'परिपक्व राशि = मूलधन + ब्याज।',
        },
        bho: {
          rate: 'साधारण ब्याज सूत्र: SI = P × R × T / 100।',
          tenor: 'अवधि (T) समय बतावेला, जइसे 12 महीना = 1 बरिस।',
          maturity: 'परिपक्व राशि = मूलधन + ब्याज।',
        },
        en: {
          rate: 'Simple Interest: SI = P × R × T / 100.',
          tenor: 'Tenor is time; 12 months equals 1 year.',
          maturity: 'Maturity amount equals principal plus interest.',
        },
      },
    },
    dukandaar: {
      id: 'dukandaar',
      emoji: '🏪',
      name_hi: 'दुकानदार',
      analogy_style: 'business',
      sample_analogies: {
        hi: {
          rate: 'इसे सुरक्षित और तय लाभ वाले सौदे की तरह समझें।',
          tenor: 'यह तय लॉक-इन अवधि जैसा है, जैसे कारोबार में तय उधारी चक्र।',
          maturity: 'समय पूरा होने पर पूंजी के साथ लाभ वापस मिलता है।',
        },
        bho: {
          rate: 'एकरा के सुरक्षित आ तय फायदा वाला सौदा समझीं।',
          tenor: 'ई तय लॉक-इन अवधि जइसन बा, जइसे कारोबार के तय चक्र।',
          maturity: 'समय पूरा होतहीं पूंजी संगे फायदा वापस मिलेला।',
        },
        en: {
          rate: 'Think of FD as a low-risk, fixed-margin business deal.',
          tenor: 'Tenor is like a fixed inventory cycle.',
          maturity: 'At maturity, capital comes back with fixed profit.',
        },
      },
    },
    retired: {
      id: 'retired',
      emoji: '👴',
      name_hi: 'सेवानिवृत्त',
      analogy_style: 'safety-focused',
      sample_analogies: {
        hi: {
          rate: 'एफडी नियमित और अपेक्षाकृत स्थिर आय की योजना हो सकती है।',
          tenor: '6 महीने से लेकर कई वर्षों तक अवधि चुन सकते हैं।',
          maturity: 'अवधि पूरी होने पर राशि और ब्याज दोनों सुरक्षित रूप से मिलते हैं।',
        },
        bho: {
          rate: 'एफडी नियमित आ काफी हद तक स्थिर आमदनी के योजना हो सकेला।',
          tenor: '6 महीना से कई बरिस तक अवधि चुनल जा सकेला।',
          maturity: 'समय पूरा होतहीं राशि आ ब्याज दुनो सुरक्षित रूप से मिलेला।',
        },
        en: {
          rate: 'FDs can support stable and predictable income planning.',
          tenor: 'You can choose tenors from months to years.',
          maturity: 'At maturity, principal and interest are paid out together.',
        },
      },
    },
    student: {
      id: 'student',
      emoji: '🎓',
      name_hi: 'छात्र',
      analogy_style: 'modern',
      sample_analogies: {
        hi: {
          rate: 'छोटी बचत भी तय ब्याज से समय के साथ बढ़ती जाती है।',
          tenor: 'इसे लक्ष्य-आधारित बचत का तय समय मानें।',
          maturity: 'मियाद पूरी होने पर पूरी राशि और ब्याज मिल जाता है।',
        },
        bho: {
          rate: 'छोट बचत भी तय ब्याज से धीरे-धीरे बढ़ेला।',
          tenor: 'एकरा के लक्ष्य-आधारित बचत के तय समय समझीं।',
          maturity: 'मियाद पूरा होतहीं पूरा धन आ ब्याज मिल जाला।',
        },
        en: {
          rate: 'Even small savings grow steadily with fixed interest.',
          tenor: 'Treat tenor like a fixed timeline for your goal.',
          maturity: 'At maturity, you receive full amount plus interest.',
        },
      },
    },
  };

  function normalizeLanguage(language) {
    const lang = String(language || '').toLowerCase();
    const supported = ['hindi', 'bhojpuri', 'english', 'bengali', 'tamil', 'telugu', 'marathi', 'punjabi', 'kannada', 'malayalam', 'gujarati', 'odia'];
    return supported.includes(lang) ? lang : 'hindi';
  }

  function resolvePersonaDialect(language) {
    const lang = normalizeLanguage(language);
    if (lang === 'english') return 'en';
    if (lang === 'bhojpuri') return 'bho';
    return 'hi';
  }

  function getPersona(personaId) {
    return PERSONAS[personaId] || PERSONAS.kisan;
  }

  function getAllPersonas() {
    return PERSONAS;
  }

  function getPersonaContext(personaId, language) {
    const persona = getPersona(personaId);
    const lang = normalizeLanguage(language);
    const dialect = resolvePersonaDialect(lang);
    const examples = persona.sample_analogies[dialect] || persona.sample_analogies.hi;

    const scriptRule = dialect === 'hi'
      ? 'देवनागरी में लिखें, हिंदी शब्द रोमन में न लिखें।'
      : dialect === 'bho'
        ? 'देवनागरी भोजपुरी लिखें, भोजपुरी शब्द रोमन में न लिखें।'
        : 'Use clear Indian English.';

    return [
      `PERSONA ACTIVE: ${persona.emoji} ${persona.name_hi}`,
      `Analogy style: ${persona.analogy_style}`,
      `Respond in: ${lang}`,
      scriptRule,
      'Use these persona-specific analogies while explaining FD:',
      `- Interest Rate: ${examples.rate}`,
      `- Tenor: ${examples.tenor}`,
      `- Maturity: ${examples.maturity}`,
      'Keep tone warm, practical, and easy to understand.',
    ].join('\n');
  }

  function getPersonaPreviewText(personaId, language) {
    const persona = getPersona(personaId);
    const dialect = resolvePersonaDialect(language);
    const examples = persona.sample_analogies[dialect] || persona.sample_analogies.hi;

    if (dialect === 'en') {
      return `Meera style: ${examples.rate}`;
    }
    return `मीरा की शैली: ${examples.rate}`;
  }

  return {
    PERSONAS,
    getPersona,
    getAllPersonas,
    getPersonaContext,
    getPersonaPreviewText,
  };
})();
