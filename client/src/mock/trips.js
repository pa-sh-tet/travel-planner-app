import { generatePoint } from "./point.js";
import { getRandomInteger } from "../utils.js";

const generateTrip = (title) => {
  return {
    id: crypto.randomUUID(),
    title: title,
    photos: [
      `https://loremflickr.com/300/200/travel?random=${crypto.randomUUID()}`,
      `https://loremflickr.com/300/200/nature?random=${crypto.randomUUID()}`,
    ],
    totalPrice: 0,
    checklist: [
      { id: 1, title: "Билеты", isChecked: true },
      { id: 2, title: "Паспорт", isChecked: true },
    ],
    points: Array.from({ length: getRandomInteger(2, 4) }, generatePoint),
  };
};

export const generateTrips = () => [
  generateTrip("Евротур 2025"),
  generateTrip("Токио"),
  generateTrip("Москва"),
];
