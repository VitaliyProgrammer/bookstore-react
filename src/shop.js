// Дані магазину в одному місці: їх показують сторінка «Контакти», банер на головній і форма оформлення.
// Змінив тут — змінилось на всьому сайті.
export const SHOP = {
  city: "Київ",
  address: "вул. Ярославів Вал, 21",
  hours: [
    ["Пн–Пт", "10:00–20:00"],
    ["Сб–Нд", "11:00–18:00"]
  ],
  phone: "+380 44 555 12 34",
  email: "tvoya-knyharnia@ukr.net",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Київ, вул. Ярославів Вал, 21")
};
