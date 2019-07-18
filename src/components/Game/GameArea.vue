<template lang="pug">
  section#gameAreaWrapper
</template>

<script>
/* eslint-disable consistent-return */
import Random from '@/classes/Random';

export default {
  data() {
    return {
      area: {
        element: null,
        size: {
          x: 30,
          y: 30,
        },
      },
      snake: {
        isRunning: false,
        size: 1,
        color: 'coral',
        speed: 150,
        direction: 'right',
        head: {
          x: 5,
          y: 5,
        },
        parts: [],
      },
      meat: {
        colors: [
          'yellow',
          'white',
          'brown',
          'purple',
        ],
        color: null,
        coords: {
          x: null,
          y: null,
        },
      },
      interval: null,
    };
  },
  computed: {
    clientHeight() {
      return this.area.element.clientHeight;
    },
    clientWidth() {
      return this.area.element.clientWidth;
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
    this.getGameAreaElement();
    this.createGameArea();
    this.drawSnake();

    document.addEventListener('keyup', () => { this.onKeyUp(event); });

    this.drawMeatField();
  },
  methods: {
    drawMeatField() {
      this.meat.color = this.meat.colors[Random.getRandomNumber(0, this.meat.colors.length - 1)];
      this.meat.coords.x = Random.getRandomNumber(1, this.area.size.x);
      this.meat.coords.y = Random.getRandomNumber(1, this.area.size.y);

      const field = document.getElementById(`${this.meat.coords.x}:${this.meat.coords.y}`);
      field.classList.add('areaField', 'meatField');
      field.style.backgroundColor = this.meat.color;
    },
    createGameArea() {
      for (let y = 1; y <= this.area.size.y; y++) {
        for (let x = 1; x <= this.area.size.x; x++) {
          this.createGameAreaField(x, y, this.area.element);
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
    getGameAreaElement() {
      this.area.element = document.getElementById('gameAreaWrapper');
    },
    getSnakeHeadField() {
      return document.getElementById(`${this.snake.head.x}:${this.snake.head.y}`);
    },
    /* draws only a head yet */
    drawSnake() {
      const field = this.getSnakeHeadField();

      field.style.backgroundColor = this.snake.color;
      field.style.backgroundImage = 'url(\'/logo.png\')';
      field.style.backgroundSize = '80% 80%';
      field.style.backgroundRepeat = 'no-repeat';
      field.style.backgroundPosition = 'center center';

      if (this.isSnakeOnMeat()) {
        field.classList.remove('meatField');
        this.drawMeatField();
      }
    },
    isSnakeOnMeat() {
      return ((this.snake.head.x === this.meat.coords.x) && (this.snake.head.y === this.meat.coords.y));
    },
    removeCurrentHeadPosition() {
      const head = this.getSnakeHeadField();
      head.style.backgroundColor = 'inherit';
      head.style.backgroundImage = 'none';
    },
    toggleSnakeRunning() {
      this.snake.isRunning = !this.snake.isRunning;
      if (!this.snake.isRunning) {
        clearInterval(this.interval);
      }
      this.snakeMovingLoop();
    },
    snakeMovingLoop() {
      if (!this.snake.isRunning) return false;

      this.interval = setInterval(() => {
        this.removeCurrentHeadPosition();

        switch (this.snake.direction) {
          case 'up':
            this.moveUp();
            break;
          case 'down':
            this.moveDown();
            break;
          case 'left':
            this.moveLeft();
            break;
          case 'right':
            this.moveRight();
            break;
          default:
            break;
        }
      }, this.snake.speed);
    },
    moveUp() {
      if (this.snake.head.y === 1) {
        this.snake.head.y = this.area.size.y;
      } else {
        this.snake.head.y -= 1;
      }
      this.drawSnake();
    },
    moveDown() {
      if (this.snake.head.y === this.area.size.y) {
        this.snake.head.y = 1;
      } else {
        this.snake.head.y += 1;
      }
      this.drawSnake();
    },
    moveLeft() {
      if (this.snake.head.x === 1) {
        this.snake.head.x = this.area.size.x;
      } else {
        this.snake.head.x -= 1;
      }
      this.drawSnake();
    },
    moveRight() {
      if (this.snake.head.x === this.area.size.x) {
        this.snake.head.x = 1;
      } else {
        this.snake.head.x += 1;
      }
      this.drawSnake();
    },
    changeSnakeDirection(direction) {
      if (!this.snake.isRunning) return false;

      this.snake.direction = direction;
    },
    onKeyUp(event) {
      const codes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
      if (!codes.includes(event.code)) {
        return false;
      }

      switch (event.code) {
        case 'Space':
          this.toggleSnakeRunning();
          break;
        case 'ArrowUp':
          this.changeSnakeDirection('up');
          break;
        case 'ArrowDown':
          this.changeSnakeDirection('down');
          break;
        case 'ArrowLeft':
          this.changeSnakeDirection('left');
          break;
        case 'ArrowRight':
          this.changeSnakeDirection('right');
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
  }
  .meatField {
    display: block;
    border-radius: 100px;
    box-shadow: none;
  }
}
</style>
