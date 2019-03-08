const Unit = {
  day: 24,
  hour: 60,
  minute: 60,
  second: 1000
};

export const types = new Map([
  [`Taxi`, {
    icon: `🚕`,
    preposition: `to`,
  }],
  [`Bus`, {
    icon: `🚌`,
    preposition: `to`,
  }],
  [`Train`, {
    icon: `🚂`,
    preposition: `to`,
  }],
  [`Ship`, {
    icon: `🛳️`,
    preposition: `to`,
  }],
  [`Transport`, {
    icon: `🚊`,
    preposition: `to`,
  }],
  [`Drive`, {
    icon: `🚗`,
    preposition: `to`,
  }],
  [`Flight`, {
    icon: `✈️`,
    preposition: `to`,
  }],
  [`Check-in`, {
    icon: `🏨`,
    preposition: `at the`,
  }],
  [`Sightseeing`, {
    icon: `🏛️`,
    preposition: `in`,
  }],
  [`Restaurant `, {
    icon: `🍴`,
    preposition: `in`,
  }],
]);

export const cities = [`Amsterdam`, `Geneva`, `Chamonix`, `Helsinki`, `Tokyo`, `Sydney`];

export const places = [`airport`, `station`, `hotel`, `restaurant`, `museum`];

export const getName = (type) => {
  switch (type) {
    case `Taxi`:
      return getRandomElement(places);
    case `Check-in`:
      return `hotel`;
    default:
      return getRandomElement(cities);
  }
};

// случайное целое число [min; max]
export const getRandomInteger = (max, min = 0) => Math.floor(min + Math.random() * (max - min + 1));

// случайный индекс массива
const getRandomArrayIndex = (array) => getRandomInteger(array.length - 1);

// случайный элемент массива
export const getRandomElement = (array) => array[getRandomArrayIndex(array)];

// перемешанный массив
const getMixedArray = (array) => {
  const originalArray = array.slice(0);
  const mixedArray = [];
  for (let i = 0; i < array.length; i++) {
    const randomIndex = getRandomArrayIndex(originalArray);
    mixedArray.push(originalArray[randomIndex]);
    originalArray.splice(randomIndex, 1);
  }
  return mixedArray;
};

export const getMixedSubarray = (array, max, min = 0) => getMixedArray(array).slice(0, getRandomInteger(max, min));

// рандомный timestamp в диапазоне [текущая дата + daysFrom дней; текущая дата + daysTo дней] с точностью до минуты (в мс)
export const getRandomDate = (daysTo, daysFrom = 1) => Date.now() + getRandomInteger(daysTo * Unit.day * (Unit.hour - 1), daysFrom * Unit.day * (Unit.hour - 1)) * Unit.minute * Unit.second;

export const getTimetable = (time, duration) => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}&nbsp;&mdash; ${hours + duration < 10 ? `0${hours + duration}` : hours + duration}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

