import { render, RenderPosition } from "../render.js";
import PointView from "../view/point-view.js";
import PointEditView from "../view/point-edit-view.js";
import TripOverviewView from "../view/trip-overview-view.js";

export default class BoardPresenter {
  constructor(boardContainer) {
    this.boardContainer = boardContainer;
    this.currentTrip = null;
  }

  init(trip) {
    this.currentTrip = trip;
    this._clearBoard();
    this._renderBoard();
  }

  updateTrip(trip) {
    this.currentTrip = trip;
    this._clearBoard();
    this._renderBoard();
  }

  _clearBoard() {
    this.boardContainer.innerHTML = "";
  }

  _renderBoard() {
    if (!this.currentTrip) {
      this.boardContainer.innerHTML =
        '<p style="text-align: center; margin-top: 50px;">Создайте Вашу первую поездку!</p>';
      return;
    }

    if (!this.currentTrip) return;

    const overviewComponent = new TripOverviewView(this.currentTrip);
    render(overviewComponent, this.boardContainer, RenderPosition.BEFOREEND);

    this.boardContainer.insertAdjacentHTML(
      "beforeend",
      '<h2 style="margin: 30px 0 15px;">Этапы</h2>'
    );

    const points = this.currentTrip.points;
    if (!points || points.length === 0) {
      this.boardContainer.insertAdjacentHTML(
        "beforeend",
        "<p>Пока нет поездок.</p>"
      );
      return;
    }

    points.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderPoint(point) {
    const pointComponent = new PointView(point);
    const pointEditComponent = new PointEditView(point);

    const replacePointToForm = () => {
      if (pointComponent.getElement().parentNode) {
        pointComponent
          .getElement()
          .parentNode.replaceChild(
            pointEditComponent.getElement(),
            pointComponent.getElement()
          );
      }

      setTimeout(() => {
        pointEditComponent.initMap();
        pointEditComponent.initWeather();
      }, 100);

      document.addEventListener("keydown", onEscKeyDown);
    };

    const replaceFormToPoint = () => {
      if (pointEditComponent.getElement().parentNode) {
        pointEditComponent
          .getElement()
          .parentNode.replaceChild(
            pointComponent.getElement(),
            pointEditComponent.getElement()
          );
      }
      document.removeEventListener("keydown", onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === "Escape" || evt.key === "Esc") {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener("keydown", onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replacePointToForm();
    });

    pointEditComponent.setEditClickHandler(() => {
      replaceFormToPoint();
    });

    pointEditComponent.setFormSubmitHandler((updatedPoint) => {
      const index = this.currentTrip.points.findIndex(
        (p) => p.id === updatedPoint.id
      );
      if (index !== -1) this.currentTrip.points[index] = updatedPoint;

      this._clearBoard();
      this._renderBoard();
      document.removeEventListener("keydown", onEscKeyDown);
    });

    render(pointComponent, this.boardContainer);

    pointEditComponent.setDeleteClickHandler((pointToDelete) => {
      this.currentTrip.points = this.currentTrip.points.filter(
        (p) => p.id !== pointToDelete.id
      );

      this._clearBoard();
      this._renderBoard();

      document.removeEventListener("keydown", onEscKeyDown);
    });
  }
}
