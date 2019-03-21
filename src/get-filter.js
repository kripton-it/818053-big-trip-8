/**
  * Функция для получения шаблонной строки фильтра.
  * @param {Object} объект с данными
  * @return  {string} шаблонная строка
  */
export default ({caption, isChecked = false}) => {
  const checkedAttribute = isChecked ? ` checked` : ``;
  const value = caption.toLowerCase();
  const idAttribute = `filter-${value}`;
  return `
  <input type="radio" id="${idAttribute}" name="filter" value="${value}"${checkedAttribute}>
  <label class="trip-filter__item" for="${idAttribute}">${caption}</label>
`;
};

