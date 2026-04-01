import BoardPresenter from "./presenter/board-presenter.js";
import TripListView from "./view/trip-list-view.js";
import { render } from "./render.js";
import { generateTrips } from "./mock/trips.js";
import { generatePoint } from "./mock/point.js";

let trips = generateTrips();

const sidebarContainer = document.querySelector(".trip-sidebar-container");
const tripEventsListContainer = document.querySelector(".trip-events__list");
const newEventBtn = document.querySelector(".trip-main__event-add-btn");

const boardPresenter = new BoardPresenter(tripEventsListContainer);
let tripListView = null;

const renderTripList = () => {
  if (tripListView) {
    tripListView.getElement().remove();
    tripListView.removeElement();
  }

  tripListView = new TripListView(trips);
  render(tripListView, sidebarContainer);
  tripListView.setRenameHandler((tripId, newTitle) => {
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      trip.title = newTitle;
      renderTripList();
    }
  });
  tripListView.setTripClickHandler(handleTripChange);

  tripListView.setAddTripHandler(() => {
    const newTrip = {
      id: crypto.randomUUID(),
      title: `Поездка #${trips.length + 1}`,
      photos: [],
      totalPrice: 0,
      checklist: [],
      points: [],
    };
    trips.push(newTrip);
    renderTripList();

    handleTripChange(newTrip.id);
    const links = tripListView
      .getElement()
      .querySelectorAll(".trip-menu__link");
    links[links.length - 1].classList.add("trip-menu__link--active");
  });

  tripListView.setDeleteTripHandler((tripId) => {
    trips = trips.filter((t) => t.id !== tripId);
    renderTripList();

    if (trips.length > 0) {
      handleTripChange(trips[0].id);
      tripListView
        .getElement()
        .querySelector(".trip-menu__link")
        .classList.add("trip-menu__link--active");
    } else {
      boardPresenter.updateTrip(null);
    }
  });
};

const handleTripChange = (tripId) => {
  const selectedTrip = trips.find((t) => t.id === tripId);
  if (selectedTrip) {
    boardPresenter.updateTrip(selectedTrip);
  }
};

if (newEventBtn) {
  newEventBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    const activeLink = document.querySelector(".trip-menu__link--active");
    if (!activeLink) return;

    const activeTripId = activeLink.dataset.id;
    const currentTrip = trips.find((t) => t.id === activeTripId);

    if (currentTrip) {
      const newPoint = generatePoint();
      newPoint.basePrice = 0;
      newPoint.customTitle = "Новый этап";
      newPoint.destination.name = "";

      currentTrip.points.unshift(newPoint);
      boardPresenter.updateTrip(currentTrip);
    }
  });
}

renderTripList();

if (trips.length > 0) {
  const firstTrip = trips[0];
  const firstLink = tripListView.getElement().querySelector(".trip-menu__link");
  if (firstLink) firstLink.classList.add("trip-menu__link--active");
  boardPresenter.init(firstTrip);
}
