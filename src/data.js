import {getRandomInteger, getRandomElement, getMixedSubarray, getRandomDate} from './utils.js';

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

const titles = [`Taxi to Airport`, `Flight to Geneva`, `Check into hotel`, `Supper at restaurant`];

const offers = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`];

export const types = new Map([
  [`Taxi`, `🚕`],
  [`Bus`, `🚌`],
  [`Train`, `🚂`],
  [`Ship`, `🛳️`],
  [`Transport`, `🚊`],
  [`Drive`, `🚗`],
  [`Flight`, `✈️`],
  [`Check-in`, `🏨`],
  [`Sightseeing`, `🏛️`],
  [`Restaurant `, `🍴`],
]);

const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

export const generatePoint = () => ({
  title: getRandomElement(titles),
  description: `${getMixedSubarray(description.split(`. `), 3, 1).join(`. `)}.`.replace(`..`, `.`),
  type: getRandomElement([...types.keys()]),
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
});

