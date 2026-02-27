type RateLimitData = {
  attempts: number;
  freezeUntil: number | null;
  currentFreezeDuration: number;
};

const store = new Map<string, RateLimitData>();

// Mengambil konfigurasi dari environment variables atau menggunakan default
const INITIAL_FREEZE_DURATION =
  (Number(process.env.AUTH_FREEZE_DURATION_SECONDS) || 30) * 1000;
const MAX_ATTEMPTS = Number(process.env.AUTH_MAX_ATTEMPTS) || 5;

/**
 * Mendapatkan data rate limit untuk identifier tertentu (misal: email atau IP)
 */
export function getRateLimit(identifier: string): RateLimitData {
  const data = store.get(identifier);
  if (!data) {
    return {
      attempts: 0,
      freezeUntil: null,
      currentFreezeDuration: INITIAL_FREEZE_DURATION,
    };
  }

  // Jika waktu pembekuan sudah lewat, hapus status beku tapi simpan jumlah percobaan
  if (data.freezeUntil && Date.now() > data.freezeUntil) {
    return {
      ...data,
      freezeUntil: null,
    };
  }

  return data;
}

/**
 * Mencatat kegagalan dan menghitung waktu pembekuan jika diperlukan
 */
export function recordFailure(identifier: string): RateLimitData {
  const current = getRateLimit(identifier);
  const newAttempts = current.attempts + 1;
  let newFreezeUntil = current.freezeUntil;
  let newFreezeDuration = current.currentFreezeDuration;

  // Mulai pembekuan jika mencapai batas maksimal percobaan
  if (newAttempts >= MAX_ATTEMPTS) {
    if (newAttempts === MAX_ATTEMPTS) {
      // Pembekuan pertama sesuai durasi awal
      newFreezeDuration = INITIAL_FREEZE_DURATION;
    } else {
      // Pembekuan selanjutnya: gandakan durasi sebelumnya
      newFreezeDuration = current.currentFreezeDuration * 2;
    }
    newFreezeUntil = Date.now() + newFreezeDuration;
  }

  const newData = {
    attempts: newAttempts,
    freezeUntil: newFreezeUntil,
    currentFreezeDuration: newFreezeDuration,
  };

  store.set(identifier, newData);
  return newData;
}

/**
 * Reset data rate limit setelah berhasil login/signup
 */
export function resetLimit(identifier: string) {
  store.delete(identifier);
}

/**
 * Mengecek apakah identifier sedang dibekukan
 */
export function checkIsFrozen(identifier: string): {
  frozen: boolean;
  remaining: number;
} {
  const data = getRateLimit(identifier);
  if (data.freezeUntil && Date.now() < data.freezeUntil) {
    return {
      frozen: true,
      remaining: Math.ceil((data.freezeUntil - Date.now()) / 1000),
    };
  }
  return { frozen: false, remaining: 0 };
}
