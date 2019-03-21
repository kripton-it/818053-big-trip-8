import {types} from './utils.js';
import Component from './component.js';
import moment from 'moment';

/**
  * Класс точки маршрута в режиме просмотра.
  */
export default class Point extends Component {
  /**
   * Создает экземпляр Point.
   *
   * @constructor
   * @param {Object} point - объект с данными точки маршрута
   * @this  {Point}
   */
  constructor(point) {
    super();
    this._name = point.name;
    this._description = point.description;
    this._type = point.type.replace(point.type[0], point.type[0].toUpperCase());
    this._date = point.date;
    this._duration = point.duration;
    this._price = point.price;
    this._offers = point.offers;
    this._photos = point.photos;
    this._onClick = null;
    this._onPointClick = this._onPointClick.bind(this);
  }

  /**
   * Метод-обработчик нажатия на точку маршрута.
   * @param {Object} evt - объект события Event
   */
  _onPointClick(evt) {
    evt.preventDefault();
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  /**
   * Сеттер для передачи колбэка по нажатию на точку маршрута.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onClick(fn) {
    this._onClick = fn;
  }

  /**
   * Геттер для получения шаблонной строки точки маршрута.
   *
   * @return {string} шаблонная строка
   */
  get template() {
    return `<article class="trip-point">
      <i class="trip-icon">${types.get(this._type).icon}</i>
      <h3 class="trip-point__title">${`${this._type} ${types.get(this._type).preposition} ${this._name}`}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${moment(this._date).format(`HH:mm`)}</span>
        <span class="trip-point__duration">${this._duration}h 00m</span>
      </p>
      <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
      <ul class="trip-point__offers">
        ${this._offers.filter((offer) => (offer.isChecked && offer.types.includes(this._type))).map((offer) => `<li>
        <button class="trip-point__offer">${offer.caption} +&euro;&nbsp;${offer.price}</button>
      </li>`).join(``)}
      </ul>
    </article>`;
  }

  /**
    * Метод для навешивания обработчиков.
    */
  _createListeners() {
    this._element.addEventListener(`click`, this._onPointClick);
  }

  /**
    * Метод для удаления обработчиков.
    */
  _removeListeners() {
    this._element.removeEventListener(`click`, this._onPointClick);
  }

  /**
    * Метод для обновления данных.
    * @param {Object} point - объект с данными для обновления.
    */
  update(point) {
    this._name = point.name;
    this._description = point.description;
    this._type = point.type.replace(point.type[0], point.type[0].toUpperCase());
    this._date = point.date;
    this._duration = point.duration;
    this._price = point.price;
    this._offers = point.offers;
    this._photos = point.photos;
  }
}

