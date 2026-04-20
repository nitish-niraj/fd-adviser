/* ========================================
   Voice — Puter Speech APIs
   Uses only puter.ai.speech2txt and puter.ai.txt2speech
   ======================================== */

const VoiceEngine = (() => {
  let isListening = false;
  let currentAudio = null;
  let currentObjectUrl = null;
  const MAX_MOOD_CACHE_SIZE = 120;
  const moodProfileCache = new Map();
  const SPEECH_STYLE_KEY = 'fd_speech_style_mode_v1';

  function readSpeechStyleMode() {
    try {
      if (typeof localStorage === 'undefined') return true;
      const raw = String(localStorage.getItem(SPEECH_STYLE_KEY) || '').toLowerCase();
      if (raw === 'off') return false;
      if (raw === 'on') return true;
      return true;
    } catch {
      return true;
    }
  }

  let speechStyleEnabled = readSpeechStyleMode();

  const MOOD_PROFILE_MAP = {
    calm: { mood: 'calm', rate: 0.93, pitch: 0.92 },
    informative: { mood: 'informative', rate: 1.0, pitch: 1.0 },
    reassuring: { mood: 'reassuring', rate: 0.91, pitch: 0.9 },
    excited: { mood: 'excited', rate: 1.08, pitch: 1.1 },
    urgent: { mood: 'urgent', rate: 1.12, pitch: 1.03 },
  };

  const LANGUAGE_TO_LOCALE = {
    hindi: 'hi-IN',
    bengali: 'bn-IN',
    tamil: 'ta-IN',
    telugu: 'te-IN',
    marathi: 'mr-IN',
    punjabi: 'pa-IN',
    kannada: 'kn-IN',
    malayalam: 'ml-IN',
    gujarati: 'gu-IN',
    odia: 'or-IN',
    bhojpuri: 'hi-IN',
    english: 'en-IN',
  };

  function resolveLocale(language) {
    const key = String(language || '').toLowerCase();
    return LANGUAGE_TO_LOCALE[key] || 'hi-IN';
  }

  function clampNumber(value, min, max, fallback) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function normalizeMood(value) {
    const key = String(value || '').toLowerCase().trim();
    if (MOOD_PROFILE_MAP[key]) return key;

    const aliases = {
      neutral: 'informative',
      explanatory: 'informative',
      formal: 'informative',
      happy: 'excited',
      cheerful: 'excited',
      positive: 'excited',
      empathetic: 'reassuring',
      comforting: 'reassuring',
      supportive: 'reassuring',
      warning: 'urgent',
      alert: 'urgent',
      serious: 'calm',
    };

    return aliases[key] || 'informative';
  }

  function isSupported() {
    return (
      typeof puter !== 'undefined' &&
      puter.ai &&
      typeof puter.ai.speech2txt === 'function' &&
      typeof puter.ai.txt2speech === 'function'
    );
  }

  function getRecognitionCtor() {
    if (typeof window === 'undefined') return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  function canUseBrowserVoiceInput() {
    return Boolean(getRecognitionCtor());
  }

  function canUseBrowserSpeechOutput() {
    return typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined';
  }

  async function canUsePuterSpeech() {
    if (!isSupported()) return false;

    try {
      if (typeof PuterInit !== 'undefined' && typeof PuterInit.ensureAuthenticated === 'function') {
        return await PuterInit.ensureAuthenticated({ interactive: false, reason: 'voice-speech' });
      }
    } catch {
      return false;
    }

    return true;
  }

  function getIsListening() {
    return isListening;
  }

  function stripQuickReplies(text) {
    return String(text || '').replace(/\[\s*QUICK_REPLIES\s*:[\s\S]*?\]/gi, ' ');
  }

  function stripMarkdown(text) {
    return text
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`]*`/g, ' ')
      .replace(/!\[[^\]]*\]\([^\)]*\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^\)]*\)/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^>\s+/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/\{[^{}]*\}/g, ' ')
      .replace(/[\[\]{}]/g, ' ');
  }

  function stripEmojis(text) {
    return text
      .replace(/[\u{1F000}-\u{1FAFF}]/gu, ' ')
      .replace(/[\u{2600}-\u{27BF}]/gu, ' ')
      .replace(/[\u{FE0F}\u{200D}]/gu, ' ');
  }

  function cleanTextForSpeech(text) {
    const cleaned = stripEmojis(stripMarkdown(stripQuickReplies(text)))
      .replace(/\s+/g, ' ')
      .trim();

    return cleaned;
  }

  function getMoodCacheKey(text, language) {
    const sample = String(text || '').slice(0, 240).toLowerCase().replace(/\s+/g, ' ').trim();
    return `${String(language || '').toLowerCase()}::${sample}`;
  }

  function rememberMoodProfile(cacheKey, profile) {
    if (!cacheKey || !profile) return;

    moodProfileCache.set(cacheKey, profile);
    if (moodProfileCache.size <= MAX_MOOD_CACHE_SIZE) return;

    const firstKey = moodProfileCache.keys().next().value;
    if (firstKey) {
      moodProfileCache.delete(firstKey);
    }
  }

  function heuristicMoodProfile(text) {
    const sample = String(text || '').toLowerCase();

    if (/(urgent|immediate|immediately|asap|alert|warning|risk|dhyan|turant|jaldi|abhi)\b/.test(sample) || /!{2,}/.test(sample)) {
      return { ...MOOD_PROFILE_MAP.urgent, source: 'heuristic' };
    }

    if (/(congrats|congratulations|great|awesome|excellent|bahut accha|badhai|shandaar|wah)\b/.test(sample)) {
      return { ...MOOD_PROFILE_MAP.excited, source: 'heuristic' };
    }

    if (/(safe|worry|chinta|don't worry|do not worry|reassure|bilkul safe|no tension|ghabr)\b/.test(sample)) {
      return { ...MOOD_PROFILE_MAP.reassuring, source: 'heuristic' };
    }

    if (/(step\s*\d|step\s*1|first|second|third|example|formula|interest|tenor|maturity|tds|principal|comparison|option)\b/.test(sample)) {
      return { ...MOOD_PROFILE_MAP.informative, source: 'heuristic' };
    }

    return { ...MOOD_PROFILE_MAP.calm, source: 'heuristic' };
  }

  function extractChatText(result) {
    if (typeof result === 'string') return result;
    if (!result || typeof result !== 'object') return '';

    const content = result?.message?.content;
    if (Array.isArray(content)) {
      const textPart = content.find((part) => typeof part?.text === 'string' && part.text.trim());
      if (textPart?.text) return textPart.text;
    }

    const candidates = [
      result.text,
      result.output,
      typeof content === 'string' ? content : '',
      result?.data?.text,
      result?.result,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate;
      }
    }

    return '';
  }

  function parseJsonObject(text) {
    if (typeof text !== 'string') return null;

    const trimmed = text.trim();
    const directTry = trimmed.startsWith('{') ? trimmed : '';
    const extracted = directTry || (trimmed.match(/\{[\s\S]*\}/) || [])[0] || '';
    if (!extracted) return null;

    try {
      return JSON.parse(extracted);
    } catch {
      return null;
    }
  }

  async function inferMoodProfileWithModel(text, language, fallbackProfile) {
    if (!text || text.length < 24) return fallbackProfile;
    if (
      typeof PuterInit === 'undefined' ||
      typeof PuterInit.chat !== 'function' ||
      typeof PuterInit.extractResponseText !== 'function'
    ) {
      return fallbackProfile;
    }

    try {
      if (typeof PuterInit !== 'undefined' && typeof PuterInit.ensureAuthenticated === 'function') {
        const signed = await PuterInit.ensureAuthenticated({ interactive: false, reason: 'voice-mood' });
        if (!signed) return fallbackProfile;
      }
    } catch {
      return fallbackProfile;
    }

    try {
      const locale = resolveLocale(language);
      const prompt = `Language locale: ${locale}\nText:\n${String(text).slice(0, 600)}`;

      const result = await PuterInit.chat(
        [{ role: 'user', content: prompt }],
        {
          stream: false,
          system: 'You are a TTS prosody classifier for Indian finance assistant responses. Return STRICT JSON only with keys: mood, rate, pitch. mood must be one of calm|informative|reassuring|excited|urgent. rate and pitch must be decimals. Keep style balanced and trustworthy for financial guidance.',
        }
      );

      const raw = PuterInit.extractResponseText(result.response);
      const parsed = parseJsonObject(raw);
      if (!parsed || typeof parsed !== 'object') return fallbackProfile;

      const normalizedMood = normalizeMood(parsed.mood);
      const base = MOOD_PROFILE_MAP[normalizedMood] || MOOD_PROFILE_MAP.informative;

      return {
        mood: normalizedMood,
        rate: clampNumber(parsed.rate, 0.86, 1.18, base.rate),
        pitch: clampNumber(parsed.pitch, 0.82, 1.18, base.pitch),
        source: 'ai',
      };
    } catch {
      return fallbackProfile;
    }
  }

  async function resolveSpeechProfile(text, language) {
    const cacheKey = getMoodCacheKey(text, language);
    if (cacheKey && moodProfileCache.has(cacheKey)) {
      return moodProfileCache.get(cacheKey);
    }

    const heuristic = heuristicMoodProfile(text);
    const resolved = await inferMoodProfileWithModel(text, language, heuristic);
    rememberMoodProfile(cacheKey, resolved);
    return resolved;
  }

  function pickBrowserVoice(locale) {
    if (!canUseBrowserSpeechOutput()) return null;

    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;

    const exact = voices.find((voice) => voice.lang === locale);
    if (exact) return exact;

    const baseLocale = String(locale || '').split('-')[0];
    const baseMatch = voices.find((voice) => String(voice.lang || '').toLowerCase().startsWith(baseLocale.toLowerCase()));
    if (baseMatch) return baseMatch;

    const indiaMatch = voices.find((voice) => String(voice.lang || '').toLowerCase().endsWith('-in'));
    return indiaMatch || voices[0] || null;
  }

  function buildPuterSpeechOptions(profile, language) {
    const locale = resolveLocale(language);
    return {
      language: locale,
      lang: locale,
      voice: locale,
      rate: clampNumber(profile?.rate, 0.86, 1.18, 1),
      speed: clampNumber(profile?.rate, 0.86, 1.18, 1),
      pitch: clampNumber(profile?.pitch, 0.82, 1.18, 1),
      mood: normalizeMood(profile?.mood),
      emotion: normalizeMood(profile?.mood),
      style: normalizeMood(profile?.mood),
    };
  }

  function buildSpeech2SpeechOptions(profile, language) {
    const mood = normalizeMood(profile?.mood);
    const styleByMood = {
      calm: { stability: 0.62, similarity_boost: 0.7 },
      informative: { stability: 0.58, similarity_boost: 0.72 },
      reassuring: { stability: 0.64, similarity_boost: 0.74 },
      excited: { stability: 0.48, similarity_boost: 0.76 },
      urgent: { stability: 0.54, similarity_boost: 0.71 },
    };

    const voiceSettings = styleByMood[mood] || styleByMood.informative;

    return {
      model: 'eleven_multilingual_sts_v2',
      output_format: 'mp3_44100_128',
      remove_background_noise: true,
      voice_settings: voiceSettings,
      language: resolveLocale(language),
    };
  }

  function setSpeechStyleEnabled(enabled) {
    speechStyleEnabled = Boolean(enabled);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SPEECH_STYLE_KEY, speechStyleEnabled ? 'on' : 'off');
      }
    } catch {}

    return speechStyleEnabled;
  }

  function getSpeechStyleState() {
    return {
      enabled: Boolean(speechStyleEnabled),
      key: SPEECH_STYLE_KEY,
    };
  }

  function extractTranscript(result) {
    if (typeof result === 'string') return result;

    if (!result || typeof result !== 'object') return '';

    const candidates = [
      result.text,
      result.transcript,
      result.output,
      result.result,
      result?.message?.text,
      result?.data?.text,
      result?.data?.transcript,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate;
      }
    }

    return '';
  }

  function cleanupAudioUrl() {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
  }

  function stopSpeaking() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    cleanupAudioUrl();
  }

  function extractAudioSource(result) {
    if (!result) return null;

    if (typeof result === 'string') {
      return result;
    }

    if (result instanceof Blob) {
      currentObjectUrl = URL.createObjectURL(result);
      return currentObjectUrl;
    }

    const candidates = [
      result.url,
      result.audioUrl,
      result.audio_url,
      result.src,
      result.data,
      result.audio,
      result?.data?.url,
      result?.data?.audio,
      result?.message?.audio,
      result?.output?.audio,
    ];

    for (const candidate of candidates) {
      if (!candidate) continue;

      if (typeof candidate === 'string') {
        return candidate;
      }

      if (candidate instanceof Blob) {
        currentObjectUrl = URL.createObjectURL(candidate);
        return currentObjectUrl;
      }
    }

    return null;
  }

  async function playAudioSource(source, hooks = {}) {
    stopSpeaking();

    currentAudio = new Audio(source);
    const audio = currentAudio;

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        hooks.onEnd && hooks.onEnd();
        currentAudio = null;
        cleanupAudioUrl();
        resolve();
      };

      audio.onerror = (err) => {
        hooks.onError && hooks.onError(err);
        currentAudio = null;
        cleanupAudioUrl();
        reject(err || new Error('Audio playback failed'));
      };

      hooks.onStart && hooks.onStart();

      audio.play().catch((err) => {
        hooks.onError && hooks.onError(err);
        currentAudio = null;
        cleanupAudioUrl();
        reject(err);
      });
    });
  }

  async function startVoiceInput(options = {}) {
    const {
      onStateChange,
      onError,
      onTranscript,
      onNoSpeechTimeout,
      noSpeechTimeoutMs = 3000,
      inputElement,
      sendFn,
      language,
    } = options;

    async function startBrowserFallback() {
      const RecognitionCtor = getRecognitionCtor();
      if (!RecognitionCtor) {
        const msg = 'Dobara boliye / Please try again';
        onError && onError(msg, new Error('Speech recognition not available'));
        return '';
      }

      isListening = true;
      onStateChange && onStateChange('recording');

      const recognition = new RecognitionCtor();
      recognition.lang = resolveLocale(language);
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      return new Promise((resolve) => {
        let settled = false;

        const settle = async (transcript, err) => {
          if (settled) return;
          settled = true;

          isListening = false;
          onStateChange && onStateChange('idle');

          if (err || !transcript) {
            const msg = 'Dobara boliye / Please try again';
            onError && onError(msg, err || new Error('No transcript from browser speech'));
            resolve('');
            return;
          }

          if (inputElement) {
            inputElement.value = transcript;
          }

          onTranscript && onTranscript(transcript);

          if (typeof sendFn === 'function') {
            await Promise.resolve(sendFn(transcript));
          } else if (typeof window.sendMessage === 'function') {
            window.sendMessage(transcript);
          }

          resolve(transcript);
        };

        const timeout = setTimeout(() => {
          if (isListening && onNoSpeechTimeout) {
            onNoSpeechTimeout();
          }
          try {
            recognition.stop();
          } catch {}
        }, noSpeechTimeoutMs);

        recognition.onresult = (event) => {
          clearTimeout(timeout);
          const transcript = (event.results?.[0]?.[0]?.transcript || '').trim();
          settle(transcript);
        };

        recognition.onerror = (event) => {
          clearTimeout(timeout);
          settle('', new Error(event?.error || 'speech recognition error'));
        };

        recognition.onend = () => {
          clearTimeout(timeout);
          if (!settled) settle('');
        };

        try {
          recognition.start();
          onStateChange && onStateChange('transcribing');
        } catch (err) {
          clearTimeout(timeout);
          settle('', err);
        }
      });
    }

    const usePuter = await canUsePuterSpeech();
    if (!usePuter) {
      return startBrowserFallback();
    }

    let phaseTimer = null;
    let noSpeechTimer = null;
    isListening = true;

    onStateChange && onStateChange('recording');

    phaseTimer = setTimeout(() => {
      if (isListening) {
        onStateChange && onStateChange('transcribing');
      }
    }, 450);

    noSpeechTimer = setTimeout(() => {
      if (isListening && onNoSpeechTimeout) {
        onNoSpeechTimeout();
      }
    }, noSpeechTimeoutMs);

    try {
      const result = await puter.ai.speech2txt();
      const transcript = extractTranscript(result).trim();

      isListening = false;
      clearTimeout(phaseTimer);
      clearTimeout(noSpeechTimer);

      onStateChange && onStateChange('idle');

      if (!transcript) {
        const msg = 'Dobara boliye / Please try again';
        onError && onError(msg, new Error('No speech transcript')); 
        return '';
      }

      if (inputElement) {
        inputElement.value = transcript;
      }

      onTranscript && onTranscript(transcript);

      if (typeof sendFn === 'function') {
        await Promise.resolve(sendFn(transcript));
      } else if (typeof window.sendMessage === 'function') {
        window.sendMessage(transcript);
      }

      return transcript;
    } catch (err) {
      isListening = false;
      clearTimeout(phaseTimer);
      clearTimeout(noSpeechTimer);
      onStateChange && onStateChange('idle');

      const msg = 'Dobara boliye / Please try again';
      onError && onError(msg, err);
      return '';
    }
  }

  async function speakResponse(text, language, options = {}) {
    const {
      autoPlay = true,
      onStart,
      onEnd,
      onError,
      onPathResolved,
    } = options;

    const cleanText = cleanTextForSpeech(text);
    let resolvedProfile = null;

    async function playWithBrowserSpeech(profile = MOOD_PROFILE_MAP.informative) {
      if (!cleanText) return;

      if (!canUseBrowserSpeechOutput()) {
        const err = new Error('Browser speech synthesis not available');
        onError && onError(err);
        return;
      }

      if (typeof onPathResolved === 'function') {
        onPathResolved('browser');
      }

      return new Promise((resolve) => {
        const utter = new SpeechSynthesisUtterance(cleanText);
        const locale = resolveLocale(language);
        utter.lang = locale;
        utter.rate = clampNumber(profile?.rate, 0.86, 1.18, 1);
        utter.pitch = clampNumber(profile?.pitch, 0.82, 1.18, 1);

        const voice = pickBrowserVoice(locale);
        if (voice) {
          utter.voice = voice;
        }

        utter.onstart = () => {
          onStart && onStart();
        };

        utter.onend = () => {
          onEnd && onEnd();
          resolve();
        };

        utter.onerror = (err) => {
          onError && onError(err);
          resolve();
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      });
    }

    async function play() {
      if (!cleanText) return;

      if (!resolvedProfile) {
        resolvedProfile = await resolveSpeechProfile(cleanText, language);
      }

      const usePuter = await canUsePuterSpeech();
      if (!usePuter) {
        await playWithBrowserSpeech(resolvedProfile);
        return;
      }

      try {
        let result;
        const speechOptions = buildPuterSpeechOptions(resolvedProfile, language);

        try {
          result = await puter.ai.txt2speech(cleanText, speechOptions);
        } catch {
          result = await puter.ai.txt2speech(cleanText);
        }

        const src = extractAudioSource(result);

        if (!src) {
          throw new Error('No audio source from txt2speech');
        }

        let playbackSource = src;
        let speechPath = 'txt2speech';

        if (speechStyleEnabled && typeof puter.ai.speech2speech === 'function') {
          try {
            const converted = await puter.ai.speech2speech(src, buildSpeech2SpeechOptions(resolvedProfile, language));
            const convertedSource = extractAudioSource(converted);
            if (convertedSource) {
              playbackSource = convertedSource;
              speechPath = 'speech2speech';
            }
          } catch (speech2speechErr) {
            console.warn('[VoiceEngine] speech2speech fallback to txt2speech:', speech2speechErr);
          }
        }

        if (typeof onPathResolved === 'function') {
          onPathResolved(speechPath);
        }

        await playAudioSource(playbackSource, { onStart, onEnd, onError });
      } catch (err) {
        onError && onError(err);
        await playWithBrowserSpeech(resolvedProfile);
      }
    }

    if (autoPlay) {
      await play();
    }

    return {
      cleanText,
      play,
      language,
      voiceProfile: resolvedProfile,
      speechStyleEnabled: Boolean(speechStyleEnabled),
    };
  }

  return {
    isSupported,
    getIsListening,
    startVoiceInput,
    speakResponse,
    stopSpeaking,
    cleanTextForSpeech,
    setSpeechStyleEnabled,
    getSpeechStyleState,
  };
})();

window.startVoiceInput = (options) => VoiceEngine.startVoiceInput(options || {});
window.speakResponse = (text, language, options) => VoiceEngine.speakResponse(text, language, options || {});
window.getSpeechStyleState = () => VoiceEngine.getSpeechStyleState();
window.setSpeechStyleMode = (enabled) => VoiceEngine.setSpeechStyleEnabled(enabled);
