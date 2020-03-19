const getGameAreaElement = function() {
  return document.getElementById('gameAreaWrapper');
};

const createGameAreaField = function(x, y, width, height) {
  const field = document.createElement('div');

  field.classList.add('areaField');
  field.setAttribute('id', `${x}:${y}`);
  field.style.width = width;
  field.style.height = height;

  return field;
};

const fieldIsEmpty = function(x, y, snakeParts) {
  for (let i = 0; i < snakeParts.length; i += 1) {
    if ((snakeParts[i].x === x) && (snakeParts[i].y === y)) {
      return false;
    }
  }
  return true;
};

const getFieldByCoords = function(x, y) {
  return document.getElementById(`${x}:${y}`);
};

const getClientSizes = function(el) {
  return {
    height: el.clientHeight,
    width: el.clientWidth,
  };
};

const calculateFieldSize = function(clientWidth, clientHeight) {
  let fieldHeight = 30;
  let fieldWidth = 30;

  if (clientWidth < 1000 || clientHeight < 500) {
    fieldHeight = 20;
    fieldWidth = 20;
  }

  return {
    height: `${fieldHeight}px`,
    width: `${fieldWidth}px`,
    pureHeight: fieldHeight,
    pureWidth: fieldWidth,
  };
};

const calculateAreaSize = function(clientWidth, clientHeight) {
  const fieldSizes = calculateFieldSize(clientWidth, clientHeight);
  const x = Math.floor(clientWidth / fieldSizes.pureWidth);
  const y = Math.floor(clientHeight / fieldSizes.pureHeight);

  return { x, y };
};

export {
  getGameAreaElement,
  createGameAreaField,
  fieldIsEmpty,
  getFieldByCoords,
  getClientSizes,
  calculateFieldSize,
  calculateAreaSize,
};
