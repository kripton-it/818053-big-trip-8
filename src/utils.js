/**
  * Вспомогательные переменные и функции.
  */

const Unit = {
  day: 24,
  hour: 60,
  minute: 60,
  second: 1000
};

/**
  * Сопоставление типа точки с иконкой и предлогом.
  */
const types = new Map([
  [`Taxi`, {
    icon: `🚕`,
    preposition: `to`,
    category: `transport`,
  }],
  [`Bus`, {
    icon: `🚌`,
    preposition: `to`,
    category: `transport`,
  }],
  [`Train`, {
    icon: `🚂`,
    preposition: `to`,
    category: `transport`,
  }],
  [`Ship`, {
    icon: `🛳️`,
    preposition: `to`,
    category: `transport`,
  }],
  [`Transport`, {
    icon: `🚊`,
    preposition: `to`,
    category: `transport`,
  }],
  [`Drive`, {
    icon: `🚗`,
    preposition: `to`,
    category: `transport`,
  }],
  [`Flight`, {
    icon: `✈️`,
    preposition: `to`,
    category: `transport`,
  }],
  [`Check-in`, {
    icon: `🏨`,
    preposition: `at the`,
    category: `hotel`,
  }],
  [`Sightseeing`, {
    icon: `🏛️`,
    preposition: `in`,
    category: `hotel`,
  }],
  [`Restaurant`, {
    icon: `🍴`,
    preposition: `in`,
    category: `hotel`,
  }],
]);

/**
  * Список городов.
  */
const cities = [`Amsterdam`, `Geneva`, `Chamonix`, `Helsinki`, `Tokyo`, `Sydney`];

/**
  * Список мест.
  */
const places = [`airport`, `station`, `hotel`, `restaurant`, `museum`];

/**
  * Функция для подбора подходящего по смыслу названия точки в зависимости от типа точки.
  * @param  {string} type - тип точки.
  * @return {string} подходящее название
  */
const getName = (type) => {
  switch (type) {
    case `Taxi`:
      return getRandomElement(places);
    case `Check-in`:
      return `hotel`;
    default:
      return getRandomElement(cities);
  }
};

/**
 * Генерирует случайное целое число [min; max]
 *
 * @param  {number} max - Верхняя граница.
 * @param  {number} min - Нижняя граница.
 * @return {number} случайное целое число [min; max].
 */
const getRandomInteger = (max, min = 0) => Math.floor(min + Math.random() * (max - min + 1));

/**
 * Возвращает случайный индекс для заданного массива.
 *
 * @param  {Array} array - массив.
 * @return {number} случайный индекс.
 */
const getRandomArrayIndex = (array) => getRandomInteger(array.length - 1);

/**
 * Возвращает случайный элемент массива.
 *
 * @param  {Array} array - массив.
 * @return {any} случайный элемент.
 */
const getRandomElement = (array) => array[getRandomArrayIndex(array)];

/**
 * Возвращает перемешанный массив.
 *
 * @param  {Array} array - массив.
 * @return {Array} перемешанный массив.
 */
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

/**
 * Возвращает перемешанный массив случайной длины [min; max].
 *
 * @param  {Array} array - массив.
 * @param  {number} max - максимальная длина возвращаемого массива.
 * @param  {number} min - минимальная длина возвращаемого массива.
 * @return {Array} перемешанный массив.
 */
const getMixedSubarray = (array, max = array.length, min = 0) => getMixedArray(array).slice(0, getRandomInteger(max, min));

/**
 * Возвращает случайную дату в диапазоне [текущая дата + daysFrom дней; текущая дата + daysTo дней] с точностью до минуты (в мс)
 *
 * @param  {number} daysTo - число недель.
 * @param  {number} daysFrom - число недель.
 * @return {timestamp} дата в формате timestamp.
 */
const getRandomDate = (daysTo, daysFrom = 1) => Date.now() + getRandomInteger(daysTo * Unit.day * (Unit.hour - 1), daysFrom * Unit.day * (Unit.hour - 1)) * Unit.minute * Unit.second;

export {types, getName, getRandomInteger, getRandomElement, getMixedSubarray, getRandomDate};
