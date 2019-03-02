import {types} from './data.js';
import {generatePoint} from './data.js';

const getTimetable = (time, duration) => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}&nbsp;&mdash; ${hours + duration < 10 ? `0${hours + duration}` : hours + duration}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

const getPoint = (point) => {
  return `<article class="trip-point">
  <i class="trip-icon">${types.get(point.type)}</i>
  <h3 class="trip-point__title">${point.title}</h3>
  <p class="trip-point__schedule">
    <span class="trip-point__timetable">${getTimetable(point.date, point.duration)}</span>
    <span class="trip-point__duration">${point.duration}h 00m</span>
  </p>
  <p class="trip-point__price">&euro;&nbsp;${point.price}</p>
  <ul class="trip-point__offers">
    ${point.offers.map((offer) => `<li>
    <button class="trip-point__offer">${offer.caption} +&euro;&nbsp;${offer.price}</button>
  </li>`).join(``)}
  </ul>
</article>`;
};

export default (number) => (new Array(number)).fill(``).map(() => getPoint(generatePoint()));

