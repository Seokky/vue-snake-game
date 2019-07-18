<template lang="pug">
  section#gameAreaWrapper
</template>

<script>
/* eslint-disable consistent-return */
export default {
  data() {
    return {
      areaSize: {
        x: 30,
        y: 30,
      },
      snake: {
        size: 1,
        color: 'coral',
        head: {
          x: 5,
          y: 5,
        },
        parts: [],
      },
    };
  },
  computed: {
    clientHeight() {
      const area = document.getElementById('gameAreaWrapper');
      return area.clientHeight;
    },
    clientWidth() {
      const area = document.getElementById('gameAreaWrapper');
      return area.clientWidth;
    },
    fieldSize() {
      const fieldHeight = ((this.clientHeight - 30) / 30).toFixed(2);
      const fieldWidth = ((this.clientWidth) / 30).toFixed(2);

      return {
        height: `${fieldHeight}px`,
        width: `${fieldWidth}px`,
      };
    },
  },
  mounted() {
    this.createGameArea();
    this.drawSnake();

    document.addEventListener('keydown', () => { this.onKeyDown(event); });
  },
  methods: {
    createGameArea() {
      const area = document.getElementById('gameAreaWrapper');

      for (let y = 1; y <= this.areaSize.y; y++) {
        for (let x = 1; x <= this.areaSize.x; x++) {
          this.createGameAreaField(x, y, area);
        }
      }
    },
    createGameAreaField(x, y, area) {
      const field = document.createElement('div');

      field.classList.add('areaField');
      field.setAttribute('id', `${x}:${y}`);
      field.style.width = this.fieldSize.width;
      field.style.height = this.fieldSize.height;

      area.appendChild(field);
    },
    getSnakeHeadField() {
      return document.getElementById(`${this.snake.head.x}:${this.snake.head.y}`);
    },
    /* draws only a head yet */
    drawSnake() {
      const field = this.getSnakeHeadField();

      field.style.backgroundColor = this.snake.color;
    },
    removeCurrentHeadPosition() {
      const head = this.getSnakeHeadField();
      head.style.backgroundColor = 'inherit';
    },
    moveUp() {
      if (this.snake.head.y === 1) {
        this.snake.head.y = this.areaSize.y;
      } else {
        this.snake.head.y -= 1;
      }
      this.drawSnake();
    },
    moveDown() {
      if (this.snake.head.y === this.areaSize.y) {
        this.snake.head.y = 1;
      } else {
        this.snake.head.y += 1;
      }
      this.drawSnake();
    },
    moveLeft() {
      if (this.snake.head.x === 1) {
        this.snake.head.x = this.areaSize.x;
      } else {
        this.snake.head.x -= 1;
      }
      this.drawSnake();
    },
    moveRight() {
      if (this.snake.head.x === this.areaSize.x) {
        this.snake.head.x = 1;
      } else {
        this.snake.head.x += 1;
      }
      this.drawSnake();
    },
    onKeyDown(event) {
      const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (!directions.includes(event.key)) {
        return false;
      }

      this.removeCurrentHeadPosition();
      switch (event.key) {
        case 'ArrowUp':
          this.moveUp();
          break;
        case 'ArrowDown':
          this.moveDown();
          break;
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'ArrowRight':
          this.moveRight();
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss">
#gameAreaWrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .areaField {
    display: block;
    box-shadow: inset 0px 0px 2px rgba(0,0,0,.7);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
