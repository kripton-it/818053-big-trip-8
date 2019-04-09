import {types} from './utils.js';
import generatePoints from './generate-points.js';
import Point from './point.js';
import PointEdit from './point-edit.js';
import Filter from './filter.js';
import {getDataForChart, renderChart} from './stat.js';

const POINTS_NUMBER = 4;
const FILTERS = [
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
const initialPoints = generatePoints(POINTS_NUMBER);
const totalCostElement = document.querySelector(`.trip__total-cost`);
const money = getDataForChart(initialPoints).sort((first, second) => second.total - first.total);
const transport = getDataForChart(initialPoints).filter((it) => types.get(it.type).category === `transport`).sort((first, second) => second.count - first.count);
const moneyConfig = {
  target: document.querySelector(`.statistic__money`),
  type: `money`,
  labels: money.map((it) => `${types.get(it.type).icon} ${it.type.toUpperCase()}`),
  dataSet: money.map((it) => it.total),
  prefix: `€ `
};
const transportConfig = {
  target: document.querySelector(`.statistic__transport`),
  type: `transport`,
  labels: transport.map((it) => `${types.get(it.type).icon} ${it.type.toUpperCase()}`),
  dataSet: transport.map((it) => it.count),
  prefix: `x`
};
let totalPrice = 0;

/**
 * функция для фильтрации массива объектов
 * @param {Array} points - массив с данными
 * @param {string} filterName - имя фильтра
 * @return {Array} отфильтрованный массив
 */
const filterPoints = (points, filterName) => {
  let result;
  switch (filterName) {
    case `filter-everything`:
      result = points;
      break;

    case `filter-future`:
      result = points.filter((point) => point.date > Date.now());
      break;

    case `filter-past`:
      result = points.filter((point) => point.date < Date.now());
      break;
  }
  return result;
};

/**
 * функция для отрисовки фильтров
 * @param {Array} filters - массив объектов с данными о фильтрах
 * @param {Object} container - DOM-элемент, в который нужно отрисовать фильтры
 */
const renderFilters = (filters, container) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();
  filters.forEach((filter) => {
    const filterComponent = new Filter(filter);
    /**
     * колбэк для клика по фильтру
     * @param {Object} evt - объект события Event
     */
    filterComponent.onFilter = (evt) => {
      const filterName = evt.target.id || evt.target.htmlFor;
      const filteredTasks = filterPoints(initialPoints, filterName);
      renderPoints(filteredTasks, tripDayElement);
    };
    filterComponent.render();
    fragment.appendChild(filterComponent.element);
  });
  container.appendChild(fragment);
};

/**
 * функция для замены одного объекта с данными в массиве объектов на другой
 * @param {Array} points - массив с данными
 * @param {Object} pointToUpdate - объект, который надо заменить
 * @param {Object} newPoint - новый объект
 */
const updatePoint = (points, pointToUpdate, newPoint) => {
  const index = points.findIndex((point) => point === pointToUpdate);
  points[index] = Object.assign({}, pointToUpdate, newPoint);
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
 * функция для записи суммарной цены
 * @param {number} price - цена
 * @param {Object} container - элемент, в который надо записать цену
 */
const setTotalPrice = (price, container) => {
  container.innerHTML = `&euro;&nbsp;${price}`;
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
       * колбэк для выбора/отмены оффера
       * @param {Object} evt - объект события Event
       */
      const onOffer = (evt) => {
        const offerIndex = point.offers.findIndex((it) => it.caption === evt.target.value);
        const currentOffer = point.offers[offerIndex];
        currentOffer.isChecked = evt.target.checked;
        pointEditComponent.updatePrice();
        const currentPrice = currentOffer.price;
        const totalPriceDifference = evt.target.checked ? currentPrice : -currentPrice;
        totalPrice += totalPriceDifference;
        setTotalPrice(totalPrice, totalCostElement);
      };

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
        updatePoint(points, point, newPoint);
        pointComponent.render();
        container.replaceChild(pointComponent.element, pointEditComponent.element);
        pointEditComponent.unrender();
      };
      pointEditComponent.onSubmit = onSubmit;
      pointEditComponent.onDelete = onDelete;
      pointEditComponent.onOffer = onOffer;
      pointEditComponent.render();
      container.replaceChild(pointEditComponent.element, pointComponent.element);
      pointComponent.unrender();
    };
    pointComponent.render();
    totalPrice += pointComponent.price;
    fragment.appendChild(pointComponent.element);
  });
  container.appendChild(fragment);
  setTotalPrice(totalPrice, totalCostElement);
};

renderPoints(initialPoints, tripDayElement);
renderFilters(FILTERS, tripFilterElement);
renderChart(moneyConfig);
renderChart(transportConfig);
