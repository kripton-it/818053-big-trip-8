/**
  * Вспомогательные переменные и функции.
  */

/**
  * Сопоставление типа точки с иконкой и предлогом.
  */
const types = new Map([
  [`taxi`, {
    icon: `🚕`,
    preposition: `to`,
    category: `transport`
  }],
  [`bus`, {
    icon: `🚌`,
    preposition: `to`,
    category: `transport`
  }],
  [`train`, {
    icon: `🚂`,
    preposition: `to`,
    category: `transport`
  }],
  [`flight`, {
    icon: `✈️`,
    preposition: `to`,
    category: `transport`
  }],
  [`check-in`, {
    icon: `🏨`,
    preposition: `at the`,
    category: `place`
  }],
  [`sightseeing`, {
    icon: `🏛️`,
    preposition: `in`,
    category: `place`
  }],
]);

/**
 * Форматирование длительности точки.
 *
 * @param  {Array} interval - время в мс.
 * @return {string} форматированная строка.
 */
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

/**
 * Функция, возвращающая слово с заглавной буквы.
 *
 * @param  {string} word - слово.
 * @return {string} слово с большой буквы.
 */
const capitalize = (word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`;

export {types, getDuration, capitalize};
