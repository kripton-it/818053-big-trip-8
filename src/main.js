import {getRandomInteger} from './utils.js';
import generatePoints from './generate-points.js';
import getFilter from './get-filter.js';
import Point from './Point.js';
import PointEdit from './PointEdit.js';

const POINTS_NUMBER = 4;
const filters = [
  {
    caption: `everything`,
    isChecked: true,
  },
  {
    caption: `future`,
  },
  {
    caption: `past`,
  },
];
const tripFilterElement = document.querySelector(`.trip-filter`);
const tripDayElement = document.querySelector(`.trip-day__items`);

// отрисовка фильтров
tripFilterElement.insertAdjacentHTML(
    `beforeend`,
    filters.map((filter) => getFilter(filter)).reduce((acc, item) => acc + item, ``)
);

// отрисовка точек
const renderPoints = (points, container) => {
  const fragment = document.createDocumentFragment();
  points.forEach((item) => {
    const point = new Point(item);
    point.onClick = () => {
      const pointEdit = new PointEdit(item);
      pointEdit.onSubmit = () => {
        point.render();
        container.replaceChild(point.element, pointEdit.element);
        pointEdit.unrender();
      };
      pointEdit.onReset = () => {
        point.render();
        container.replaceChild(point.element, pointEdit.element);
        pointEdit.unrender();
      };
      pointEdit.render();
      container.replaceChild(pointEdit.element, point.element);
      point.unrender();
    };
    point.render();
    fragment.appendChild(point.element);
  });
  container.appendChild(fragment);
};
renderPoints(generatePoints(POINTS_NUMBER), tripDayElement);

// обработка кликов по фильтрам
const tripFilterClickHandler = (evt) => {
  evt.preventDefault();
  tripDayElement.innerHTML = ``;
  renderPoints(generatePoints(getRandomInteger(1, 4)), tripDayElement);
};
tripFilterElement.addEventListener(`click`, tripFilterClickHandler);

