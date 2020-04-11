class DOM {
  static getGameAreaElement() {
    return document.getElementById('gameAreaWrapper');
  }

  static createGameAreaField(x, y, width, height) {
    const field = document.createElement('div');

    field.classList.add('areaField');
    field.setAttribute('id', `${x}:${y}`);
    field.style.width = width;
    field.style.height = height;

    return field;
  }

  static fieldIsEmpty(x, y, snakeParts) {
    for (let i = 0; i < snakeParts.length; i += 1) {
      if ((snakeParts[i].x === x) && (snakeParts[i].y === y)) {
        return false;
      }
    }
    return true;
  }

  static getFieldByCoords(x, y) {
    return document.getElementById(`${x}:${y}`);
  }
}

export default DOM;
