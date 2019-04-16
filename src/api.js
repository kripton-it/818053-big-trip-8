import PointAdapter from './point-adapter.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

/**
 * функция для проверки статуса ответа
 * @param {Object} response - объект, полученный с сервера
 * @return {Object} response
 */
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

/**
 * функция для конвертации ответа сервера в JSON формат
 * @param {Object} response - объект, полученный с сервера
 * @return {Object} конвертированный в JSON формат объект
 */
const toJSON = (response) => {
  return response.json();
};

/**
  * Класс для работы с сервером.
  */
export default class API {
  /**
   * Создает экземпляр API.
   *
   * @constructor
   * @param {string} endPoint - URL сервера
   * @param {string} authorization - код авторизации
   * @this {API}
   */
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  /**
   * Метод для получения точек с сервера.
   * @return {Array} - массив объектов класса PointAdapter
   */
  getPoints() {
    return this._load({url: `points`}).then(toJSON).then(PointAdapter.parsePoints);
  }

  /**
   * Метод для получения направлений с сервера.
   * @return {Array} - массив объектов
   */
  getDestinations() {
    return this._load({url: `destinations`}).then(toJSON);
  }

  /**
   * Метод для получения предложений с сервера.
   * @return {Array} - массив объектов
   */
  getOffers() {
    return this._load({url: `offers`}).then(toJSON);
  }

  /**
   * Метод для записи новой точки на сервер.
   * @param {object} - объект с данными.
   * @return {PointAdapter} - объект класса PointAdapter.
   */
  createPoint({data}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    }).then(toJSON).then(PointAdapter.parsePoint);
  }

  /**
   * Метод для обновления точки на сервер.
   * @param {object} - объект с данными.
   * @return {PointAdapter} - объект класса PointAdapter.
   */
  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    }).then(toJSON).then(PointAdapter.parsePoint);
  }

  /**
   * Метод для удаления точки на сервере.
   * @param {object} - объект с данными.
   * @return {Promise}.
   */
  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  /**
   * Универсальный метод для обращения к серверу.
   * @param {Object} объект с параметрами.
   * @return {Promise}.
   */
  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
    .then(checkStatus)
    .catch((err) => {
      window.console.error(`fetch error: ${err}`);
      throw err;
    });
  }
}
