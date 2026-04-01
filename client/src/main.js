import BoardPresenter from './presenter/board-presenter.js';
import TripListView from './view/trip-list-view.js';
import { render } from './render.js';
import { generatePoint } from './mock/point.js';
import { authService } from './services/auth-service.js';
import { tripService } from './services/trip-service.js';

let trips = [];
let isLoading = false;
let lastError = '';

const sidebarContainer = document.querySelector('.trip-sidebar-container');
const tripEventsListContainer = document.querySelector('.trip-events__list');
const newEventBtn = document.querySelector('.trip-main__event-add-btn');

const statusNode = document.createElement('div');
statusNode.style.margin = '0 0 12px';
statusNode.style.fontWeight = '600';
tripEventsListContainer.before(statusNode);

const setLoading = (value) => {
  isLoading = value;
  statusNode.textContent = isLoading ? 'Загрузка данных...' : lastError;
  statusNode.style.color = lastError ? '#d63031' : '#2d3436';
};

const setError = (message) => {
  lastError = message;
  setLoading(false);
};

const withRequest = async (requestFn) => {
  try {
    lastError = '';
    setLoading(true);
    await requestFn();
  } catch (error) {
    setError(error.message || 'Ошибка загрузки данных');
  } finally {
    setLoading(false);
  }
};

const fetchTrips = async () => {
  trips = await tripService.listTrips();
};

const boardPresenter = new BoardPresenter(tripEventsListContainer, {
  onUpdatePoint: async (point) => {
    await withRequest(async () => {
      await tripService.updatePoint(point);
      await fetchTrips();
      refreshBoard(point.id);
    });
  },
  onDeletePoint: async (pointId) => {
    await withRequest(async () => {
      await tripService.deletePoint(pointId);
      await fetchTrips();
      refreshBoard();
    });
  },
  onAddChecklistItem: async (tripId, title) => {
    await withRequest(async () => {
      await tripService.addChecklistItem(tripId, title);
      await fetchTrips();
      handleTripChange(tripId);
    });
  },
  onDeleteChecklistItem: async (itemId) => {
    await withRequest(async () => {
      await tripService.deleteChecklistItem(itemId);
      await fetchTrips();
      refreshBoard();
    });
  },
  onToggleChecklistItem: async (itemId, isChecked) => {
    await withRequest(async () => {
      await tripService.updateChecklistItem(itemId, { isChecked });
      await fetchTrips();
      refreshBoard();
    });
  },
});

let tripListView = null;

const refreshBoard = (updatedPointId = null) => {
  const activeLink = document.querySelector('.trip-menu__link--active');
  const activeTripId = activeLink?.dataset.id || trips[0]?.id;

  if (updatedPointId) {
    const tripWithPoint = trips.find((trip) => trip.points.some((point) => point.id === updatedPointId));
    if (tripWithPoint) {
      boardPresenter.updateTrip(tripWithPoint);
      return;
    }
  }

  if (activeTripId) {
    handleTripChange(activeTripId);
  } else {
    boardPresenter.updateTrip(null);
  }
};

const renderTripList = () => {
  if (tripListView) {
    tripListView.getElement().remove();
    tripListView.removeElement();
  }

  tripListView = new TripListView(trips);
  render(tripListView, sidebarContainer);

  tripListView.setRenameHandler(async (tripId, newTitle) => {
    await withRequest(async () => {
      await tripService.renameTrip(tripId, newTitle);
      await fetchTrips();
      renderTripList();
      handleTripChange(tripId);
      activateTripLink(tripId);
    });
  });

  tripListView.setTripClickHandler(handleTripChange);

  tripListView.setAddTripHandler(async () => {
    await withRequest(async () => {
      const createdTrip = await tripService.createTrip(`Поездка #${trips.length + 1}`);
      await fetchTrips();
      renderTripList();
      handleTripChange(createdTrip.id);
      activateTripLink(createdTrip.id);
    });
  });

  tripListView.setDeleteTripHandler(async (tripId) => {
    await withRequest(async () => {
      await tripService.deleteTrip(tripId);
      await fetchTrips();
      renderTripList();
      if (trips.length > 0) {
        handleTripChange(trips[0].id);
        activateTripLink(trips[0].id);
      } else {
        boardPresenter.updateTrip(null);
      }
    });
  });
};

const activateTripLink = (tripId) => {
  const active = tripListView.getElement().querySelector(`.trip-menu__link[data-id="${tripId}"]`);
  if (active) {
    tripListView
      .getElement()
      .querySelectorAll('.trip-menu__link')
      .forEach((link) => link.classList.remove('trip-menu__link--active'));
    active.classList.add('trip-menu__link--active');
  }
};

const handleTripChange = (tripId) => {
  const selectedTrip = trips.find((trip) => trip.id === tripId);
  if (selectedTrip) {
    boardPresenter.updateTrip(selectedTrip);
  }
};

if (newEventBtn) {
  newEventBtn.addEventListener('click', async (evt) => {
    evt.preventDefault();
    const activeLink = document.querySelector('.trip-menu__link--active');
    if (!activeLink) return;

    const activeTripId = activeLink.dataset.id;

    await withRequest(async () => {
      const newPoint = generatePoint();
      newPoint.basePrice = 0;
      newPoint.customTitle = 'Новый этап';
      newPoint.destination.name = '';

      await tripService.createPoint(activeTripId, newPoint);
      await fetchTrips();
      handleTripChange(activeTripId);
    });
  });
}

const bootstrap = async () => {
  await withRequest(async () => {
    await authService.ensureSession();
    await fetchTrips();
    renderTripList();

    if (trips.length > 0) {
      const firstTrip = trips[0];
      activateTripLink(firstTrip.id);
      boardPresenter.init(firstTrip);
    } else {
      boardPresenter.init(null);
    }
  });
};

bootstrap();
