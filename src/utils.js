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
  [`taxi`, {
    icon: `🚕`,
    preposition: `to`,
  }],
  [`bus`, {
    icon: `🚌`,
    preposition: `to`,
  }],
  [`train`, {
    icon: `🚂`,
    preposition: `to`,
  }],
  [`flight`, {
    icon: `✈️`,
    preposition: `to`,
  }],
  [`check-in`, {
    icon: `🏨`,
    preposition: `at the`,
  }],
  [`sightseeing`, {
    icon: `🏛️`,
    preposition: `in`,
  }],
]);

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

const getDuration = (interval) => {
  const seconds = Math.floor(interval / 1000);
  const totalMinutes = Math.floor(seconds / 60);
  if (totalMinutes < 60) {
    return `${totalMinutes < 10 ? `0${totalMinutes}` : totalMinutes}M`;
  }
  const totalhours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (totalhours < 24) {
    return `${totalhours < 10 ? `0${totalhours}` : totalhours}H ${minutes < 10 ? `0${minutes}` : minutes}M`;
  }
  const hours = totalhours % 24;
  const days = Math.floor(totalhours / 24);
  return `${days < 10 ? `0${days}` : days}D ${hours < 10 ? `0${hours}` : hours}H ${minutes < 10 ? `0${minutes}` : minutes}M`;
};

const capitalize = (word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`;

export {types, getDuration, capitalize, getRandomInteger, getRandomElement, getMixedSubarray, getRandomDate};
