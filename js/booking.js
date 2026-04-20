/* ========================================
   Booking Storage — KV First + Local Fallback + Sync
   ======================================== */

(function () {
  const KV_BOOKING_PREFIX = 'booking_v2_';
  const KV_INDEX_KEY = 'bookings_index_v2';
  const LOCAL_QUEUE_KEY = 'fd_booking_local_queue_v1';

  function nowIso() {
    return new Date().toISOString();
  }

  function normalizeKVValue(raw) {
    if (raw == null) return null;
    if (typeof raw === 'string') return raw;

    if (typeof raw === 'object') {
      if (typeof raw.value === 'string') return raw.value;
      if (typeof raw.data === 'string') return raw.data;
      if (typeof raw.text === 'string') return raw.text;

      if (raw.value && typeof raw.value === 'object') {
        if (typeof raw.value.value === 'string') return raw.value.value;
        if (typeof raw.value.data === 'string') return raw.value.data;
      }
    }

    try {
      return JSON.stringify(raw);
    } catch {
      return String(raw);
    }
  }

  function parseJSON(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function getLocalQueue() {
    try {
      const raw = localStorage.getItem(LOCAL_QUEUE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function setLocalQueue(list) {
    try {
      localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(Array.isArray(list) ? list : []));
    } catch {}
  }

  function upsertLocalQueue(item) {
    const list = getLocalQueue();
    const idx = list.findIndex((entry) => entry && entry.bookingId === item.bookingId);

    if (idx >= 0) {
      list[idx] = { ...list[idx], ...item };
    } else {
      list.push(item);
    }

    setLocalQueue(list);
  }

  function removeFromLocalQueue(bookingId) {
    const next = getLocalQueue().filter((item) => item && item.bookingId !== bookingId);
    setLocalQueue(next);
  }

  async function getKVIndex() {
    const raw = await puter.kv.get(KV_INDEX_KEY);
    const normalized = normalizeKVValue(raw);
    const parsed = parseJSON(normalized, []);

    return Array.isArray(parsed) ? parsed : [];
  }

  async function setKVIndex(ids) {
    const unique = [...new Set((Array.isArray(ids) ? ids : []).filter(Boolean))];
    await puter.kv.set(KV_INDEX_KEY, JSON.stringify(unique));
  }

  async function saveBookingToKV(payload) {
    const kvKey = KV_BOOKING_PREFIX + payload.bookingId;
    await puter.kv.set(kvKey, JSON.stringify(payload));

    const index = await getKVIndex();
    if (!index.includes(payload.bookingId)) {
      index.push(payload.bookingId);
      await setKVIndex(index);
    }
  }

  async function canUseKV(interactive) {
    if (typeof PuterInit === 'undefined' || typeof PuterInit.ensureAuthenticated !== 'function') {
      return false;
    }

    await PuterInit.waitForPuter();
    if (typeof puter === 'undefined' || !puter.kv) {
      return false;
    }

    return PuterInit.ensureAuthenticated({ interactive: Boolean(interactive), reason: 'booking-kv' });
  }

  function normalizeBookingPayload(bookingData, overrides = {}) {
    const bookingId = overrides.bookingId || ('BK' + Date.now());
    const createdAt = overrides.createdAt || nowIso();

    return {
      bookingId,
      createdAt,
      status: 'Confirmed',
      syncState: overrides.syncState || 'pending_sync',
      storageMode: overrides.storageMode || 'local_fallback',
      syncedAt: overrides.syncedAt || null,
      languageCode: bookingData.languageCode || 'hi',
      persona: bookingData.persona || 'kisan',
      fd: bookingData.fd || {},
      bank: bookingData.bank || {},
      customer: bookingData.customer || {},
      goal: bookingData.goal || {},
      festivalAlert: bookingData.festivalAlert || null,
      ...bookingData,
    };
  }

  async function saveBooking(bookingData) {
    const base = normalizeBookingPayload(bookingData);

    try {
      const hasKV = await canUseKV(true);
      if (hasKV) {
        const synced = normalizeBookingPayload(bookingData, {
          bookingId: base.bookingId,
          createdAt: base.createdAt,
          syncState: 'synced',
          storageMode: 'puter_kv',
          syncedAt: nowIso(),
        });

        await saveBookingToKV(synced);
        removeFromLocalQueue(synced.bookingId);

        return synced.bookingId;
      }
    } catch (err) {
      console.warn('[BookingStorage] KV save failed, switching to local fallback', err);
    }

    const fallback = normalizeBookingPayload(bookingData, {
      bookingId: base.bookingId,
      createdAt: base.createdAt,
      syncState: 'pending_sync',
      storageMode: 'local_fallback',
      syncedAt: null,
    });

    upsertLocalQueue(fallback);
    return fallback.bookingId;
  }

  async function fetchKVBookings() {
    const hasKV = await canUseKV(false);
    if (!hasKV) return [];

    const ids = await getKVIndex();
    const bookings = [];

    for (const bookingId of ids) {
      const raw = await puter.kv.get(KV_BOOKING_PREFIX + bookingId);
      const normalized = normalizeKVValue(raw);
      if (!normalized) continue;

      const parsed = parseJSON(normalized, null);
      if (parsed && typeof parsed === 'object') {
        bookings.push(parsed);
      }
    }

    return bookings;
  }

  async function syncLocalBookings() {
    const pending = getLocalQueue();
    if (!pending.length) {
      return { synced: 0, remaining: 0 };
    }

    const hasKV = await canUseKV(false);
    if (!hasKV) {
      return { synced: 0, remaining: pending.length };
    }

    let syncedCount = 0;

    for (const item of pending) {
      if (!item || !item.bookingId) continue;

      try {
        const synced = {
          ...item,
          syncState: 'synced',
          storageMode: 'puter_kv',
          syncedAt: nowIso(),
        };

        await saveBookingToKV(synced);
        removeFromLocalQueue(item.bookingId);
        syncedCount += 1;
      } catch (err) {
        console.warn('[BookingStorage] Sync failed for booking:', item.bookingId, err);
      }
    }

    const remaining = getLocalQueue().length;
    return { synced: syncedCount, remaining };
  }

  function mergeBookings(kvList, localList) {
    const map = new Map();

    [...(Array.isArray(localList) ? localList : []), ...(Array.isArray(kvList) ? kvList : [])].forEach((booking) => {
      if (!booking || !booking.bookingId) return;

      const prev = map.get(booking.bookingId);
      if (!prev) {
        map.set(booking.bookingId, booking);
        return;
      }

      const prevSynced = prev.syncState === 'synced';
      const currSynced = booking.syncState === 'synced';

      if (!prevSynced && currSynced) {
        map.set(booking.bookingId, booking);
        return;
      }

      const prevTime = new Date(prev.syncedAt || prev.createdAt || 0).getTime();
      const currTime = new Date(booking.syncedAt || booking.createdAt || 0).getTime();
      if (currTime > prevTime) {
        map.set(booking.bookingId, booking);
      }
    });

    return [...map.values()].sort((a, b) => {
      const aT = new Date(a.createdAt || 0).getTime();
      const bT = new Date(b.createdAt || 0).getTime();
      return bT - aT;
    });
  }

  async function getMyBookings() {
    await syncLocalBookings();

    const kvBookings = await fetchKVBookings();
    const localBookings = getLocalQueue();

    return mergeBookings(kvBookings, localBookings);
  }

  function getBookingStorageHealth() {
    const local = getLocalQueue();
    return {
      pendingLocal: local.length,
      lastLocalBookingId: local[0]?.bookingId || null,
    };
  }

  function isBookingPendingLocal(bookingId) {
    if (!bookingId) return false;
    return getLocalQueue().some((item) => item && item.bookingId === bookingId);
  }

  window.saveBooking = saveBooking;
  window.getMyBookings = getMyBookings;
  window.syncLocalBookings = syncLocalBookings;
  window.getBookingStorageHealth = getBookingStorageHealth;
  window.isBookingPendingLocal = isBookingPendingLocal;
})();
