const useCreateField = ({ widthField, heightField }) => {
  let fieldArr = new Array(heightField); // двумерный массив игрового поля
  for (let i = 0; i < fieldArr.length; i++) {
    fieldArr[i] = new Array(widthField).fill(0);
  }

  return fieldArr;
};

export { useCreateField };
