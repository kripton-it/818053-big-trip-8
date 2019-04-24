import {types, getDuration, capitalize} from './utils.js';
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
    this._id = point.id;
    this._name = point.name;
    this._type = point.type;
    this._dateFrom = point.dateFrom;
    this._dateTo = point.dateTo;
    this._basePrice = point.basePrice;
    this._offers = point.offers;
    this._onClick = null;
    this._onPointClick = this._onPointClick.bind(this);
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
    const duration = getDuration(this._dateTo - this._dateFrom);
    const offersList = `<ul class="trip-point__offers">
        ${this._offers.slice(0, 3).map((offer) => `<li>
        <button class="trip-point__offer">${offer.title} +&euro;&nbsp;${offer.price}</button>
      </li>`).join(``)}
      </ul>`;
    return `<article class="trip-point">
      <i class="trip-icon">${types.get(this._type).icon}</i>
      <h3 class="trip-point__title"></h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${moment(this._dateFrom).format(`HH:mm`)} - ${moment(this._dateTo).format(`HH:mm`)}</span>
        <span class="trip-point__duration">${duration}</span>
      </p>
      <p class="trip-point__price">&euro;&nbsp;${this._basePrice}</p>
      ${offersList}
    </article>`;
  }

  /**
   * Метод для создания DOM-элемента по шаблону.
   * Также навешивает все необходимые обработчики.
   *
   * @return  {object} DOM-элемент
   */
  render() {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = this.template;
    this._element = newElement.firstChild;
    this._createListeners();
    this._element.querySelector(`.trip-point__title`).textContent = `${capitalize(this._type)} ${types.get(this._type).preposition} ${this._name}`;
    return this._element;
  }

  /**
   * Геттер для получения полной цены точки с учётом доп. офферов.
   *
   * @return {number} полная цена
   */
  get price() {
    const offerTotalPrice = this._offers.filter((offer) => (offer.accepted)).reduce((acc, offer) => acc + offer.price, 0);
    return this._basePrice + offerTotalPrice;
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
   * Метод-обработчик нажатия на точку маршрута.
   * @param {Object} evt - объект события Event
   */
  _onPointClick(evt) {
    evt.preventDefault();
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }
}
