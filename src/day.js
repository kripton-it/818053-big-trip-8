import Component from './component.js';
import moment from 'moment';

/**
  * Класс дня маршрута.
  */
export default class Day extends Component {
  /**
   * Создает экземпляр Day.
   *
   * @constructor
   * @param {Array} points - массив объектов с точками
   * @this  {Day}
   */
  constructor(points) {
    super();
    this._points = points;
  }

  /**
   * Геттер для получения шаблонной строки дня маршрута.
   *
   * @return {string} шаблонная строка
   */
  get template() {
    const dateFrom = this._points[0].point.dateFrom;
    return `<section class="trip-day">
      <article class="trip-day__info">
        <span class="trip-day__caption">Day</span>
        <p class="trip-day__number">${moment(dateFrom).format(`DD`)}</p>
        <h2 class="trip-day__title">${moment(dateFrom).format(`MMM YY`)}</h2>
      </article>
      <div class="trip-day__items">
      </div>
    </section>`.trim();
  }
}


