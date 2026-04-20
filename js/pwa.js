/* ========================================
   PWA Helper
   Service worker registration + install prompt lifecycle
   ======================================== */

window.PWAHelper = (() => {
  let deferredInstallPrompt = null;
  const supportsInstallPrompt = typeof window !== 'undefined' && ('onbeforeinstallprompt' in window || 'BeforeInstallPromptEvent' in window);

  function canInstall() {
    return Boolean(deferredInstallPrompt);
  }

  async function promptInstall() {
    if (!deferredInstallPrompt) return false;

    try {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      const accepted = choice && choice.outcome === 'accepted';
      deferredInstallPrompt = null;
      return Boolean(accepted);
    } catch (err) {
      deferredInstallPrompt = null;
      return false;
    }
  }

  function notifyAvailable() {
    window.dispatchEvent(new CustomEvent('fd-install-available'));
  }

  function notifyInstalled() {
    window.dispatchEvent(new CustomEvent('fd-installed'));
  }

  if (supportsInstallPrompt) {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      notifyAvailable();
    });

    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      notifyInstalled();
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch((err) => {
        console.warn('[PWA] service worker registration failed', err);
      });
    });
  }

  return {
    canInstall,
    promptInstall,
  };
})();
