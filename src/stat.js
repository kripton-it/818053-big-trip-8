import {types} from './utils.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 55;

/**
 * функция, генерирующая данные для диаграммы
 * @param {Array} array - массив объектов с данными
 * @return {Array} - массив с данными для диаграммы
 */
const getData = (array) => array.reduce((acc, element) => {
  const currentValue = element.type;
  const newAcc = acc;
  const target = newAcc.find((item) => item.type === currentValue);
  const elementPrice = element.basePrice + element.offers.filter((offer) => offer.accepted).reduce((accum, offer) => accum + offer.price, 0);
  const elementDuration = element.dateTo - element.dateFrom;
  if (target) {
    target.total += elementPrice;
    target.count++;
    target.duration += elementDuration;
  } else {
    newAcc.push({type: currentValue, total: elementPrice, count: 1, duration: elementDuration});
  }
  return newAcc;
}, []);

/**
  * Класс для отрисовки статистики.
  */
export default class Stat {
  /**
   * Создает экземпляр Stat.
   *
   * @constructor
   * @param {Object} points - массив с точками
   * @this  {Stat}
   */
  constructor(points) {
    this._points = points;
    this._element = [];
    this._config = [];
  }

  /**
   * Метод для генерации конфигов диаграмм.
   * @return {Array} массив объектов-конфигов для диаграмм
   */
  _getConfig() {
    const data = getData(this._points);
    const money = [...data].sort((first, second) => second.total - first.total);
    const transport = [...data].filter((it) => types.get(it.type).category === `transport`).sort((first, second) => second.count - first.count);
    const duration = [...data].sort((first, second) => second.duration - first.duration);
    const moneyConfig = {
      target: document.querySelector(`.statistic__money`),
      type: `money`,
      labels: money.map((it) => `${types.get(it.type).icon} ${it.type.toUpperCase()}`),
      dataSet: money.map((it) => it.total),
      formatter: (val) => `€ ${val}`
    };
    const transportConfig = {
      target: document.querySelector(`.statistic__transport`),
      type: `transport`,
      labels: transport.map((it) => `${types.get(it.type).icon} ${it.type.toUpperCase()}`),
      dataSet: transport.map((it) => it.count),
      formatter: (val) => `x${val}`
    };
    const durationConfig = {
      target: document.querySelector(`.statistic__time-spend`),
      type: `time spent`,
      labels: duration.map((it) => `${types.get(it.type).icon} ${it.type.toUpperCase()}`),
      dataSet: duration.map((it) => it.duration),
      formatter: (val) => {
        const totalHours = Math.round(val / 3600000);
        if (totalHours < 24) {
          return `${totalHours} H`;
        }
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;
        return `${days} D, ${hours} H`;

      }
    };
    this._config = [moneyConfig, transportConfig, durationConfig];
    return this._config;
  }

  /**
   * Метод для отрисовки статистики.
   */
  render() {
    this._getConfig();
    this._config.forEach((config) => {
      this._element.push(this._renderChart(config));
    });
  }

  /**
 * метод для отрисовки одной диаграммы
 * @param {Object} config - объект с параметрами
 * @return {Chart} экземпляр класса Chart с заданными параметрами
 */
  _renderChart(config) {
    config.target.height = BAR_HEIGHT * config.labels.length;
    const chart = new Chart(config.target, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: config.labels,
        datasets: [{
          data: config.dataSet,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: config.formatter
          }
        },
        title: {
          display: true,
          text: config.type.toUpperCase(),
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
    return chart;
  }

  /**
   * Метод для обновления одной диаграммы.
   * @param {Object} chart - объект с диаграммой
   * @param {Object} config - объект с параметрами
   */
  _updateChart(chart, config) {
    chart.data.labels = config.labels;
    chart.data.datasets.data = config.dataSet;
    chart.update();
  }

  /**
   * Метод для обновления статистики.
   * @param {Array} points - массив точек
   */
  update(points) {
    this._points = points;
    const configs = this._getConfig();
    configs.forEach((config, index) => {
      this._updateChart(this._element[index], config);
    });
  }

  /**
   * Метод для удаления статистики.
   */
  clear() {
    this._element.forEach((element) => {
      element.destroy();
    });
  }
}
