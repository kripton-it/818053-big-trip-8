import Point from './point.js';
import PointEdit from './point-edit.js';
import FiltersContainer from './filters-container.js';
import SortingContainer from './sorting-container.js';
import Stat from './stat.js';
import API from './api.js';
import Day from './day.js';
import PointAdapter from './point-adapter.js';
import moment from 'moment';


const AUTHORIZATION = `Basic dXNlMkBwYkNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;
const api = new API({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});
const filterOptions = [
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
const sortingOptions = [
  {
    caption: `event`,
    isChecked: true,
  },
  {
    caption: `time`,
  },
  {
    caption: `price`,
  },
];
const tripFilterElement = document.querySelector(`.trip-filter`);
const tripSortingElement = document.querySelector(`.trip-sorting`);
const tripDayElement = document.querySelector(`.trip-day__items`);
const totalCostElement = document.querySelector(`.trip__total-cost`);
const newEventButton = document.querySelector(`.new-event`);
let totalPrice = 0;
let availableDestinations = [];
let availableOffers = [];
let localPoints = [];
let stat;
let days = [];
let sortOption = `event`;
let filterOption = `everything`;
const tripPoints = document.querySelector(`.trip-points`);
const tableControl = document.querySelector(`.view-switch__item[href="#table"]`);
const statControl = document.querySelector(`.view-switch__item[href="#stats"]`);
const statContainer = document.querySelector(`.statistic`);

/**
 * функция для фильтрации массива точек
 * @param {Array} points - массив точек
 * @return {Array} отфильтрованный массив
 */
const filterPoints = (points) => {
  let result;
  switch (filterOption) {
    case `everything`:
      result = points;
      break;

    case `future`:
      result = points.filter((point) => point.dateFrom > Date.now());
      break;

    case `past`:
      result = points.filter((point) => point.dateFrom < Date.now());
      break;
  }
  return result;
};

/**
 * функция для отрисовки статистики
 * @param {Array} points - массив с данными
 */
const renderStats = (points) => {
  if (stat) {
    stat.clear();
  }
  stat = new Stat(points);
  stat.render();
};

/**
 * функция для разбиения массива точек по дням
 * @param {Array} points - массив с данными
 * @return {Array} массив дней
 */
const getDays = (points) => points.reduce((acc, point) => {
  const currentDay = moment(point.dateFrom).format(`DD MMMM YYYY`);
  const index = acc.findIndex((dayPoints) => dayPoints.every((dayPoint) => dayPoint.day === currentDay));
  if (index >= 0) {
    acc[index].push({day: currentDay, point});
  } else {
    acc.push([{day: currentDay, point}]);
  }
  return acc;
}, []);

/**
 * функция для отрисовки фильтров
 * @param {Array} options - массив объектов с данными о фильтрах
 * @param {Object} container - DOM-элемент, в который нужно отрисовать фильтры
 */
const renderFilters = (options, container) => {
  container.innerHTML = ``;
  const filtersContainer = new FiltersContainer(options);
  filtersContainer.onFilter = (evt) => {
    const filterName = evt.target.htmlFor;
    filterOption = filterName.split(`-`)[1];
    filtersContainer.element.querySelector(`#${filterName}`).checked = true;
    renderDays(localPoints);
  };
  filtersContainer.render(container);
};

/**
 * функция для сортировки массива точек
 * @param {Array} points - массив с данными
 * @param {string} option - параметр сортировки
 */
const sortPoints = (points, option) => {
  switch (option) {
    case `event`:
      break;
    case `time`:
      points.sort((first, second) => (second.point.dateTo - second.point.dateFrom) - (first.point.dateTo - first.point.dateFrom));
      break;
    case `price`:
      points.sort((first, second) => {
        const firstTotalPrice = first.point.basePrice + first.point.offers.filter((offer) => offer.accepted).map((offer) => offer.price).reduce((acc, price) => acc + price, 0);
        const secondTotalPrice = second.point.basePrice + second.point.offers.filter((offer) => offer.accepted).map((offer) => offer.price).reduce((acc, price) => acc + price, 0);
        return secondTotalPrice - firstTotalPrice;
      });
      break;
  }
};

/**
 * функция для отрисовки параметров сортировки
 * @param {Object} options - массив объектов с данными параметров сортировки
 * @param {Object} container - DOM-элемент, в который нужно отрисовать параметр сортировки
 */
const renderSorting = (options, container) => {
  container.innerHTML = ``;
  const sortingContainer = new SortingContainer(options);
  sortingContainer.onSort = (evt) => {
    const sortName = evt.target.htmlFor;
    sortOption = sortName.split(`-`)[1];
    renderDays(localPoints);
    sortingContainer.element.querySelector(`#${sortName}`).checked = true;
  };
  sortingContainer.render(container);
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
 * функция для отрисовки массива точек маршрута
 * @param {Array} points - массив с данными
 * @param {Object} container - DOM-элемент, в который нужно отрисовать точки маршрута
 */
const renderPoints = (points, container) => {
  container.innerHTML = ``;
  const fragment = document.createDocumentFragment();
  points.forEach((point) => {
    const pointComponent = new Point(point);
    /**
     * колбэк для перехода в режим редактирования
     */
    pointComponent.onClick = () => {
      const oldTotalPrice = totalPrice;
      const pointEditComponent = new PointEdit(point);
      /**
       * колбэк для выбора/отмены оффера
       * @param {Object} evt - объект события Event
       */
      const onOffer = (evt) => {
        const offerIndex = point.offers.findIndex((offer) => offer.title === evt.target.value);
        const currentOffer = point.offers[offerIndex];
        const currentPrice = currentOffer.price;
        const totalPriceDifference = evt.target.checked ? currentPrice : -currentPrice;
        totalPrice += totalPriceDifference;
        totalCostElement.innerHTML = `&euro;&nbsp;${totalPrice}`;
      };

      /**
       * колбэк для нажатия на кнопку Delete
       */
      const onDelete = ({id}) => {
        pointEditComponent.element.style.border = `none`;
        block();
        deleteButton.textContent = `Deleting...`;
        api.deletePoint({id})
          .then(() => api.getPoints())
          .then((returnedPoints) => {
            localPoints = returnedPoints;
            renderDays(localPoints);
          })
          .catch(() => {
            unblock();
            pointEditComponent.shake();
            deleteButton.textContent = `Delete`;
            pointEditComponent.element.style.border = `1px solid red`;
          });
      };

      /**
       * колбэк для выхода из режима редактирования
       * @param {Object} newObject - объект, из которого обновляется информация
       */
      const onSubmit = (newObject) => {
        pointEditComponent.element.style.border = `none`;
        for (const key in newObject) {
          if (newObject[key]) {
            point[key] = newObject[key];
          }
        }

        block();
        saveButton.textContent = `Saving...`;
        api.updatePoint({
          id: point.id,
          data: PointAdapter.toRAW(point)
        })
          .then((newPoint) => {
            unblock();
            updatePoint(localPoints, point, newPoint);
            localPoints.sort((first, second) => first.dateFrom - second.dateFrom);
            renderDays(localPoints);
          })
          .catch(() => {
            unblock();
            pointEditComponent.shake();
            saveButton.textContent = `Save`;
            pointEditComponent.element.style.border = `1px solid red`;
          });
      };
      const onDestination = (evt) => {
        pointEditComponent.destinationUpdate(evt.target.value);
      };
      const onType = (evt) => {
        const oldPrice = pointEditComponent.price;
        totalPrice -= oldPrice;
        point.offers = availableOffers.find((offer) => offer.type === evt.target.value).offers.map((offer) => {
          return {
            title: offer.name,
            price: offer.price,
            accepted: false
          };
        });
        pointEditComponent.offers = point.offers;
        pointEditComponent.typeUpdate(evt.target.value);
        const newPrice = pointEditComponent.price;
        totalPrice += newPrice;
        totalCostElement.innerHTML = `&euro;&nbsp;${totalPrice}`;
      };
      const onEsc = () => {
        pointComponent.render();
        container.replaceChild(pointComponent.element, pointEditComponent.element);
        pointEditComponent.unrender();
        totalPrice = oldTotalPrice;
        totalCostElement.innerHTML = `&euro;&nbsp;${totalPrice}`;
      };

      pointEditComponent.availableDestinations = availableDestinations;
      pointEditComponent.availableOffers = availableOffers;
      pointEditComponent.onSubmit = onSubmit;
      pointEditComponent.onDelete = onDelete;
      pointEditComponent.onOffer = onOffer;
      pointEditComponent.onType = onType;
      pointEditComponent.onEsc = onEsc;
      pointEditComponent.onDestination = onDestination;
      pointEditComponent.render();
      const saveButton = pointEditComponent.element.querySelector(`.point__button--save`);
      const deleteButton = pointEditComponent.element.querySelector(`.point__button[type="reset"]`);
      /**
       * блокировка формы
       */
      const block = () => {
        saveButton.disabled = true;
        deleteButton.disabled = true;
      };

      /**
       * разблокировка формы
       */
      const unblock = () => {
        saveButton.disabled = false;
        deleteButton.disabled = false;
      };
      container.replaceChild(pointEditComponent.element, pointComponent.element);
      pointComponent.unrender();
    };
    pointComponent.render();
    totalPrice += pointComponent.price;
    fragment.appendChild(pointComponent.element);
  });
  container.appendChild(fragment);
  totalCostElement.innerHTML = `&euro;&nbsp;${totalPrice}`;
};

/**
 * функция для отрисовки дней маршрута
 * @param {Array} points - массив с точками
 */
const renderDays = (points) => {
  const filteredPoints = filterPoints(points);
  totalPrice = 0;
  tripPoints.innerHTML = ``;
  days = getDays(filteredPoints);
  days.forEach((dayPoints) => {
    sortPoints(dayPoints, sortOption);
    const currentDay = new Day(dayPoints);
    const currentDayElement = currentDay.render();
    renderPoints(dayPoints.map((item) => item.point), currentDayElement.querySelector(`.trip-day__items`));
    tripPoints.appendChild(currentDayElement);
  });
  renderStats(filteredPoints);
};

/**
 * обработчик нажатия на кнопку Statistic
 * @param {Object} evt - массив объектов с данными о фильтрах
 */
const onStatControlClick = (evt) => {
  evt.preventDefault();
  document.querySelector(`main`).classList.add(`visually-hidden`);
  statContainer.classList.remove(`visually-hidden`);
  statControl.classList.add(`view-switch__item--active`);
  tableControl.classList.remove(`view-switch__item--active`);
};

/**
 * обработчик нажатия на кнопку Table
 * @param {Object} evt - массив объектов с данными о фильтрах
 */
const onTableControlClick = (evt) => {
  evt.preventDefault();
  document.querySelector(`main`).classList.remove(`visually-hidden`);
  statContainer.classList.add(`visually-hidden`);
  statControl.classList.remove(`view-switch__item--active`);
  tableControl.classList.add(`view-switch__item--active`);
};

/**
 * обработчик нажатия на кнопку New Event
 * @param {Object} evt - массив объектов с данными о фильтрах
 */
const onNewEventButtonClick = () => {
  const oldTotalPrice = totalPrice;
  const newPointComponent = new PointEdit({dateFrom: Date.now(), dateTo: Date.now()});

  newPointComponent.availableDestinations = availableDestinations;
  newPointComponent.availableOffers = availableOffers;
  const onDestination = (evt) => {
    newPointComponent.destinationUpdate(evt.target.value);
  };
  newPointComponent.onDestination = onDestination;
  const onType = (evt) => {
    const oldPrice = newPointComponent.price;
    totalPrice -= oldPrice;
    newPointComponent.typeUpdate(evt.target.value);
    const newPrice = newPointComponent.price;
    totalPrice += newPrice;
    totalCostElement.innerHTML = `&euro;&nbsp;${totalPrice}`;
  };
  newPointComponent.onType = onType;
  const onDelete = () => {
    newEventButton.addEventListener(`click`, onNewEventButtonClick);
    newPointComponent.unrender();
    totalPrice = oldTotalPrice;
    totalCostElement.innerHTML = `&euro;&nbsp;${totalPrice}`;
  };
  newPointComponent.onDelete = onDelete;
  const onOffer = (evt) => {
    const offerIndex = newPointComponent._offers.findIndex((it) => it.title === evt.target.value);
    const currentOffer = newPointComponent._offers[offerIndex];
    const currentPrice = currentOffer.price;
    const totalPriceDifference = evt.target.checked ? currentPrice : -currentPrice;
    totalPrice += totalPriceDifference;
    totalCostElement.innerHTML = `&euro;&nbsp;${totalPrice}`;
  };
  newPointComponent.onOffer = onOffer;
  const onEsc = () => {
    newEventButton.addEventListener(`click`, onNewEventButtonClick);
    newPointComponent.unrender();
    totalPrice = oldTotalPrice;
    totalCostElement.innerHTML = `&euro;&nbsp;${totalPrice}`;
  };
  newPointComponent.onEsc = onEsc;
  /**
    * блокировка формы
    */
  const block = () => {
    saveButton.disabled = true;
    deleteButton.disabled = true;
  };

  /**
    * разблокировка формы
    */
  const unblock = () => {
    saveButton.disabled = false;
    deleteButton.disabled = false;
  };
  const onSubmit = (newObject) => {
    newPointComponent.element.style.border = `none`;
    block();
    saveButton.textContent = `Saving...`;

    api.createPoint({data: PointAdapter.toRAW(newObject)})
      .then((newPoint) => {
        unblock();
        localPoints.push(newPoint);
        localPoints = localPoints.sort((first, second) => first.dateFrom - second.dateFrom);
        renderDays(localPoints);
        newEventButton.addEventListener(`click`, onNewEventButtonClick);
      })
      .catch(() => {
        unblock();
        newPointComponent.shake();
        saveButton.textContent = `Save`;
        newPointComponent.element.style.border = `1px solid red`;
      });
  };
  newPointComponent.onSubmit = onSubmit;
  newPointComponent.render();
  const saveButton = newPointComponent.element.querySelector(`.point__button--save`);
  const deleteButton = newPointComponent.element.querySelector(`.point__button[type="reset"]`);

  tripPoints.insertAdjacentElement(`afterBegin`, newPointComponent.element);
  newEventButton.removeEventListener(`click`, onNewEventButtonClick);
};

newEventButton.addEventListener(`click`, onNewEventButtonClick);
statControl.addEventListener(`click`, onStatControlClick);
tableControl.addEventListener(`click`, onTableControlClick);
tripDayElement.textContent = `Loading route...`;
api.getPoints().then((points) => {
  localPoints = points.sort((first, second) => first.dateFrom - second.dateFrom);
  renderFilters(filterOptions, tripFilterElement);
  renderSorting(sortingOptions, tripSortingElement);
  renderDays(localPoints);
}).catch(() => {
  tripDayElement.textContent = `Something went wrong while loading your route info. Check your connection or try again later`;
});
api.getDestinations().then((destinations) => {
  availableDestinations = destinations;
});
api.getOffers().then((offers) => {
  availableOffers = offers;
});
