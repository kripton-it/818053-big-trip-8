import Component from './component.js';

/**
  * Класс контейнера для сортировки.
  */
export default class SortingContainer extends Component {
  /**
   * Создает экземпляр SortingContainer.
   *
   * @constructor
   * @param {Object} sortings - массив объектов с данными-параметрами сортировки
   * @this  {SortingContainer}
   */
  constructor(sortings) {
    super();
    this._sortings = sortings;
    this._onSort = null;
    this._onSortClick = this._onSortClick.bind(this);
  }

  /**
   * Метод-обработчик нажатия на параметр сортировки.
   * @param {Object} evt - объект события Event
   */
  _onSortClick(evt) {
    evt.preventDefault();
    if (typeof this._onSort === `function`) {
      this._onSort(evt);
    }
  }

  /**
   * Сеттер для передачи колбэка при выборе параметра сортировки.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onSort(fn) {
    this._onSort = fn;
  }

  /**
   * Метод для получения шаблонной строки одного параметра сортировки.
   * @param {Object} sorting - объект с данными параметра сортировки
   * @return {string} шаблонная строка
   */
  _sortingTemplate(sorting) {
    const checkedAttribute = sorting.isChecked ? ` checked` : ``;
    const value = sorting.caption;
    const idAttribute = `sorting-${value}`;
    return `<input type="radio" name="trip-sorting" id="${idAttribute}" value="${value}"${checkedAttribute}>
    <label class="trip-sorting__item trip-sorting__item--${value}" for="${idAttribute}">${value}</label>`;
  }

  /**
   * Геттер для получения шаблонной строки со всеми параметрами сортировки.
   *
   * @return {string} шаблонная строка
   */
  get template() {
    return `${this._sortings.map(this._sortingTemplate).join(``)}
    <span class="trip-sorting__item trip-sorting__item--offers">Offers</span>`;
  }

  /**
   * Метод для создания DOM-элемента по шаблону.
   * Также навешивает все необходимые обработчики.
   *
   * @param {object} container
   * @return {object} DOM-элемент
   */
  render(container) {
    container.innerHTML = this.template;
    this._element = container;
    this._createListeners();
    return this._element;
  }

  /**
    * Метод для навешивания обработчиков.
    */
  _createListeners() {
    this._element.addEventListener(`click`, this._onSortClick);
  }

  /**
    * Метод для удаления обработчиков.
    */
  _removeListeners() {
    this._element.removeEventListener(`click`, this._onSortClick);
  }
}
