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
 * функция для замены одного объекта с данными в массиве объектов на другой
 * @param {Array} points - массив с данными
 * @param {Object} pointToUpdate - объект, который надо заменить
 * @param {Object} newPoint - новый объект
 * @return {Object} новый объект
 */
const updatePoint = (points, pointToUpdate, newPoint) => {
  const index = points.findIndex((point) => point === pointToUpdate);
  points[index] = Object.assign({}, pointToUpdate, newPoint);
  return points[index];
};

/**
 * функция для удаления одного объекта с данными в массиве объектов
 * @param {Array} points - массив с данными
 * @param {Object} pointToDelete - объект, который надо удалить
 * @return {Array} массив с удалённым объектом
 */
const deletePoint = (points, pointToDelete) => {
  const index = points.findIndex((point) => point === pointToDelete);
  points.splice(index, 1);
  return points;
};

/**
 * функция для отрисовки массива точек маршрута
 * @param {Array} points - массив с данными
 * @param {Object} container - DOM-элемент, в который нужно отрисовать точки маршрута
 */
const renderPoints = (points, container) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();
  points.forEach((point, index) => {
    const pointComponent = new Point(point);
    /**
     * колбэк для перехода в режим редактирования
     */
    pointComponent.onClick = () => {
      const pointEditComponent = new PointEdit(point, index);
      /**
       * колбэк для нажатия на кнопку Delete
       */
      const onDelete = () => {
        deletePoint(points, point);
        container.removeChild(pointEditComponent.element);
        pointEditComponent.unrender();
      };

      /**
       * колбэк для выхода из режима редактирования
       * @param {Object} newPoint - объект, из которого обновляется информация
       */
      const onSubmit = (newPoint) => {
        const updatedPoint = updatePoint(points, point, newPoint);

        pointComponent.update(updatedPoint);
        pointComponent.render();
        container.replaceChild(pointComponent.element, pointEditComponent.element);
        pointEditComponent.unrender();
      };
      pointEditComponent.onSubmit = onSubmit;
      pointEditComponent.onDelete = onDelete;
      pointEditComponent.render();
      container.replaceChild(pointEditComponent.element, pointComponent.element);
      pointComponent.unrender();
    };
    pointComponent.render();
    fragment.appendChild(pointComponent.element);
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

