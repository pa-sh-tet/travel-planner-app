import { createElement } from "../render.js";
import { DESTINATIONS } from "../mock/const.js";

const humanizeDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yy} ${hh}:${min}`;
};

const createPointEditTemplate = (state) => {
  const {
    basePrice = 0,
    destination = { name: "", description: "" },
    customTitle = "",
    dateFrom,
    dateTo,
  } = state;

  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header" style="display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap;">
          
          <div class="event__field-group" style="flex-grow: 2; min-width: 180px;">
            <label class="event__label" style="display: block; font-size: 12px; color: #888;">Название</label>
            <input class="event__input" id="event-title-1" type="text" name="event-title" value="${customTitle}" style="width: 100%;">
          </div>

          <div class="event__field-group" style="flex-grow: 1; min-width: 150px;">
            <label class="event__label" style="display: block; font-size: 12px; color: #888;">Локация</label>
            <input class="event__input" id="event-destination-1" type="text" name="event-destination" value="${
              destination.name
            }" list="destination-list-1" style="width: 100%;">
            <datalist id="destination-list-1">
              ${DESTINATIONS.map(
                (city) => `<option value="${city}"></option>`
              ).join("")}
            </datalist>
          </div>

          <div class="event__field-group" style="flex-grow: 1;">
             <label class="event__label" style="display: block; font-size: 12px; color: #888;">Время</label>
             <div style="display: flex; align-items: center; gap: 5px;">
                <input class="event__input" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(
                  dateFrom
                )}" style="width: 100px;">
                &mdash;
                <input class="event__input" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(
                  dateTo
                )}" style="width: 100px;">
             </div>
          </div>

          <div class="event__field-group">
            <label class="event__label" style="display: block; font-size: 12px; color: #888;">Стоимость (₽)</label>
            <input class="event__input" id="event-price-1" type="number" name="event-price" value="${basePrice}" style="width: 70px;">
          </div>
          
           <button class="event__rollup-btn" type="button" style="margin-bottom: 5px;">
             <span class="visually-hidden"></span>
           </button>
        </header>
        
        <section class="event__details">
           <div class="event__section event__section--destination">
             <h3 class="event__section-title">Описание</h3>
             <p class="event__destination-description">${
               destination.description
             }</p>
             <div class="event__location-details" style="display: flex; gap: 20px; margin-top: 20px;">
                <div class="weather-widget" id="weather-${
                  state.id
                }" style="flex: 1; background: #e0f7fa; padding: 10px; border-radius: 12px; text-align: center;">Загрузка...</div>
                <div id="map-${
                  state.id
                }" class="map-container" style="flex: 2; height: 150px; border-radius: 12px; background: #eee;"></div>
             </div>
          </div>

          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; display: flex; justify-content: space-between;">
             <button class="event__reset-btn btn" type="button" style="color: #ff7675; background: none; border: none;">Удалить</button>
             <button class="event__save-btn btn btn--blue" type="submit">Сохранить</button>
          </div>
        </section>
      </form>
    </li>`;
};

export default class PointEditView {
  constructor(point) {
    this._state = PointEditView.parsePointToState(point);
    this.element = null;
    this._callback = {};
    this._datepickerFrom = null;
    this._datepickerTo = null;
  }

  static parsePointToState(point) {
    return { ...point };
  }
  static parseStateToPoint(state) {
    return { ...state };
  }

  getTemplate() {
    return createPointEditTemplate(this._state);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this._setInnerHandlers();
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
    if (this._datepickerFrom) this._datepickerFrom.destroy();
    if (this._datepickerTo) this._datepickerTo.destroy();
  }

  _setInnerHandlers() {
    this.element
      .querySelector("#event-title-1")
      .addEventListener("input", (evt) => {
        evt.preventDefault();
        this._state.customTitle = evt.target.value;
      });
    this.element
      .querySelector("#event-price-1")
      .addEventListener("input", (evt) => {
        evt.preventDefault();
        this._state.basePrice = Number(evt.target.value);
      });
    this.element
      .querySelector("#event-destination-1")
      .addEventListener("change", (evt) => {
        evt.preventDefault();
        this._state.destination.name = evt.target.value;
      });
    this._setDatepicker();
  }

  _setDatepicker() {
    if (typeof flatpickr === "undefined") return;

    const config = { enableTime: true, dateFormat: "d/m/y H:i" };

    this._datepickerFrom = flatpickr(
      this.element.querySelector("#event-start-time-1"),
      {
        ...config,
        defaultDate: this._state.dateFrom,
        onChange: ([userDate]) => {
          this._state.dateFrom = userDate;
        },
      }
    );

    this._datepickerTo = flatpickr(
      this.element.querySelector("#event-end-time-1"),
      {
        ...config,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: ([userDate]) => {
          this._state.dateTo = userDate;
        },
      }
    );
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;

    const form = this.getElement().querySelector("form");

    form.addEventListener("submit", (evt) => {
      evt.preventDefault();

      this._callback.formSubmit(PointEditView.parseStateToPoint(this._state));
    });
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement()
      .querySelector(".event__rollup-btn")
      .addEventListener("click", (evt) => {
        evt.preventDefault();
        this._callback.editClick();
      });
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement()
      .querySelector(".event__reset-btn")
      .addEventListener("click", (evt) => {
        evt.preventDefault();
        this._callback.deleteClick(
          PointEditView.parseStateToPoint(this._state)
        );
      });
  }

  initMap() {
    const mapContainerId = `map-${this._state.id}`;
    const mapElement = this.element.querySelector(`#${mapContainerId}`);

    if (!mapElement) return;

    const coordinates = {
      Париж: [48.8566, 2.3522],
      Москва: [55.7558, 37.6173],
      Токио: [35.6762, 139.6503],
      Лондон: [51.5074, -0.1278],
      "Нью-Йорк": [40.7128, -74.006],
      Киото: [35.0116, 135.7681],
      Рим: [41.9028, 12.4964],
      "Санкт-Петербург": [59.9343, 30.3351],
    };

    const cityCoords = coordinates[this._state.destination.name] || [
      48.8566, 2.3522,
    ];

    if (typeof L !== "undefined") {
      const map = L.map(mapElement, {
        attributionControl: false,
      }).setView(cityCoords, 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.marker(cityCoords)
        .addTo(map)
        .bindPopup(this._state.destination.name)
        .openPopup();
    }
  }

  initWeather() {
    const weatherContainer = this.element.querySelector(
      `#weather-${this._state.id}`
    );
    if (!weatherContainer) return;

    setTimeout(() => {
      const temp = Math.floor(Math.random() * 30) - 5;
      const icons = ["☀️", "☁️", "🌧️", "❄️"];
      const icon = icons[Math.floor(Math.random() * icons.length)];

      weatherContainer.innerHTML = `
            <div style="font-size: 40px; margin: 10px 0;">${icon}</div>
            <div style="font-size: 20px; font-weight: bold;">${
              temp > 0 ? "+" + temp : temp
            }°C</div>
          `;
    }, 1000);
  }
}
