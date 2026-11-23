import { useEffect, useState } from "react";

// Повертає значення із затримкою: оновлюється лише після того, як value не змінювалось ms мілісекунд.
// Замінює utils/debounce.js у пошуку каталогу: поки людина друкує, запити на сервер не летять.
export function useDebouncedValue(value, ms) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebounced(value), ms);
    // Прибирання: якщо value змінилось раніше, попередній таймер скасовується.
    return () => clearTimeout(timerId);
  }, [value, ms]);

  return debounced;
}
