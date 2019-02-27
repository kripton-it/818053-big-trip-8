const Unit = {
  day: 24,
  hour: 60,
  minute: 60,
  second: 1000
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

