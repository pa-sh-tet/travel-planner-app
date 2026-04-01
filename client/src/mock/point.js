import { getRandomInteger, getRandomArrayElement } from "../utils.js";
import { DESTINATIONS, DESCRIPTIONS } from "./const.js";

const generateDestination = () => ({
  description: getRandomArrayElement(DESCRIPTIONS),
  name: getRandomArrayElement(DESTINATIONS),
});

export const generatePoint = () => {
  return {
    id: crypto.randomUUID(),
    customTitle: getRandomArrayElement([
      "Прогулка",
      "Музей",
      "Концерт",
      "Экскурсия",
      "Прогулка по парку",
    ]),
    basePrice: getRandomInteger(50, 500),
    dateFrom: new Date(),
    dateTo: new Date(new Date().getTime() + 60 * 60 * 1000),
    destination: generateDestination(),
  };
};
