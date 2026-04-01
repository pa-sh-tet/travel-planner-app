import { createElement } from "../render.js";

const createTripOverviewTemplate = (trip) => {
  const totalPrice = trip.points.reduce(
    (sum, point) => sum + point.basePrice,
    0
  );

  const checklistTemplate = trip.checklist
    .map(
      (item) => `
    <li class="trip-checklist__item" data-id="${
      item.id
    }" style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <input 
            type="checkbox" 
            class="checklist-checkbox" 
            ${item.isChecked ? "checked" : ""}
            style="cursor: pointer; width: 18px; height: 18px;"
        >
        <span 
            class="checklist-text" 
            style="flex: 1; text-decoration: ${
              item.isChecked ? "line-through" : "none"
            }; color: ${item.isChecked ? "#aaa" : "inherit"};"
        >${item.title}</span>
        <button class="checklist-delete-btn" style="border: none; background: none; color: #ff7675; cursor: pointer; font-weight: bold;">✕</button>
    </li>
  `
    )
    .join("");

  const photosTemplate = trip.photos
    .map((src) => `<img src="${src}" class="trip-gallery__img" ...>`)
    .join("");

  return `
    <section class="trip-overview">
      
      <div class="trip-gallery">
        <h3 class="trip-overview__title">Фотогалерея поездки</h3>
        <div class="trip-gallery__container">
           ${photosTemplate}
           <button class="btn-add-photo" title="Add Random Photo">+</button>
        </div>
      </div>

      <div class="trip-budget">
        <h3 class="trip-overview__title">Общий бюджет поездки</h3>
        <div class="trip-budget__value">${totalPrice} ₽</div>
        <p class="trip-budget__note">Основано на ${trip.points.length} этапах</p>
      </div>

      <div class="trip-checklist">
        <h3 class="trip-overview__title">Список вещей</h3>
        <ul class="trip-checklist__list">
           ${checklistTemplate}
        </ul>
        <div style="display: flex; gap: 10px;">
            <input type="text" placeholder="Добавить вещь..." class="trip-checklist__input" style="flex: 1;">
            <button class="btn btn--blue checklist-add-btn">Добавить</button>
        </div>
      </div>

    </section>
  `;
};

export default class TripOverviewView {
  constructor(trip) {
    this.trip = trip;
    this.element = null;
  }

  getTemplate() {
    return createTripOverviewTemplate(this.trip);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this._setInnerHandlers();
    }
    return this.element;
  }

  _setInnerHandlers() {
    const addBtn = this.element.querySelector(".checklist-add-btn");
    const input = this.element.querySelector(".trip-checklist__input");
    const list = this.element.querySelector(".trip-checklist__list");

    addBtn.addEventListener("click", (evt) => {
      evt.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const newItem = document.createElement("li");
      newItem.className = "trip-checklist__item";
      newItem.style.cssText =
        "display: flex; align-items: center; gap: 10px; margin-bottom: 8px;";
      newItem.innerHTML = `
            <input type="checkbox" class="checklist-checkbox" style="cursor: pointer; width: 18px; height: 18px;">
            <span class="checklist-text" style="flex: 1;">${text}</span>
            <button class="checklist-delete-btn" style="border: none; background: none; color: #ff7675; cursor: pointer; font-weight: bold;">✕</button>
          `;

      list.appendChild(newItem);
      input.value = "";
    });

    list.addEventListener("click", (evt) => {
      if (evt.target.classList.contains("checklist-delete-btn")) {
        evt.target.closest("li").remove();
      }

      if (evt.target.classList.contains("checklist-checkbox")) {
        const span = evt.target.nextElementSibling;
        if (evt.target.checked) {
          span.style.textDecoration = "line-through";
          span.style.color = "#aaa";
        } else {
          span.style.textDecoration = "none";
          span.style.color = "inherit";
        }
      }
    });

    this.element
      .querySelector(".btn-add-photo")
      .addEventListener("click", () => {
        const container = this.element.querySelector(
          ".trip-gallery__container"
        );
        const btn = this.element.querySelector(".btn-add-photo");

        const newImg = document.createElement("img");
        newImg.src = `https://loremflickr.com/300/200/travel,landmark?random=${Math.random()}`;
        newImg.className = "trip-gallery__img";
        newImg.alt = "New Photo";

        container.insertBefore(newImg, btn);
      });
  }
}
