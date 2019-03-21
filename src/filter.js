import Component from './component.js';

/**
  * Класс фильтра.
  */
export default class Filter extends Component {
  /**
   * Создает экземпляр Filter.
   *
   * @constructor
   * @param {Object} filter - объект с данными фильтра
   * @this  {Filter}
   */
  // export default ({caption, amount, isDisabled = false, isChecked = false})
  constructor(filter) {
    super();
    this._caption = filter.caption;
    this._state.isChecked = filter.isChecked || false;
    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
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

  /**
   * Сеттер для передачи колбэка при выборе фильтра.
   * @param {Function} fn - передаваемая функция-колбэк
   */
  set onFilter(fn) {
    this._onFilter = fn;
  }

  /**
   * Геттер для получения шаблонной строки фильтра.
   *
   * @return  {string} шаблонная строка
   */
  get template() {
    const checkedAttribute = this._state.isChecked ? ` checked` : ``;
    const value = this._caption.toLowerCase();
    const idAttribute = `filter-${value}`;
    return `<span>
    <input type="radio" id="${idAttribute}" name="filter" value="${value}"${checkedAttribute}>
    <label class="trip-filter__item" for="${idAttribute}">${this._caption}</label>
    </span>`;
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
}
