import {getRandomInteger} from './utils.js';
import getFilter from './get-filter.js';
import getPoints from './get-point.js';

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
const renderPoints = (where, number) => {
  where.insertAdjacentHTML(`beforeend`, getPoints(number).join(``));
};
renderPoints(tripDayElement, POINTS_NUMBER);

// обработка кликов по фильтрам
const tripFilterClickHandler = (evt) => {
  evt.preventDefault();
  tripDayElement.innerHTML = ``;
  renderPoints(tripDayElement, getRandomInteger(1, 4));
};
tripFilterElement.addEventListener(`click`, tripFilterClickHandler);

