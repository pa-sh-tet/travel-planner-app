import { createElement } from "../render.js";

const humanizeDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return {
    date: `${dd}/${mm}/${yy}`,
    time: `${hh}:${min}`,
  };
};

const createPointTemplate = (point) => {
  const { basePrice, dateFrom, dateTo, destination, customTitle } = point;

  const start = humanizeDate(dateFrom);
  const end = humanizeDate(dateTo);

  return `<li class="trip-events__item">
      <div class="event">
        <!-- Дата -->
        <time class="event__date" datetime="${dateFrom}">${start.date}</time>
        
        <!-- Центральная часть: Название и Локация (Без иконки) -->
        <div class="event__title-wrapper" style="flex-grow: 1; padding-left: 0;">
            <h3 class="event__title" style="margin: 0; font-size: 18px; font-weight: 700;">${customTitle}</h3>
            <p class="event__destination" style="margin: 4px 0 0 0; color: #888; font-size: 14px;">
               📍 ${destination.name}
            </p>
        </div>

        <!-- Время -->
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time">${start.time}</time>
            &mdash;
            <time class="event__end-time">${end.time}</time>
          </p>
        </div>

        <!-- Цена -->
        <p class="event__price">
          ₽&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>

        <!-- Кнопка развернуть -->
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden"></span>
        </button>
      </div>
    </li>`;
};

export default class PointView {
  constructor(point) {
    this.point = point;
    this.element = null;
    this._callback = {};
  }

  getTemplate() {
    return createPointTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement()
      .querySelector(".event__rollup-btn")
      .addEventListener("click", this._editClickHandler);
  }

  _editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };
}
