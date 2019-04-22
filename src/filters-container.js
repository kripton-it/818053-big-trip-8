import Component from './component.js';

/**
  * Класс контейнера фильтров.
  */
export default class FiltersContainer extends Component {
  /**
   * Создает экземпляр FiltersContainer.
   *
   * @constructor
   * @param {Object} filters - массив объектов с данными фильтров
   * @this  {FiltersContainer}
   */
  constructor(filters) {
    super();
    this._filters = filters;
    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  /**
   * Сеттер для передачи колбэка при выборе фильтра.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onFilter(fn) {
    this._onFilter = fn;
  }

  /**
   * Геттер для получения шаблонной строки со всеми фильтрами.
   *
   * @return {string} шаблонная строка
   */
  get template() {
    return this._filters.map(this._filterTemplate).join(``);
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
   * Метод для получения шаблонной строки одного фильтра.
   * @param {Object} filter - объект с данными фильтра
   * @return {string} шаблонная строка
   */
  _filterTemplate(filter) {
    const checkedAttribute = filter.isChecked ? ` checked` : ``;
    const value = filter.caption.toLowerCase();
    const idAttribute = `filter-${value}`;
    return `<input type="radio" id="${idAttribute}" name="filter" value="${value}"${checkedAttribute}>
    <label class="trip-filter__item" for="${idAttribute}">${filter.caption}</label>`;
  }

  /**
    * Метод для навешивания обработчиков.
    */
  _createListeners() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  /**
    * Метод для удаления обработчиков.
    */
  _removeListeners() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }

  /**
   * Метод-обработчик нажатия на фильтр.
   * @param {Object} evt - объект события Event
   */
  _onFilterClick(evt) {
    evt.preventDefault();
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }
}
