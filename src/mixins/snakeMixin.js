import DOM from '@/classes/DOM';

/* eslint-disable consistent-return */
export default {
  data() {
    return {
      changingDirectionALlowed: true,
      snake: {
        isRunning: false,
        speed: 150,
        speedGradeNumber: 1,
        speedGradeValue: 15,
        direction: 'right',
        parts: [{ x: 5, y: 5 }],
      },
    };
  },
  watch: {
    /* Make small input processing frequency, because in other case
    player can quickly press different arrow buttons and each of them
    will change the snake direction. The problem is conditions of
    changeSnakeDirection() function, that will correctly change the direction
    (from their point of view), but tick of startGameLoop() function is
    too rarely coming, so it will be process only the last imposed direction
    that can be opposite for last direction approved by startGameLoop() function */
    changingDirectionALlowed(val) {
      if (!val) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.changingDirectionALlowed = true;
          }, this.snake.speed);
        });
      }
    },
  },
  methods: {
    drawSnake() {
      /* drawing each part of snake */
      for (let i = 0; i < this.snake.parts.length; i++) {
        const field = this.getSnakeBodyPart(i);
        if (i > 0) {
          field.classList.add('snakePart');
        } else {
          field.classList.add('snakeHead');
        }
      }

      if (this.isSnakeOnMeat()) {
        this.increasePlayerScore();
        this.removeMeatFromField();
        this.drawNewMeatField();
        this.addSnakeBodyPart();
      }

      if (this.isSnakeOnItself()) {
        this.stopTheGame();
      }
    },
    increasePlayerScore() {
      this.score.reached += this.score.cost;
    },
    isSnakeOnItself() {
      const snakeHead = this.getSnakeHeadField();

      return snakeHead.classList.value.includes('snakePart');
    },
    getSnakeBodyPart(n) {
      return DOM.getFieldByCoords(this.snake.parts[n].x, this.snake.parts[n].y);
    },
    getSnakeHeadField() {
      return DOM.getFieldByCoords(this.snake.parts[0].x, this.snake.parts[0].y);
    },
    playPauseGame() {
      this.snake.isRunning = !this.snake.isRunning;
      /* stoping the game loop */
      if (!this.snake.isRunning) {
        clearInterval(this.interval);
      }
      this.startGameLoop();
    },
    startGameLoop() {
      if (!this.snake.isRunning) return false;

      this.interval = setInterval(() => {
        this.moveSnake();
      }, this.snake.speed);
    },
    gradeSpeedIfBoundaryAchieved(reachedScore) {
      const { nextBreakpoint } = this.score;

      /* if reached score achieved the boundary of the next breakpoint */
      if (reachedScore >= this.score.breakpoints[nextBreakpoint].boundary) {
        /* if that breakpoint don't passed yet */
        if (!this.score.breakpoints[nextBreakpoint].passed) {
          /* grade speed and turn breakpoint to passed */
          this.snake.speed -= this.snake.speedGradeValue;
          this.snake.speedGradeNumber += 1;
          this.score.breakpoints[nextBreakpoint].passed = true;

          /* if it's not last breakpoint */
          if (nextBreakpoint < (this.score.breakpoints.length - 1)) {
            this.score.nextBreakpoint += 1;
          }
        }
      }

      clearInterval(this.interval);
      this.startGameLoop();
    },
    changeSnakeDirection(direction) {
      if (!this.snake.isRunning || !this.changingDirectionALlowed) return false;
      if (this.snake.direction === direction) return false;

      if (direction === 'up' && this.snake.direction === 'down') {
        return false;
      }

      if (direction === 'down' && this.snake.direction === 'up') {
        return false;
      }

      if (direction === 'left' && this.snake.direction === 'right') {
        return false;
      }

      if (direction === 'right' && this.snake.direction === 'left') {
        return false;
      }

      this.snake.direction = direction;
      this.changingDirectionALlowed = false;
    },
    getSnakeCoordsBeforeMoving() {
      const oldPartsCoords = [];

      this.snake.parts.forEach((part) => {
        oldPartsCoords.push({
          x: part.x,
          y: part.y,
        });
      });

      return oldPartsCoords;
    },
    moveSnake() {
      const oldPartsCoords = this.getSnakeCoordsBeforeMoving();

      for (let i = 0; i < this.snake.parts.length; i++) {
        /* if it's head, just increment/decrement X or Y depending on moving direction */
        if (i === 0) {
          const oldSnakeHead = this.getSnakeHeadField();
          oldSnakeHead.classList.remove('snakeHead');

          switch (this.snake.direction) {
            case 'up':
              if (this.snake.parts[0].y === 1) {
                this.snake.parts[0].y = this.area.size.y;
              } else {
                this.snake.parts[0].y -= 1;
              }
              break;
            case 'down':
              if (this.snake.parts[0].y === this.area.size.y) {
                this.snake.parts[0].y = 1;
              } else {
                this.snake.parts[0].y += 1;
              }
              break;
            case 'left':
              if (this.snake.parts[0].x === 1) {
                this.snake.parts[0].x = this.area.size.x;
              } else {
                this.snake.parts[0].x -= 1;
              }
              break;
            case 'right':
              if (this.snake.parts[0].x === this.area.size.x) {
                this.snake.parts[0].x = 1;
              } else {
                this.snake.parts[0].x += 1;
              }
              break;
            default:
              break;
          }
        } else {
          /*
            If it's a body part, put it on coords of the part that going ahead of it.
            Thus, each part of the body is constantly trying to catch up with
            the part that going ahead,
          */
          const oldPartPos = this.getSnakeBodyPart(i);
          oldPartPos.classList.remove('snakePart');
          this.snake.parts[i].x = oldPartsCoords[i - 1].x;
          this.snake.parts[i].y = oldPartsCoords[i - 1].y;
        }
      }

      this.drawSnake();
    },
    addSnakeBodyPart() {
      const newBodyPartCoords = {
        x: null,
        y: null,
      };
      const lastPartIndex = this.snake.parts.length - 1;
      /*
        determine the coordinates of the new part of the
        body depending on the direction of movement
      */
      switch (this.snake.direction) {
        case 'up':
          newBodyPartCoords.x = this.snake.parts[lastPartIndex].x;
          if (this.snake.parts[lastPartIndex].y === 1) {
            newBodyPartCoords.y = this.area.size.y;
          } else {
            newBodyPartCoords.y = this.snake.parts[lastPartIndex].y - 1;
          }
          break;
        case 'down':
          newBodyPartCoords.x = this.snake.parts[lastPartIndex].x;
          if (this.snake.parts[lastPartIndex].y === this.area.size.y) {
            newBodyPartCoords.y = 1;
          } else {
            newBodyPartCoords.y = this.snake.parts[lastPartIndex].y + 1;
          }
          break;
        case 'left':
          if (this.snake.parts[lastPartIndex].x === this.area.size.x) {
            newBodyPartCoords.x = 1;
          } else {
            newBodyPartCoords.x = this.snake.parts[lastPartIndex].x + 1;
          }
          newBodyPartCoords.y = this.snake.parts[lastPartIndex].y;
          break;
        case 'right':
          if (this.snake.parts[lastPartIndex].x === 1) {
            newBodyPartCoords.x = this.area.size.x;
          } else {
            newBodyPartCoords.x = this.snake.parts[lastPartIndex].x - 1;
          }
          newBodyPartCoords.y = this.snake.parts[lastPartIndex].y;
          break;
        default:
          break;
      }

      this.snake.parts.push({
        x: newBodyPartCoords.x,
        y: newBodyPartCoords.y,
      });
    },
  },
};
