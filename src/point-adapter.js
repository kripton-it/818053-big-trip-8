/**
  * Класс-адаптер для точки.
  */
export default class PointAdapter {
  /**
   * Создает экземпляр PointAdapter.
   *
   * @constructor
   * @param {Object} point - объект с данными, пришедший с сервера
   * @this {ModelTask}
   */
  constructor(point) {
    this.id = point.id;
    this.type = point.type;
    this.dateFrom = Math.floor(point[`date_from`] / 60000) * 60000 || null;
    this.dateTo = Math.floor(point[`date_to`] / 60000) * 60000 || null;
    this.basePrice = point[`base_price`];
    this.isFavorite = Boolean(point[`is_favorite`]);
    this.offers = point.offers;
    this.name = point.destination.name;
    this.description = point.destination.description;
    this.photos = point.destination.pictures;
  }

  /**
   * Метод для преобразования в формат, понятный серверу.
   * @return {object} - преобразованный объект
   */
  toRAW() {
    console.log(`toRAW`);
    const name = this.name;
    const description = this.description;
    const pictures = this.photos;
    return {
      'id': this.id,
      'type': this.type,
      'date_from': this.dateFrom,
      'date_to': this.dateTo,
      'destination': {name, description, pictures},
      'base_price': this.basePrice,
      'is_favorite': this.isFavorite,
      'offers': this.offers,
    };
  }

  /**
   * Статический метод для преобразования одной точки.
   * @param {Object} point - исходный объект с данными, пришедший с сервера
   * @return {object} - преобразованный объект
   */
  static parsePoint(point) {
    return new PointAdapter(point);
  }

  /**
   * Статический метод для преобразования массива точек.
   * @param {Array} points - массив с исходными объектами, пришедший с сервера
   * @return {Array} - массив преобразованных объектов
   */
  static parsePoints(points) {
    return points.map(PointAdapter.parsePoint);
  }
}
