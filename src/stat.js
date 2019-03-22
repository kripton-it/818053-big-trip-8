import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const statControl = document.querySelector(`.view-switch__item[href="#stats"]`);
const statContainer = document.querySelector(`.statistic`);

/**
 * обработчик нажатия на кнопку Statistic
 * @param {Object} evt - массив объектов с данными о фильтрах
 */
const onStatControlClick = (evt) => {
  evt.preventDefault();
  document.querySelector(`main`).classList.toggle(`visually-hidden`);
  statContainer.classList.toggle(`visually-hidden`);
};

statControl.addEventListener(`click`, onStatControlClick);

// const moneyCtx = document.querySelector(`.statistic__money`);
// const transportCtx = document.querySelector(`.statistic__transport`);
// const timeSpendCtx = document.querySelector(`.statistic__time-spend`);

/**
 * функция, генерирующая данные для диаграммы
 * @param {Array} array - массив объектов с данными
 * @return {Array} - массив с данными для диаграммы
 */
const getDataForChart = (array) => array.reduce((acc, element) => {
  const currentValue = element.type;
  const newAcc = acc;
  const target = newAcc.find((item) => item.type === currentValue);
  if (target) {
    target.total += element.price;
    target.count++;
  } else {
    newAcc.push({type: currentValue, total: element.price, count: 1});
  }
  return newAcc;
}, []);

/**
 * функция для отрисовки диаграммы
 * @param {Object} config - объект с параметрами
 * @return {Chart} экземпляр класса Chart с заданными параметрами
 */
const renderChart = (config) => {
  // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
  const BAR_HEIGHT = 55;
  config.target.height = BAR_HEIGHT * config.labels.length;
  // transportCtx.height = BAR_HEIGHT * 4;
  // timeSpendCtx.height = BAR_HEIGHT * 4;

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
          formatter: (val) => `${config.prefix}${val}`
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
};
/*
const transportChart = new Chart(transportCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: [`🚗 DRIVE`, `🚕 RIDE`, `✈️ FLY`, `🛳️ SAIL`],
    datasets: [{
      data: [4, 3, 2, 1],
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
        formatter: (val) => `${val}x`
      }
    },
    title: {
      display: true,
      text: `TRANSPORT`,
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
*/
export {getDataForChart, renderChart};
