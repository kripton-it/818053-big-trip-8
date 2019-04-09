/**
  * Абстрактный класс, родитель любого компонента.
  */
export default class Component {
  /**
   * Создает экземпляр Component.
   *
   * @constructor
   * @this  {Component}
   */
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }
    this._element = null;
    this._state = {};
  }

  /**
   * Геттер для получения DOM-элемента компонента.
   *
   * @return  {object} DOM-элемент
   */
  get element() {
    return this._element;
  }

  /**
   * Геттер для получения шаблонной строки компонента.
   */
  get template() {
    throw new Error(`You have to define template.`);
  }

  /**
    * Метод для навешивания необходимых обработчиков.
    */
  _createListeners() {}

  /**
    * Метод для удаления обработчиков.
    */
  _removeListeners() {}

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
    return this._element;
  }

  /**
   * Метод для удаления DOM-элемента.
   * Также удаляет все обработчики.
   */
  unrender() {
    this._removeListeners();
    this._element = null;
  }

  /**
    * Абстрактный метод для обновления каждого компонента.
    */
  update() {}
}
