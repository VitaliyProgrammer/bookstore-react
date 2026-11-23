// Перетворює дату замовлення "2026-10-29 09:15" (формат @JsonFormat в OrderResponseDto)
// у звичний для людини вигляд "29.10.2026 09:15". Без змін з JS-лабораторної.
export function formatOrderDate(value) {
  const [date, time] = value.split(" ");
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year} ${time}`;
}
