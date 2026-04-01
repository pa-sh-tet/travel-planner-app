import { createElement } from "../render.js";

const createTripListTemplate = (trips) => {
  const tripItems = trips
    .map(
      (trip) => `
    <li class="trip-menu__item" style="position: relative;">
      <a href="#" class="trip-menu__link" data-id="${trip.id}" style="padding-right: 40px;">
        <span class="trip-menu__title">${trip.title}</span>
        <span class="trip-menu__count">${trip.points.length}</span>
      </a>
      <button class="trip-delete-btn" data-id="${trip.id}" style="
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: none;
          color: #ff7675;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          opacity: 0.6;
          transition: opacity 0.2s;
          z-index: 2;
      " title="Delete trip">✕</button>
    </li>
  `
    )
    .join("");

  return `
    <div class="trip-sidebar">
      <h2 class="trip-sidebar__title">Мои поездки</h2>
      <ul class="trip-menu">
        ${tripItems}
      </ul>
      <button class="btn btn--blue trip-add-btn" style="width: 100%; margin-top: 20px;">+ Добавить поездку</button>
    </div>
  `;
};

export default class TripListView {
  constructor(trips) {
    this.trips = trips;
    this.element = null;
    this._callback = {};
  }

  getTemplate() {
    return createTripListTemplate(this.trips);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  setTripClickHandler(callback) {
    this._callback.tripClick = callback;

    this.element
      .querySelector(".trip-menu")
      .addEventListener("click", (evt) => {
        const link = evt.target.closest(".trip-menu__link");
        const deleteBtn = evt.target.closest(".trip-delete-btn");

        if (link && !deleteBtn) {
          evt.preventDefault();
          this.element
            .querySelectorAll(".trip-menu__link")
            .forEach((l) => l.classList.remove("trip-menu__link--active"));
          link.classList.add("trip-menu__link--active");

          const tripId = link.dataset.id;
          this._callback.tripClick(tripId);
        }
      });
  }

  setAddTripHandler(callback) {
    this._callback.addTrip = callback;
    this.element
      .querySelector(".trip-add-btn")
      .addEventListener("click", (evt) => {
        evt.preventDefault();
        this._callback.addTrip();
      });
  }

  setDeleteTripHandler(callback) {
    this._callback.deleteTrip = callback;
    this.element
      .querySelector(".trip-menu")
      .addEventListener("click", (evt) => {
        const deleteBtn = evt.target.closest(".trip-delete-btn");
        if (deleteBtn) {
          evt.preventDefault();
          evt.stopPropagation();
          const tripId = deleteBtn.dataset.id;

          this._callback.deleteTrip(tripId);
        }
      });
  }

  setRenameHandler(callback) {
    this._callback.renameTrip = callback;
    this.element.querySelectorAll(".trip-menu__title").forEach((title) => {
      title.addEventListener("dblclick", (evt) => {
        evt.preventDefault();
        evt.stopPropagation();

        const currentTitle = evt.target.textContent;
        const newTitle = prompt(
          "Введите новое название поездки:",
          currentTitle
        );

        if (newTitle && newTitle.trim() !== "") {
          const tripId = evt.target.closest(".trip-menu__link").dataset.id;
          this._callback.renameTrip(tripId, newTitle);
        }
      });
    });
  }

  removeElement() {
    this.element = null;
  }
}
