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

  static fieldIsEmpty(x, y, snake) {
    for (let i = 0; i < snake.parts.length; i++) {
      if ((snake.parts[i].x === x) && (snake.parts[i].y === y)) {
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
