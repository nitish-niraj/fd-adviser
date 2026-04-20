/* ========================================
   Puter Runtime Gateway
   Single source for SDK, auth, session, model, and chat.
   ======================================== */

const PuterInit = (() => {
  const PUTER_SDK_SRC = 'https://js.puter.com/v2/';
  const SESSION_KEY = 'fd_puter_session_v2';
  const BOOT_AUTH_ATTEMPT_KEY = 'fd_boot_auth_attempt_v1';
  const PREFERRED_PROVIDER_KEY = 'fd_preferred_provider_v1';
  const PREFERRED_MODEL_KEY = 'fd_preferred_model_v1';

  function readStorageValue(key) {
    try {
      if (typeof localStorage === 'undefined') return '';
      return String(localStorage.getItem(key) || '').trim();
    } catch {
      return '';
    }
  }

  function writeStorageValue(key, value) {
    try {
      if (typeof localStorage === 'undefined') return;
      if (!value) {
        localStorage.removeItem(key);
        return;
      }
      localStorage.setItem(key, String(value));
    } catch {}
  }

  const initialPreferredProvider = readStorageValue(PREFERRED_PROVIDER_KEY);
  const initialPreferredModel = readStorageValue(PREFERRED_MODEL_KEY);

  const state = {
    sdkReady: false,
    authenticated: false,
    degraded: false,
    model: null,
    modelProvider: null,
    modelSelectionSource: 'default',
    preferredProvider: initialPreferredProvider || null,
    preferredModel: initialPreferredModel || null,
    availableProviders: [],
    bootstrapped: false,
    reason: '',
    lastCheckedAt: null,
  };

  let readyPromise = null;
  let bootstrapPromise = null;
  let modelPromise = null;
  let providersPromise = null;
  const modelPromises = new Map();
  const modelsCache = new Map();
  let providersCache = null;
  const listeners = new Set();

  function emitState() {
    const snapshot = getSessionState();
    listeners.forEach((fn) => {
      try {
        fn(snapshot);
      } catch {}
    });

    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot));
    } catch {}
  }

  function setState(partial) {
    Object.assign(state, partial);
    emitState();
  }

  function restoreSessionSnapshot() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;

      setState({
        sdkReady: Boolean(parsed.sdkReady),
        authenticated: Boolean(parsed.authenticated),
        degraded: Boolean(parsed.degraded),
        model: parsed.model || null,
        modelProvider: parsed.modelProvider || null,
        modelSelectionSource: parsed.modelSelectionSource || 'default',
        preferredProvider: parsed.preferredProvider || state.preferredProvider || null,
        preferredModel: parsed.preferredModel || state.preferredModel || null,
        availableProviders: Array.isArray(parsed.availableProviders) ? parsed.availableProviders : state.availableProviders,
        reason: parsed.reason || '',
      });
    } catch {}
  }

  function showPuterSpinner() {
    try {
      if (typeof puter !== 'undefined' && puter.ui && typeof puter.ui.showSpinner === 'function') {
        puter.ui.showSpinner();
      }
    } catch {}
  }

  function hidePuterSpinner() {
    try {
      if (typeof puter !== 'undefined' && puter.ui && typeof puter.ui.hideSpinner === 'function') {
        puter.ui.hideSpinner();
      }
    } catch {}
  }

  function notifyPuter(title, text) {
    try {
      if (typeof puter !== 'undefined' && puter.ui && typeof puter.ui.notify === 'function') {
        puter.ui.notify({ title, text, icon: 'bell.svg' });
      }
    } catch {}
  }

  function injectPuterScriptIfNeeded() {
    if (typeof document === 'undefined') return;
    if (typeof puter !== 'undefined' && puter.ai) return;

    const existing = document.querySelector('script[data-puter-sdk="true"]');
    if (existing) return;

    const script = document.createElement('script');
    script.src = PUTER_SDK_SRC;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-puter-sdk', 'true');
    document.head.appendChild(script);
  }

  function waitForPuter() {
    if (readyPromise) return readyPromise;

    readyPromise = new Promise((resolve) => {
      restoreSessionSnapshot();
      injectPuterScriptIfNeeded();

      const resolveIfReady = () => {
        if (typeof puter !== 'undefined' && puter.ai) {
          setState({ sdkReady: true, degraded: false, reason: '' });
          resolve(puter);
          return true;
        }
        return false;
      };

      if (resolveIfReady()) return;

      const startedAt = Date.now();
      const interval = setInterval(() => {
        if (resolveIfReady()) {
          clearInterval(interval);
          return;
        }

        if (Date.now() - startedAt > 15000) {
          clearInterval(interval);
          setState({
            sdkReady: false,
            degraded: true,
            reason: 'Puter SDK timed out',
          });
          resolve(null);
        }
      }, 120);
    });

    return readyPromise;
  }

  async function checkAuthSilent() {
    try {
      const p = await waitForPuter();
      if (!p || !p.auth || typeof p.auth.isSignedIn !== 'function') {
        setState({ authenticated: false, degraded: true, reason: 'Auth API unavailable' });
        return false;
      }

      const signed = Boolean(await p.auth.isSignedIn());
      setState({
        authenticated: signed,
        degraded: !signed,
        reason: signed ? '' : 'Not authenticated',
        lastCheckedAt: new Date().toISOString(),
      });
      return signed;
    } catch {
      setState({ authenticated: false, degraded: true, reason: 'Auth check failed' });
      return false;
    }
  }

  async function ensureAuthenticated(options = {}) {
    const { interactive = false, reason = 'generic' } = options;

    const p = await waitForPuter();
    if (!p) {
      setState({ authenticated: false, degraded: true, reason: 'Puter unavailable' });
      return false;
    }

    const signed = await checkAuthSilent();
    if (signed) return true;

    if (!interactive) return false;

    try {
      showPuterSpinner();

      if (p.ui && typeof p.ui.authenticateWithPuter === 'function') {
        await p.ui.authenticateWithPuter();
      } else if (p.auth && typeof p.auth.signIn === 'function') {
        await p.auth.signIn();
      } else {
        throw new Error('No interactive auth method available');
      }

      const postAuth = await checkAuthSilent();
      if (postAuth) {
        setState({ degraded: false, reason: '' });
        notifyPuter('कनेक्शन सफल', 'एआई सेवा सक्रिय है।');
      } else {
        setState({ degraded: true, reason: 'Authentication incomplete' });
      }

      return postAuth;
    } catch (err) {
      setState({
        authenticated: false,
        degraded: true,
        reason: `Authentication rejected (${reason})`,
      });
      return false;
    } finally {
      hidePuterSpinner();
    }
  }

  function normalizeModelEntry(entry) {
    if (typeof entry === 'string') {
      return {
        id: entry.trim(),
        provider: '',
      };
    }

    if (!entry || typeof entry !== 'object') {
      return {
        id: '',
        provider: '',
      };
    }

    return {
      id: String(entry.id || '').trim(),
      provider: String(entry.provider || '').trim(),
    };
  }

  function normalizeProvider(provider) {
    return String(provider || '').trim();
  }

  function normalizeProviderKey(provider) {
    return normalizeProvider(provider).toLowerCase();
  }

  function normalizeModelObject(entry, fallbackProvider = '') {
    if (typeof entry === 'string') {
      const id = entry.trim();
      if (!id) return null;
      return {
        id,
        provider: normalizeProvider(fallbackProvider),
      };
    }

    if (!entry || typeof entry !== 'object') {
      return null;
    }

    const id = String(entry.id || '').trim();
    if (!id) return null;

    return {
      ...entry,
      id,
      provider: normalizeProvider(entry.provider || fallbackProvider),
    };
  }

  function dedupeProviders(list) {
    if (!Array.isArray(list)) return [];

    const seen = new Set();
    const ordered = [];

    list.forEach((provider) => {
      const normalized = normalizeProvider(provider);
      if (!normalized) return;
      const key = normalizeProviderKey(normalized);
      if (seen.has(key)) return;
      seen.add(key);
      ordered.push(normalized);
    });

    return ordered.sort((a, b) => a.localeCompare(b));
  }

  function findModelById(models, modelId) {
    if (!Array.isArray(models) || !modelId) return null;
    const target = String(modelId).trim().toLowerCase();
    if (!target) return null;

    return models.find((entry) => String(entry?.id || '').trim().toLowerCase() === target) || null;
  }

  async function listModels(provider = null, forceRefresh = false) {
    const providerName = normalizeProvider(provider);
    const cacheKey = normalizeProviderKey(providerName) || '__all__';

    if (!forceRefresh && modelsCache.has(cacheKey)) {
      return modelsCache.get(cacheKey).map((item) => ({ ...item }));
    }

    if (!forceRefresh && modelPromises.has(cacheKey)) {
      return modelPromises.get(cacheKey);
    }

    const pending = (async () => {
      const p = await waitForPuter();
      if (!p || !p.ai || typeof p.ai.listModels !== 'function') {
        modelsCache.set(cacheKey, []);
        return [];
      }

      try {
        const response = providerName ? await p.ai.listModels(providerName) : await p.ai.listModels();
        const models = Array.isArray(response)
          ? response.map((entry) => normalizeModelObject(entry, providerName)).filter(Boolean)
          : [];

        modelsCache.set(cacheKey, models);

        if (!providerName) {
          const providers = dedupeProviders(models.map((entry) => entry.provider));
          providersCache = providers;
          setState({ availableProviders: providers });
        }

        return models.map((item) => ({ ...item }));
      } catch {
        modelsCache.set(cacheKey, []);
        return [];
      }
    })();

    modelPromises.set(cacheKey, pending);

    try {
      return await pending;
    } finally {
      modelPromises.delete(cacheKey);
    }
  }

  async function listModelProviders(forceRefresh = false) {
    if (!forceRefresh && Array.isArray(providersCache)) {
      return [...providersCache];
    }

    if (!forceRefresh && providersPromise) {
      return providersPromise;
    }

    providersPromise = (async () => {
      const p = await waitForPuter();
      if (!p || !p.ai) {
        providersCache = [];
        setState({ availableProviders: [] });
        return [];
      }

      try {
        let providers = [];
        if (typeof p.ai.listModelProviders === 'function') {
          const response = await p.ai.listModelProviders();
          if (Array.isArray(response)) {
            providers = response;
          }
        }

        if (!providers.length) {
          const models = await listModels(null, forceRefresh);
          providers = models.map((entry) => entry.provider);
        }

        const normalized = dedupeProviders(providers);
        providersCache = normalized;
        setState({ availableProviders: normalized });
        return [...normalized];
      } catch {
        providersCache = [];
        setState({ availableProviders: [] });
        return [];
      }
    })();

    try {
      return await providersPromise;
    } finally {
      providersPromise = null;
    }
  }

  function setPreferredProvider(provider) {
    const normalizedProvider = normalizeProvider(provider) || null;
    const shouldResetModel = normalizedProvider !== state.preferredProvider;

    if (shouldResetModel) {
      writeStorageValue(PREFERRED_MODEL_KEY, '');
    }

    writeStorageValue(PREFERRED_PROVIDER_KEY, normalizedProvider || '');

    setState({
      preferredProvider: normalizedProvider,
      preferredModel: shouldResetModel ? null : state.preferredModel,
    });

    return getPreferredModelSelection();
  }

  function setPreferredModel(modelId, provider = null) {
    const normalizedModel = String(modelId || '').trim() || null;
    const normalizedProvider = normalizeProvider(provider) || null;

    writeStorageValue(PREFERRED_MODEL_KEY, normalizedModel || '');
    if (normalizedProvider !== null) {
      writeStorageValue(PREFERRED_PROVIDER_KEY, normalizedProvider);
    }

    setState({
      preferredModel: normalizedModel,
      preferredProvider: normalizedProvider !== null ? normalizedProvider : state.preferredProvider,
    });

    return getPreferredModelSelection();
  }

  function getPreferredModelSelection() {
    return {
      provider: state.preferredProvider || null,
      model: state.preferredModel || null,
    };
  }

  function scoreModelId(modelId) {
    const id = String(modelId || '').toLowerCase();
    let score = 0;

    if (/(gpt|claude|gemini|llama|mistral|qwen)/.test(id)) score += 4;
    if (/(chat|instruct|assistant)/.test(id)) score += 2;
    if (/(mini|nano|flash|turbo)/.test(id)) score += 1;
    if (/(preview|experimental|beta)/.test(id)) score -= 2;

    return score;
  }

  function chooseBestModel(models) {
    if (!Array.isArray(models) || models.length === 0) return null;

    const blockedKinds = /(embedding|vision|image|whisper|speech2txt|txt2speech|audio|transcribe|moderation)/i;

    const candidates = models
      .map((entry) => normalizeModelEntry(entry))
      .filter((entry) => entry.id && !blockedKinds.test(entry.id));

    if (!candidates.length) return null;

    const ranked = candidates
      .map((entry) => ({
        ...entry,
        score: scoreModelId(entry.id),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.id.length !== b.id.length) return a.id.length - b.id.length;
        return a.id.localeCompare(b.id);
      });

    return ranked[0] || null;
  }

  async function resolveChatModel(forceRefresh = false) {
    if (!forceRefresh && state.model) {
      return {
        model: state.model,
        provider: state.modelProvider,
        source: state.modelSelectionSource || 'cached',
      };
    }

    if (!forceRefresh && modelPromise) return modelPromise;

    modelPromise = (async () => {
      const p = await waitForPuter();
      if (!p || !p.ai || typeof p.ai.listModels !== 'function') {
        setState({ model: null, modelProvider: 'default', modelSelectionSource: 'default' });
        return { model: null, provider: 'default', source: 'default' };
      }

      const preferredProvider = normalizeProvider(state.preferredProvider);
      const preferredModel = String(state.preferredModel || '').trim();
      let selected = null;
      let source = 'default';

      if (preferredModel) {
        const scopedModels = preferredProvider
          ? await listModels(preferredProvider, forceRefresh)
          : await listModels(null, forceRefresh);

        const exactMatch = findModelById(scopedModels, preferredModel);
        if (exactMatch) {
          selected = normalizeModelEntry(exactMatch);
          source = 'preferred-model';
        } else {
          const fallbackSearch = await listModels(null, forceRefresh);
          const globalMatch = findModelById(fallbackSearch, preferredModel);
          if (globalMatch) {
            selected = normalizeModelEntry(globalMatch);
            source = 'preferred-model';
          } else {
            setPreferredModel(null);
          }
        }
      }

      if (!selected && preferredProvider) {
        const providerModels = await listModels(preferredProvider, forceRefresh);
        selected = chooseBestModel(providerModels);
        if (selected?.id) {
          source = 'preferred-provider';
        }
      }

      if (!selected) {
        const models = await listModels(null, forceRefresh);
        selected = chooseBestModel(models);
        if (selected?.id) {
          source = 'auto';
        }
      }

      if (selected && selected.id) {
        setState({
          model: selected.id,
          modelProvider: selected.provider || preferredProvider || 'unknown',
          modelSelectionSource: source,
        });
        return {
          model: selected.id,
          provider: selected.provider || preferredProvider || 'unknown',
          source,
        };
      }

      setState({ model: null, modelProvider: 'default', modelSelectionSource: 'default' });
      return { model: null, provider: 'default', source: 'default' };
    })();

    try {
      return await modelPromise;
    } finally {
      modelPromise = null;
    }
  }

  function extractResponseText(response) {
    if (!response) return '';
    if (typeof response === 'string') return response;

    const content = response?.message?.content;
    if (Array.isArray(content)) {
      const part = content.find((x) => typeof x?.text === 'string' && x.text.trim());
      if (part?.text) return part.text;
    }

    const candidates = [
      response.text,
      typeof content === 'string' ? content : '',
      response.output,
      response?.data?.text,
      response?.result,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate;
      }
    }

    return '';
  }

  async function chat(messages, options = {}) {
    const p = await waitForPuter();
    if (!p || !p.ai || typeof p.ai.chat !== 'function') {
      throw new Error('Puter AI unavailable');
    }

    const hasExplicitModel = Object.prototype.hasOwnProperty.call(options, 'model');
    const userOpts = { ...options };
    let provider = normalizeProvider(userOpts.provider) || null;

    if (!hasExplicitModel) {
      const modelInfo = await resolveChatModel();
      provider = modelInfo?.provider || 'default';

      if (modelInfo && modelInfo.model) {
        userOpts.model = modelInfo.model;
      }
    }

    if (!provider) {
      if (String(userOpts.model || '') && String(state.model || '') === String(userOpts.model || '')) {
        provider = state.modelProvider || null;
      }
      if (!provider) {
        provider = state.preferredProvider || 'default';
      }
    }

    try {
      const response = await p.ai.chat(messages, userOpts);
      return {
        response,
        model: userOpts.model || null,
        provider: provider || 'default',
      };
    } catch (err) {
      if (hasExplicitModel) {
        throw err;
      }

      const retryOpts = {
        ...options,
      };
      delete retryOpts.model;

      const retryResponse = await p.ai.chat(messages, retryOpts);
      return {
        response: retryResponse,
        model: null,
        provider: 'default',
      };
    }
  }

  async function bootstrapSession(options = {}) {
    const { interactive = true } = options;

    if (bootstrapPromise) return bootstrapPromise;

    bootstrapPromise = (async () => {
      await waitForPuter();

      const alreadyAttempted = localStorage.getItem(BOOT_AUTH_ATTEMPT_KEY) === 'yes';
      const shouldPrompt = interactive && !alreadyAttempted;

      if (shouldPrompt) {
        localStorage.setItem(BOOT_AUTH_ATTEMPT_KEY, 'yes');
        await ensureAuthenticated({ interactive: true, reason: 'boot' });
      } else {
        await checkAuthSilent();
      }

      await resolveChatModel();
      listModelProviders().catch(() => {});
      setState({ bootstrapped: true });
      return getSessionState();
    })();

    return bootstrapPromise;
  }

  function getSessionState() {
    return {
      sdkReady: Boolean(state.sdkReady),
      authenticated: Boolean(state.authenticated),
      degraded: Boolean(state.degraded),
      model: state.model || null,
      modelProvider: state.modelProvider || null,
      modelSelectionSource: state.modelSelectionSource || 'default',
      preferredProvider: state.preferredProvider || null,
      preferredModel: state.preferredModel || null,
      availableProviders: Array.isArray(state.availableProviders) ? [...state.availableProviders] : [],
      bootstrapped: Boolean(state.bootstrapped),
      reason: state.reason || '',
      lastCheckedAt: state.lastCheckedAt || null,
    };
  }

  function onSessionStateChange(handler) {
    if (typeof handler !== 'function') {
      return () => {};
    }

    listeners.add(handler);

    try {
      handler(getSessionState());
    } catch {}

    return () => {
      listeners.delete(handler);
    };
  }

  async function aiChat(messages, systemPrompt) {
    const payload = Array.isArray(messages) ? messages : [{ role: 'user', content: String(messages || '') }];
    const opts = { stream: false };
    if (systemPrompt) opts.system = systemPrompt;

    const result = await chat(payload, opts);
    return extractResponseText(result.response);
  }

  return {
    waitForPuter,
    bootstrapSession,
    ensureAuthenticated,
    getSessionState,
    onSessionStateChange,
    listModelProviders,
    listModels,
    setPreferredProvider,
    setPreferredModel,
    getPreferredModelSelection,
    resolveChatModel,
    chat,
    aiChat,
    extractResponseText,
  };
})();
