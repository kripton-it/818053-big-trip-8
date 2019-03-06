import {getRandomInteger} from './utils.js';
import generatePoints from './generate-points.js';
import getFilter from './get-filter.js';
import getPoint from './get-point.js';

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

const POINTS_NUMBER = 4;
const tripFilterElement = document.querySelector(`.trip-filter`);
const tripDayElement = document.querySelector(`.trip-day__items`);

// отрисовка фильтров
tripFilterElement.insertAdjacentHTML(
    `beforeend`,
    filters.map((filter) => getFilter(filter)).reduce((acc, item) => acc + item, ``)
);

// отрисовка точек
const renderPoints = (points, container) => {
  container.insertAdjacentHTML(`beforeend`, points.map(getPoint).join(``));
};
renderPoints(generatePoints(POINTS_NUMBER), tripDayElement);

// обработка кликов по фильтрам
const tripFilterClickHandler = (evt) => {
  evt.preventDefault();
  tripDayElement.innerHTML = ``;
  renderPoints(generatePoints(getRandomInteger(1, 4)), tripDayElement);
};
tripFilterElement.addEventListener(`click`, tripFilterClickHandler);

