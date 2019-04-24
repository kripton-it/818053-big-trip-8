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
    this.id = point.id || null;
    this.type = point.type || ``;
    this.dateFrom = Math.floor(point[`date_from`] / 60000) * 60000 || null;
    this.dateTo = Math.floor(point[`date_to`] / 60000) * 60000 || null;
    this.basePrice = point[`base_price`] || 0;
    this.isFavorite = Boolean(point[`is_favorite`]) || false;
    this.offers = point.offers || [];
    this.name = point.destination.name || ``;
    this.description = point.destination.description || ``;
    this.photos = point.destination.pictures || [];
  }

  /**
   * Статический метод для преобразования в формат, понятный серверу.
   * @param {Object} point - объект, который нужно преобразовать
   * @return {object} - преобразованный объект
   */
  static toRAW(point) {
    const name = point.destination.name || ``;
    const description = point.destination.description || ``;
    const pictures = point.destination.photos || [];
    return {
      'id': point.id || null,
      'type': point.type,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'destination': {name, description, pictures},
      'base_price': point.price,
      'is_favorite': point.isFavorite,
      'offers': point.offers,
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
