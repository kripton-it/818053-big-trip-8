import {getRandomInteger} from './utils.js';
import generatePoints from './generate-points.js';
import getFilter from './get-filter.js';
import Point from './point.js';
import PointEdit from './point-edit.js';

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

/**
 * отрисовка фильтров
 */
tripFilterElement.insertAdjacentHTML(
    `beforeend`,
    filters.map((filter) => getFilter(filter)).reduce((acc, item) => acc + item, ``)
);

/**
 * функция для отрисовки массива точек маршрута
 * @param {Array} points - массив с данными
 * @param {Object} container - DOM-элемент, в который нужно отрисовать точки маршрута
 */
const renderPoints = (points, container) => {
  const fragment = document.createDocumentFragment();
  points.forEach((item, index) => {
    const point = new Point(item);
    /**
     * колбэк для перехода в режим редактирования
     */
    point.onClick = () => {
      const pointEdit = new PointEdit(item, index);
      /**
       * колбэк для выхода из режима редактирования
       * @param {Object} newObject - объект, из которого обновляется информация
       */
      pointEdit.onSubmit = (newObject) => {
        item.name = newObject.name;
        item.type = newObject.type;
        item.date = newObject.date;
        item.price = newObject.price;
        item.offers = newObject.offers;

        point.update(item);
        point.render();
        container.replaceChild(point.element, pointEdit.element);
        pointEdit.unrender();
      };
      /**
       * колбэк для нажатия на кнопку Delete (reset формы)
       */
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

/**
 * обработчик кликов по фильтрам
 * @param {Object} evt - объект события Event
 */
const tripFilterClickHandler = (evt) => {
  evt.preventDefault();
  tripDayElement.innerHTML = ``;
  renderPoints(generatePoints(getRandomInteger(1, 4)), tripDayElement);
};
tripFilterElement.addEventListener(`click`, tripFilterClickHandler);

