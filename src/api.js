import PointAdapter from './point-adapter.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

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
   * @return {Array} - массив объектов // ** класса ModelTask ** //.
   */
  getPoints() {
    return this._load({url: `points`}).then(toJSON).then(PointAdapter.parsePoints);
  }

  /**
   * Метод для получения направлений с сервера.
   * @return {Array} - массив объектов // ** класса ModelTask ** //.
   */
  getDestinations() {
    // return this._load({url: `points`}).then(toJSON).then(ModelTask.parseTasks);
    return this._load({url: `destinations`}).then(toJSON);
  }

  /**
   * Метод для получения предложений с сервера.
   * @return {Array} - массив объектов // ** класса ModelTask ** //.
   */
  getOffers() {
    // return this._load({url: `points`}).then(toJSON).then(ModelTask.parseTasks);
    return this._load({url: `offers`}).then(toJSON);
  }

  /**
   * Метод для записи нового таска на сервер.
   * @param {object} - таск.
   * @return {Array} - объект класса ModelTask.
   */
  createTask({task}) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': `application/json`})
    // }).then(toJSON).then(ModelTask.parseTask);
    }).then(toJSON);
  }

  /**
   * Метод для обновления точки на сервер.
   * @param {number} id - идентификатор.
   * @param {object} - точка.
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
   * @param {number} id - идентификатор.
   * @return {Promise}.
   */
  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  /**
   * Метод для обращения к серверу.
   * @param {Object} объект с параметрами.
   * @return {Promise}.
   */
  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        // console.error(`fetch error: ${err}`);
        throw err;
      });
  }
}
