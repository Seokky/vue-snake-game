/* eslint-disable consistent-return */
export default {
  data() {
    return {
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
    };
  },
  methods: {
    /* draws only a head yet */
    drawSnake() {
      const field = this.getSnakeHeadField();

      field.style.backgroundColor = this.snake.color;
      field.style.backgroundImage = 'url(\'/logo.png\')';
      field.style.backgroundSize = '80% 80%';
      field.style.backgroundRepeat = 'no-repeat';
      field.style.backgroundPosition = 'center center';

      switch (this.snake.direction) {
        case 'up':
          field.style.transform = 'rotate(180deg)';
          break;
        case 'down':
          field.style.transform = 'rotate(360deg)';
          break;
        case 'left':
          field.style.transform = 'rotate(90deg)';
          break;
        case 'right':
          field.style.transform = 'rotate(-90deg)';
          break;
        default:
          break;
      }

      if (this.isSnakeOnMeat()) {
        field.classList.remove('meatField');
        this.drawMeatField();
      }
    },
    getSnakeHeadField() {
      return document.getElementById(`${this.snake.head.x}:${this.snake.head.y}`);
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
    changeSnakeDirection(direction) {
      if (!this.snake.isRunning) return false;

      this.snake.direction = direction;
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
  },
};
