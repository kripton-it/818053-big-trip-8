import {types, capitalize} from './utils.js';
import Component from './component.js';
import flatpickr from 'flatpickr';
import moment from 'moment';

const ESC_KEYCODE = 27;

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
  constructor(point) {
    super();
    this._id = point.id || ``;
    this._name = point.name || ``;
    this._description = point.description || ``;
    this._type = point.type || `taxi`;
    this._dateFrom = new Date(point.dateFrom);
    this._dateTo = new Date(point.dateTo);
    this._basePrice = point.basePrice || 0;
    this._offers = point.offers || [];
    this._photos = point.photos || [];
    this._isFavorite = point.isFavorite;
    this._availableDestinations = [];
    this._availableOffers = [];
    this._onSubmit = null;
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onDelete = null;
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onOffer = null;
    this._onOfferChange = this._onOfferChange.bind(this);
    this._onType = null;
    this._onTypeChange = this._onTypeChange.bind(this);
    this._onDestination = null;
    this._onDestinationChange = this._onDestinationChange.bind(this);
    this._onEsc = null;
    this._onEscPress = this._onEscPress.bind(this);
  }

  /**
   * Сеттер для передачи колбэка при нажатии на Esc.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onEsc(fn) {
    this._onEsc = fn;
  }

  /**
   * Сеттер для передачи колбэка для изменения типа.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onType(fn) {
    this._onType = fn;
  }

  /**
   * Сеттер для передачи колбэка для изменения направления.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onDestination(fn) {
    this._onDestination = fn;
  }

  /**
   * Сеттер для передачи массива возможных направлений.
   * @param {Array} destinations - массив возможных направлений
   */
  set availableDestinations(destinations) {
    this._availableDestinations = destinations;
  }

  /**
   * Сеттер для передачи массива возможных предложений.
   * @param {Array} offers - массив возможных предложений
   */
  set availableOffers(offers) {
    this._availableOffers = offers;
  }

  /**
   * Сеттер для передачи массива предложений.
   * @param {Array} offers - массив возможных предложений
   */
  set offers(offers) {
    this._offers = offers;
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
   * Метод-обработчик нажатия на кнопку Esc.
   * @param {Object} evt - объект события Event
   */
  _onEscPress(evt) {
    evt.preventDefault();
    if (evt.keyCode === ESC_KEYCODE && typeof this._onEsc === `function`) {
      this._onEsc();
    }
  }

  /**
   * Метод-обработчик нажатия на кнопку Save.
   * @param {Object} evt - объект события Event
   */
  _onFormSubmit(evt) {
    evt.preventDefault();
    this._element.querySelector(`.point__total-price`).value = this.price;
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
      this._onDelete({id: this._id});
    }
  }

  /**
   * Метод-обработчик для выбора/отмены оффера.
   * @param {Object} evt - объект события Event
   */
  _onOfferChange(evt) {
    evt.preventDefault();
    if (typeof this._onOffer === `function`) {
      this._onOffer(evt);
    }
  }

  /**
   * Метод-обработчик для изменения типа.
   * @param {Object} evt - объект события Event
   */
  _onTypeChange(evt) {
    evt.preventDefault();
    if (typeof this._onType === `function`) {
      this._onType(evt);
    }
  }

  /**
   * Метод-обработчик для изменения направления.
   * @param {Object} evt - объект события Event
   */
  _onDestinationChange(evt) {
    evt.preventDefault();
    if (typeof this._onDestination === `function`) {
      this._onDestination(evt);
    }
  }

  /**
   * Метод для передачи состояния оффера.
   * @param {number} index - порядковый номер
   * @param {boolean} state - состояние
   */
  changeOfferState(index, state) {
    this._offers[index].accepted = state;
  }

  /**
   * Геттер для получения шаблонной строки точки маршрута.
   *
   * @return  {string} шаблонная строка
   */
  get template() {
    const destinations = this._availableDestinations.map((destination) => `<option value="${destination.name}"></option>`).join(``);
    if (this._offers.length === 0) {
      this._offers = this._offers = this._availableOffers.find((offer) => offer.type === this._type).offers.map((offer) => {
        return {
          title: offer.name,
          price: offer.price,
          accepted: false
        };
      });
    }
    const offers = this._offers.map((offer) => {
      const offerTitle = offer.title;
      return `
      <input class="point__offers-input visually-hidden" type="checkbox" id="${offerTitle}-${this._id}" name="offer" value="${offerTitle}"${offer.accepted ? ` checked` : ``}>
      <label for="${offerTitle}-${this._id}" class="point__offers-label">
        <span class="point__offer-service">${offerTitle}</span> + €<span class="point__offer-price">${offer.price}</span>
      </label>
      `;
    }).join(``);

    const images = this._photos.map((photo) => `
      <img src="${photo.src}" alt="${photo.description}" class="point__destination-image">
    `).join(``);

    return `<article class="point">
      <form action="" method="get">
        <header class="point__header">
          <label class="point__date">
            choose day
            <input class="point__input" type="text" name="day" value="${moment(this._dateFrom).format(`MMM YY`)}">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle-${this._id}">${types.get(this._type).icon}</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle-${this._id}">

            <div class="travel-way__select">
              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi-${this._id}" name="travel-way" value="taxi"${this._type === `taxi` ? ` checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-taxi-${this._id}">🚕 taxi</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus-${this._id}" name="travel-way" value="bus"${this._type === `bus` ? ` checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-bus-${this._id}">🚌 bus</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train-${this._id}" name="travel-way" value="train"${this._type === `train` ? ` checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-train-${this._id}">🚂 train</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight-${this._id}" name="travel-way" value="flight"${this._type === `flight` ? ` checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-flight-${this._id}">✈️ flight</label>
              </div>

              <div class="travel-way__select-group">
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in-${this._id}" name="travel-way" value="check-in"${this._type === `check-in` ? ` checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-check-in-${this._id}">🏨 check-in</label>

                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing-${this._id}" name="travel-way" value="sightseeing"${this._type === `sightseeing` ? ` checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-sightseeing-${this._id}">🏛 sightseeing</label>
              </div>
            </div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination-${this._id}">${capitalize(this._type)} ${types.get(this._type).preposition}</label>
            <input class="point__destination-input" list="destination-select-${this._id}" id="destination-${this._id}" value="${this._name}" name="destination">
            <datalist id="destination-select-${this._id}">
              ${destinations}
            </datalist>
          </div>

          <label class="point__time">
            choose time
            <input class="point__input" type="text" value="${moment(this._dateFrom).format(`HH:mm`)}" name="date-start">
            <input class="point__input" type="text" value="${moment(this._dateTo).format(`HH:mm`)}" name="date-end">
          </label>

          <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this._basePrice}" name="price">
          </label>

          <div class="point__buttons">
            <button class="point__button point__button--save" type="submit">Save</button>
            <button class="point__button" type="reset">Delete</button>
          </div>

          <div class="paint__favorite-wrap">
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite-${this._id}" name="favorite"${this._isFavorite ? ` checked` : ``}>
            <label class="point__favorite" for="favorite-${this._id}">favorite</label>
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
    const offerTotalPrice = this._offers.filter((offer) => offer.accepted).reduce((acc, offer) => acc + offer.price, 0);
    return this._basePrice + offerTotalPrice;
  }

  /**
    * Метод для навешивания обработчиков.
    */
  _createListeners() {
    this._element.querySelector(`form`).addEventListener(`submit`, this._onFormSubmit);
    this._element.querySelector(`form .point__buttons button[type="reset"]`).addEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.point__offers-wrap`).addEventListener(`change`, this._onOfferChange);
    this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onTypeChange);
    this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onDestinationChange);
    document.addEventListener(`keyup`, this._onEscPress);

    const dateStartInput = this.element.querySelector(`input[name="date-start"]`);
    const dateEndInput = this.element.querySelector(`input[name="date-end"]`);
    flatpickr(dateStartInput, {
      enableTime: true,
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `Z`,
      defaultDate: this._dateFrom,
      onChange: (selectedDates) => (this._dateFrom = selectedDates[0])
    });
    flatpickr(dateEndInput, {
      enableTime: true,
      altInput: true,
      altFormat: `H:i`,
      dateFormat: `Z`,
      defaultDate: this._dateTo,
      onChange: (selectedDates) => (this._dateTo = selectedDates[0])
    });
  }

  /**
    * Метод для удаления обработчиков.
    */
  _removeListeners() {
    this._element.querySelector(`form`).removeEventListener(`submit`, this._onFormSubmit);
    this._element.querySelector(`form .point__buttons button[type="reset"]`).removeEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.point__offers-wrap`).removeEventListener(`change`, this._onOfferChange);
    this._element.querySelector(`.travel-way__select`).removeEventListener(`change`, this._onTypeChange);
    this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onDestinationChange);
    document.removeEventListener(`click`, this._onEscPress);
  }

  /**
    * Метод для обновления данных.
    * @param {Object} point - объект с данными для обновления.
    */
  update(point) {
    this._name = point.destination.name;
    this._description = point.destination.description;
    this._type = point.type;
    this._dateFrom = point.dateFrom;
    this._dateTo = point.dateTo;
    this._basePrice = point.price;
    this._isFavorite = point.isFavorite;
    this._offers = point.offers;
    this._photos = point.destination.pictures;
  }

  /**
   * Вспомогательный метод для конвертации информации из формы в формат, понятный компоненту.
   * @param {Array} formData - данные из формы (массив массивов [поле, значение])
   * @return {Object} - объект, в который записана информация из формы
   */
  _processForm(formData) {
    const entry = {
      destination: {},
      dateFrom: 0,
      dateTo: 0,
      type: ``,
      price: 0,
      isFavorite: false,
      offers: this._offers.map((offer) => Object.assign({}, offer, {accepted: false})),
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
      'date-start': () => (target.dateFrom = this._dateFrom.getTime()),
      'date-end': () => (target.dateTo = this._dateTo.getTime()),
      'price': (value) => (target.price = +value),
      'travel-way': (value) => (target.type = value),
      'offer': (value) => (target.offers.find((offer) => offer.title === value).accepted = true),
      'destination': (value) => (target.destination = this._availableDestinations.find((destination) => destination.name === value)),
      'favorite': () => (target.isFavorite = true)
    };
  }

  /**
    * Метод для обновления описания и фотографий при изменении пункта назначения.
    * @param {string} name - пункт назначения.
    */
  destinationUpdate(name) {
    const destination = this._availableDestinations.find((dest) => dest.name === name);
    this._description = destination.description;
    this._photos = destination.pictures;
    this._element.querySelector(`.point__destination-text`).innerHTML = this._description;
    const images = this._photos.map((photo) => `
      <img src="${photo.src}" alt="${photo.description}" class="point__destination-image">
    `).join(``);
    this._element.querySelector(`.point__destination-images`).innerHTML = images;
  }

  /**
    * Метод для обновления доступных предложений при изменении типа точки.
    * @param {string} type - тип точки.
    */
  typeUpdate(type) {
    this._type = type;
    this._offers = this._availableOffers.find((offer) => offer.type === type).offers.map((offer) => {
      return {
        title: offer.name,
        price: offer.price,
        accepted: false
      };
    });
    const offers = this._offers.map((offer) => {
      const offerTitle = offer.title;
      return `
      <input class="point__offers-input visually-hidden" type="checkbox" id="${offerTitle}-${this._id}" name="offer" value="${offerTitle}"${offer.accepted ? ` checked` : ``}>
      <label for="${offerTitle}-${this._id}" class="point__offers-label">
        <span class="point__offer-service">${offerTitle}</span> + €<span class="point__offer-price">${offer.price}</span>
      </label>
      `;
    }).join(``);
    this._element.querySelector(`.point__offers-wrap`).innerHTML = offers;
    this._element.querySelector(`.travel-way__toggle`).checked = false;
    this._element.querySelector(`.point__destination-label`).innerHTML = `${capitalize(this._type)} ${types.get(this._type).preposition}`;
    this.updatePrice();
  }

  /**
    * Метод для анимации shake.
    */
  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }
}
