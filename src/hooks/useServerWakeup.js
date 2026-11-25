import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.js";

const SLOW_AFTER_MS = 3000;      // відповів швидше — банер не показуємо, щоб він не блимав
const RETRY_EVERY_MS = 5000;     // пауза між повторними спробами
const REQUEST_TIMEOUT_MS = 20000; // один «завислий» запит не чекаємо вічно
const GIVE_UP_AFTER_MS = 150000; // ~2,5 хв: далі чекати немає сенсу, просимо оновити сторінку

// useServerWakeup — «розігрів» бекенду на безкоштовному хостингу, який засинає без запитів.
// Щойно сайт відкрився, хук стукає в /actuator/health: поки людина дивиться на сторінку, сервер прокидається.
// Статуси: checking → (за 3 с без відповіді) waking → woke | ready; або down, якщо сервер так і не відповів.
// woke відрізняється від ready тим, що сервер спав: Layout тоді один раз перезавантажує дані сторінки.
export function useServerWakeup() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    let retryTimer;
    const startedAt = Date.now();
    const slowTimer = setTimeout(() => {
      setStatus(current => (current === "checking" ? "waking" : current));
    }, SLOW_AFTER_MS);

    async function ping() {
      try {
        const res = await fetch(API_BASE_URL + "/actuator/health", {
          cache: "no-store",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        });
        if (res.ok) {
          clearTimeout(slowTimer);
          if (!cancelled) setStatus(current => (current === "waking" ? "woke" : "ready"));
          return;
        }
      } catch {
        // мережа, таймаут або 502 від хостингу, поки контейнер стартує, — просто пробуємо ще раз
      }
      if (cancelled) return;
      if (Date.now() - startedAt >= GIVE_UP_AFTER_MS) {
        clearTimeout(slowTimer);
        setStatus("down");
        return;
      }
      retryTimer = setTimeout(ping, RETRY_EVERY_MS);
    }

    ping();
    // Прибирання: React StrictMode і перехід зі сторінки не залишать «осиротілих» таймерів
    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
      clearTimeout(retryTimer);
    };
  }, []);

  return status;
}
