import {types, getRandomInteger, getRandomElement, getMixedSubarray, getRandomDate, getName} from './utils.js';

const config = {
  date: {
    daysForward: 30,
  },
  durationHours: {
    MIN: 1,
    MAX: 12,
  },
  price: {
    regular: {
      MIN: 10,
      MAX: 200,
      STEP: 10,
    },
    offer: {
      MIN: 10,
      MAX: 50,
      STEP: 5,
    },
  },
  photos: {
    MIN: 1,
    MAX: 5,
  },
};

const offers = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`];

const descriptionSource = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

/**
  * Функция для генерации объекта с данными для одной точки маршрута.
  * @return {Object} объект с данными
  */
const generatePoint = () => {
  const type = getRandomElement([...types.keys()]);
  const name = getName(type);
  const description = `${getMixedSubarray(descriptionSource.split(`. `), 3, 1).join(`. `)}.`.replace(`..`, `.`);
  return {
    description,
    type,
    name,
    // дата начала (в мс)
    date: getRandomDate(config.date.daysForward),
    // длительность (в часах)
    duration: getRandomInteger(config.durationHours.MAX, config.durationHours.MIN),
    price: config.price.regular.STEP * getRandomInteger(config.price.regular.MAX / config.price.regular.STEP, config.price.regular.MIN / config.price.regular.STEP),
    offers: getMixedSubarray(offers, 2).map((offer) => ({
      caption: offer,
      price: config.price.offer.STEP * getRandomInteger(config.price.offer.MAX / config.price.offer.STEP, config.price.offer.MIN / config.price.offer.STEP),
    })),
    photos: (new Array(getRandomInteger(config.photos.MAX, config.photos.MIN))).fill(``).map(() => `http://picsum.photos/300/150?r=${Math.random()}`),
  };
};

/**
  * Функция для получения массива заданной длины с данными для точек маршрута.
  * @param {number} number - число точек маршрута
  * @return {Array} массив объектов
  */
export default (number) => (new Array(number)).fill(``).map(() => generatePoint());


