import {types, getTimetable} from './utils.js';
import Component from './Component.js';
export default class Point extends Component {
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

  _onPointClick(evt) {
    evt.preventDefault();
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
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

  createListeners() {
    this._element.addEventListener(`click`, this._onPointClick);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._onPointClick);
  }

  update(data) {
    console.log(data);
    this._name = data.name;
    this._description = data.description;
    this._type = data.type.replace(data.type[0], data.type[0].toUpperCase());
    this._date = data.date;
    this._duration = data.duration;
    this._price = data.price;
    this._offers = data.offers;
    this._photos = data.photos;
  }
}

