import {types, getTimetable} from './utils.js';

export default class Point {
  constructor(point) {
    this._name = point.name;
    this._description = point.description;
    this._type = point.type;
    this._date = point.date;
    this._duration = point.duration;
    this._price = point.price;
    this._offers = point.offers;
    this._photos = point.photos;
    this._element = null;
    this._onClick = null;
    this._onPointClick = this._onPointClick.bind(this);
  }

  _onPointClick(evt) {
    evt.preventDefault();
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  get element() {
    return this._element;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  get template() {
    return `<article class="trip-point">
      <i class="trip-icon">${types.get(this._type).icon}</i>
      <h3 class="trip-point__title">${`${this._type} ${types.get(this._type).preposition} ${this._name}`}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${getTimetable(this._date, this._duration)}</span>
        <span class="trip-point__duration">${this._duration}h 00m</span>
      </p>
      <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
      <ul class="trip-point__offers">
        ${this._offers.map((offer) => `<li>
        <button class="trip-point__offer">${offer.caption} +&euro;&nbsp;${offer.price}</button>
      </li>`).join(``)}
      </ul>
    </article>`;
  }

  bind() {
    this._element.addEventListener(`click`, this._onPointClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onPointClick);
  }

  render() {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = this.template;
    this._element = newElement.firstChild;
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}
