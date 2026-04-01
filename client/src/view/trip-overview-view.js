import { createElement } from '../render.js';

const createTripOverviewTemplate = (trip) => {
  const totalPrice = trip.points.reduce((sum, point) => sum + point.basePrice, 0);

  const checklistTemplate = trip.checklist
    .map(
      (item) => `
    <li class="trip-checklist__item" data-id="${item.id}" style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <input 
            type="checkbox" 
            class="checklist-checkbox" 
            ${item.isChecked ? 'checked' : ''}
            style="cursor: pointer; width: 18px; height: 18px;"
        >
        <span 
            class="checklist-text" 
            style="flex: 1; text-decoration: ${item.isChecked ? 'line-through' : 'none'}; color: ${
              item.isChecked ? '#aaa' : 'inherit'
            };"
        >${item.title}</span>
        <button class="checklist-delete-btn" style="border: none; background: none; color: #ff7675; cursor: pointer; font-weight: bold;">✕</button>
    </li>
  `
    )
    .join('');

  const photosTemplate = trip.photos
    .map((src) => `<img src="${src}" class="trip-gallery__img" ...>`)
    .join('');

  return `
    <section class="trip-overview">
      <div class="trip-gallery">
        <h3 class="trip-overview__title">Фотогалерея поездки</h3>
        <div class="trip-gallery__container">
           ${photosTemplate}
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
    this._callback = {};
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
    const addBtn = this.element.querySelector('.checklist-add-btn');
    const input = this.element.querySelector('.trip-checklist__input');
    const list = this.element.querySelector('.trip-checklist__list');

    addBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      const title = input.value.trim();
      if (!title || !this._callback.addItem) return;
      this._callback.addItem(title);
      input.value = '';
    });

    list.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('checklist-delete-btn')) {
        const itemId = evt.target.closest('li')?.dataset.id;
        if (itemId && this._callback.deleteItem) {
          this._callback.deleteItem(itemId);
        }
      }
    });

    list.addEventListener('change', (evt) => {
      if (evt.target.classList.contains('checklist-checkbox')) {
        const itemId = evt.target.closest('li')?.dataset.id;
        if (itemId && this._callback.toggleItem) {
          this._callback.toggleItem(itemId, evt.target.checked);
        }
      }
    });
  }

  setAddChecklistHandler(callback) {
    this._callback.addItem = callback;
  }

  setDeleteChecklistHandler(callback) {
    this._callback.deleteItem = callback;
  }

  setToggleChecklistHandler(callback) {
    this._callback.toggleItem = callback;
  }
}
