import {getRandomInteger} from './utils.js';
import getFilter from './get-filter.js';
import getPoint from './get-point.js';
import {generatePoint} from './data.js';

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

const pointsNumber = 4;
const tripFilterElement = document.querySelector(`.trip-filter`);
const tripDayElement = document.querySelector(`.trip-day__items`);

// отрисовка фильтров
tripFilterElement.insertAdjacentHTML(
    `beforeend`,
    filters.map((filter) => getFilter(filter)).reduce((acc, item) => acc + item, ``)
);

// отрисовка точек
const fillDay = (number) => {
  tripDayElement.insertAdjacentHTML(`beforeend`, getPoint().repeat(number));
};
fillDay(pointsNumber);

// обработка кликов по фильтрам
const tripFilterClickHandler = (evt) => {
  evt.preventDefault();
  tripDayElement.innerHTML = ``;
  fillDay(getRandomInteger(1, 4));
};
tripFilterElement.addEventListener(`click`, tripFilterClickHandler);

const point = generatePoint();
console.log(point);
