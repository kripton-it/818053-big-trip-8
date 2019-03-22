import {types} from './utils.js';
import Component from './component.js';
import flatpickr from 'flatpickr';
import moment from 'moment';

/**
  * Класс точки маршрута в режиме редактирования.
  */
export default class PointEdit extends Component {
  /**
   * Создает экземпляр PointEdit.
   *
   * @constructor
   * @param {Object} point - объект с данными точки маршрута
   * @param {number} index - индекс
   * @this  {PointEdit}
   */
  constructor(point, index) {
    super();
    this._index = index;
    this._name = point.name;
    this._description = point.description;
    this._type = point.type.replace(point.type[0], point.type[0].toUpperCase());
    this._date = point.date;
    this._duration = point.duration;
    this._price = point.price;
    this._offers = point.offers;
    this._photos = point.photos;
    this._onSubmit = null;
    this._onDelete = null;
    this._onOffer = null;
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onOfferChange = this._onOfferChange.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
  }

  /**
   * Метод-обработчик нажатия на кнопку Save.
   * @param {Object} evt - объект события Event
   */
  _onFormSubmit(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`form`));
    const newData = this._processForm(formData);

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  /**
   * Метод-обработчик нажатия на кнопку Delete.
   * @param {Object} evt - объект события Event
   */
  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  /**
   * Метод-обработчик для выбора/отмены оффера.
   * @param {Object} evt - объект события Event
   */
  _onOfferChange(evt) {
    evt.preventDefault();
    // const formData = new FormData(this._element.querySelector(`form`));
    // const newData = this._processForm(formData);
    if (typeof this._onOffer === `function`) {
      this._onOffer(evt);
    }
    // this.update(newData);
  }

  /**
   * Сеттер для передачи колбэка для выбора/отмены оффера.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onOffer(fn) {
    this._onOffer = fn;
  }

  /**
   * Сеттер для передачи колбэка по нажатию на кнопку Save.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  /**
   * Сеттер для передачи колбэка по нажатию на кнопку Delete.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onDelete(fn) {
    this._onDelete = fn;
  }

  /**
   * Геттер для получения шаблонной строки точки маршрута.
   *
   * @return  {string} шаблонная строка
   */
  get template() {
    const offers = this._offers.filter((offer) => offer.types.includes(this._type)).map((offer) => {
      return `
      <input class="point__offers-input visually-hidden" type="checkbox" id="${offer.caption}-${this._index}" name="offer" value="${offer.caption}"${offer.isChecked ? ` checked` : ``}>
      <label for="${offer.caption}-${this._index}" class="point__offers-label">
        <span class="point__offer-service">${offer.caption}</span> + €<span class="point__offer-price">${offer.price}</span>
      </label>
      `;
    }).join(``);

    const images = this._photos.map((photo) => `
      <img src="${photo}" alt="picture from place" class="point__destination-image">
    `).join(``);

    return `<article class="point">
      <form action="" method="get">
        <header class="point__header">
          <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="MAR 18" name="day">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle-${this._index}">${types.get(this._type).icon}</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle-${this._index}">

            <div class="travel-way__select">
              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi-${this._index}" name="travel-way" value="taxi">
                <label class="travel-way__select-label" for="travel-way-taxi-${this._index}">🚕 taxi</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus-${this._index}" name="travel-way" value="bus">
                <label class="travel-way__select-label" for="travel-way-bus-${this._index}">🚌 bus</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train-${this._index}" name="travel-way" value="train">
                <label class="travel-way__select-label" for="travel-way-train-${this._index}">🚂 train</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight-${this._index}" name="travel-way" value="train" checked>
                <label class="travel-way__select-label" for="travel-way-flight-${this._index}">✈️ flight</label>
              </div>

              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in-${this._index}" name="travel-way" value="check-in">
                <label class="travel-way__select-label" for="travel-way-check-in-${this._index}">🏨 check-in</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing-${this._index}" name="travel-way" value="sight-seeing">
                <label class="travel-way__select-label" for="travel-way-sightseeing-${this._index}">🏛 sightseeing</label>
              </div>
            </div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination-${this._index}">${this._type} ${types.get(this._type).preposition}</label>
            <input class="point__destination-input" list="destination-select" id="destination-${this._index}" value="${this._name}" name="destination">
            <datalist id="destination-select-${this._index}">
              <option value="airport"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
              <option value="hotel"></option>
            </datalist>
          </div>

          <label class="point__time">
            choose time
            <input class="point__input" type="text" value="${moment(this._date).format(`HH:mm`)}" name="time" placeholder="00:00 — 00:00">
          </label>

          <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this.price}" name="price">
          </label>

          <div class="point__buttons">
            <button class="point__button point__button--save" type="submit">Save</button>
            <button class="point__button" type="reset">Delete</button>
          </div>

          <div class="paint__favorite-wrap">
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite-${this._index}" name="favorite">
            <label class="point__favorite" for="favorite-${this._index}">favorite</label>
          </div>
        </header>

        <section class="point__details">
          <section class="point__offers">
            <h3 class="point__details-title">offers</h3>

            <div class="point__offers-wrap">${offers}
            </div>

          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">${this._description}</p>
            <div class="point__destination-images">${images}
            </div>
          </section>
          <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
      </form>
    </article>`;
  }

  /**
   * Геттер для получения полной цены точки с учётом доп. офферов.
   *
   * @return {number} полная цена
   */
  get price() {
    const offerTotalPrice = this._offers.filter((offer) => (offer.isChecked && offer.types.includes(this._type))).reduce((acc, offer) => acc + offer.price, 0);
    return this._price + offerTotalPrice;
  }

  updatePrice() {
    this._element.querySelector(`.point__input[name="price"]`).value = this.price;
  }

  /**
    * Метод для навешивания обработчиков.
    */
  _createListeners() {
    this._element.querySelector(`form`).addEventListener(`submit`, this._onFormSubmit);
    this._element.querySelector(`form .point__buttons button[type="reset"]`).addEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.point__offers-wrap`).addEventListener(`change`, this._onOfferChange);

    const pointInput = this.element.querySelector(`input[name="time"]`);
    // pointInput.style.outline = `1px solid red`;
    flatpickr(pointInput, {mode: `multiple`, conjunction: ` - `, enableTime: true, noCalendar: false, altInput: true, altFormat: `H:i`, dateFormat: `H:i`});
  }

  /**
    * Метод для удаления обработчиков.
    */
  _removeListeners() {
    this._element.querySelector(`form`).removeEventListener(`submit`, this._onFormSubmit);
    this._element.querySelector(`form .point__buttons button[type="reset"]`).removeEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.point__offers-wrap`).removeEventListener(`change`, this._onOfferChange);
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

  /**
   * Вспомогательный метод для конвертации информации из формы в формат, понятный компоненту.
   * @param {Array} formData - данные из формы (массив массивов [поле, значение])
   * @return {Object} - объект, в который записана информация из формы
   */
  _processForm(formData) {
    const entry = {
      name: ``,
      type: ``,
      price: 0,
      offers: this._offers.map((offer) => Object.assign({}, offer, {isChecked: false})),
    };

    const taskEditMapper = PointEdit.createMapper.call(this, entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (taskEditMapper.hasOwnProperty(property)) {
        taskEditMapper[property](value);
      }
    }
    return entry;
  }

  /**
    * Статический метод для преобразования данных.
    * Его задача - сопоставить поля формы с полями структуры и записать в них полученные значения.
    * @param {Object} target - объект, в который будет записан результат преобразования.
    * @return {Object} - новый объект, поля которого - это функции для преобразования значений из соответствующих полей формы и записи результата в target.
    */
  static createMapper(target) {
    return {
      'time': (value) => (target.date = new Date(`${moment(this._date).format(`YYYY-MM-DD`)} ${value}`).getTime()),
      'price': (value) => {
        target.price = +value;
      },
      'travel-way': (value) => (target.type = value),
      'offer': (value) => {
        target.offers.find((offer) => offer.caption === value).isChecked = true;
      },
      'destination': (value) => {
        target.name = value;
      },
    };
  }
}
