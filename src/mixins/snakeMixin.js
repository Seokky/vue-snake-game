/* eslint-disable consistent-return */
export default {
  data() {
    return {
      changingDirectionALlowed: true,
      snake: {
        isRunning: false,
        size: 1,
        color: 'coral',
        speed: 150,
        speedGradeNumber: 1,
        speedGradeValue: 15,
        direction: 'right',
        parts: [
          {
            x: 5,
            y: 5,
          },
        ],
      },
    };
  },
  watch: {
    /* Make small input processing frequency, because in other case
    player can quickly press different arrow buttons and each of them
    will change the snake direction. The problem is conditions of
    changeSnakeDirection() function, that will correctly change the direction
    (from their point of view), but tick of loopSnakeMoving() function is
    too rarely coming, so it will be process only the last imposed direction
    that can be opposite for last direction approved by loopSnakeMoving() function */
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
    isSnakeOnItself() {
      const snakeHead = this.getSnakeHeadField();

      return snakeHead.classList.value.includes('snakePart');
    },
    drawSnake() {
      for (let i = 0; i < this.snake.parts.length; i++) {
        const field = this.getSnakeBodyPart(i);
        if (i > 0) {
          field.classList.add('snakePart');
        } else {
          field.classList.add('snakeHead');
        }
      }

      if (this.isSnakeOnMeat()) {
        /* increment player's score */
        this.score.reached += this.score.cost;

        /* removing a meat from field */
        const snakeHead = this.getSnakeHeadField();
        snakeHead.classList.remove('meatField');

        /* drawing a new meat */
        this.drawMeatField();

        /* adding a new body part of snake */
        /* ------------------------------- */
        /* if only head exists */
        if (this.snake.parts.length === 1) {
          /* adding a new body part */
          this.snake.parts.push({
            x: null,
            y: null,
          });
          /* depending on the snake moving direction */
          switch (this.snake.direction) {
            case 'up':
              this.snake.parts[1].x = this.snake.parts[0].x;
              if (this.snake.parts[0].y !== 1) {
                this.snake.parts[1].y = this.snake.parts[0].y - 1;
              } else {
                this.snake.parts[1].y = this.area.size.y;
              }
              break;
            case 'down':
              this.snake.parts[1].x = this.snake.parts[0].x;
              if (this.snake.parts[0].y === this.area.size.y) {
                this.snake.parts[1].y = 1;
              } else {
                this.snake.parts[1].y = this.snake.parts[0].y + 1;
              }
              break;
            case 'left':
              if (this.snake.parts[0].x === this.area.size.x) {
                this.snake.parts[1].x = 1;
              } else {
                this.snake.parts[1].x = this.snake.parts[0].x + 1;
              }
              this.snake.parts[1].y = this.snake.parts[0].y;
              break;
            case 'right':
              if (this.snake.parts[0].x === 1) {
                this.snake.parts[1].x = this.area.size.x;
              } else {
                this.snake.parts[1].x = this.snake.parts[0].x - 1;
              }
              this.snake.parts[1].y = this.snake.parts[0].y;
              break;
            default:
              break;
          }
        } else {
          const newBodyPartCoords = {
            x: null,
            y: null,
          };
          const lastPartIndex = this.snake.parts.length - 1;
          /* depending on the snake moving direction */
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
          /* adding a new body part */
          this.snake.parts.push({
            x: newBodyPartCoords.x,
            y: newBodyPartCoords.y,
          });
        }
      }

      if (this.isSnakeOnItself()) {
        this.stopTheGame();
      }
    },
    getSnakeBodyPart(n) {
      return document.getElementById(`${this.snake.parts[n].x}:${this.snake.parts[n].y}`);
    },
    getSnakeHeadField() {
      return document.getElementById(`${this.snake.parts[0].x}:${this.snake.parts[0].y}`);
    },
    toggleSnakeRunning() {
      this.snake.isRunning = !this.snake.isRunning;
      if (!this.snake.isRunning) {
        clearInterval(this.interval);
      }
      this.loopSnakeMoving();
    },
    loopSnakeMoving() {
      if (!this.snake.isRunning) return false;

      this.interval = setInterval(() => {
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
      this.loopSnakeMoving();
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
    moveUp() {
      let oldPartsCoords = [];

      this.snake.parts.forEach((part) => {
        oldPartsCoords.push({
          x: part.x,
          y: part.y,
        });
      });

      for (let i = 0; i < this.snake.parts.length; i++) {
        /* if it's head, just move it depending on moving direction */
        if (i === 0) {
          const oldSnakeHead = this.getSnakeHeadField();
          oldSnakeHead.classList.remove('snakeHead');
          if (this.snake.parts[0].y === 1) {
            this.snake.parts[0].y = this.area.size.y;
          } else {
            this.snake.parts[0].y -= 1;
          }
        } else {
          /* if it's a body part, just put it on old coords of previous part */
          const oldPartPos = this.getSnakeBodyPart(i);
          oldPartPos.classList.remove('snakePart');
          this.snake.parts[i].x = oldPartsCoords[i - 1].x;
          this.snake.parts[i].y = oldPartsCoords[i - 1].y;
        }
      }

      this.drawSnake();
    },
    moveDown() {
      let oldPartsCoords = [];

      this.snake.parts.forEach((part) => {
        oldPartsCoords.push({
          x: part.x,
          y: part.y,
        });
      });

      for (let i = 0; i < this.snake.parts.length; i++) {
        /* if it's head, just move it depending on moving direction */
        if (i === 0) {
          const oldSnakeHead = this.getSnakeHeadField();
          oldSnakeHead.classList.remove('snakeHead');
          if (this.snake.parts[0].y === this.area.size.y) {
            this.snake.parts[0].y = 1;
          } else {
            this.snake.parts[0].y += 1;
          }
        } else {
          /* if it's a body part, just put it on old coords of previous part */
          const oldPartPos = this.getSnakeBodyPart(i);
          oldPartPos.classList.remove('snakePart');
          this.snake.parts[i].x = oldPartsCoords[i - 1].x;
          this.snake.parts[i].y = oldPartsCoords[i - 1].y;
        }
      }

      this.drawSnake();
    },
    moveLeft() {
      let oldPartsCoords = [];

      this.snake.parts.forEach((part) => {
        oldPartsCoords.push({
          x: part.x,
          y: part.y,
        });
      });

      for (let i = 0; i < this.snake.parts.length; i++) {
        /* if it's head, just move it depending on moving direction */
        if (i === 0) {
          const oldSnakeHead = this.getSnakeHeadField();
          oldSnakeHead.classList.remove('snakeHead');
          if (this.snake.parts[0].x === 1) {
            this.snake.parts[0].x = this.area.size.x;
          } else {
            this.snake.parts[0].x -= 1;
          }
        } else {
          /* if it's a body part, just put it on old coords of previous part */
          const oldPartPos = this.getSnakeBodyPart(i);
          oldPartPos.classList.remove('snakePart');
          this.snake.parts[i].x = oldPartsCoords[i - 1].x;
          this.snake.parts[i].y = oldPartsCoords[i - 1].y;
        }
      }

      this.drawSnake();
    },
    moveRight() {
      let oldPartsCoords = [];

      this.snake.parts.forEach((part) => {
        oldPartsCoords.push({
          x: part.x,
          y: part.y,
        });
      });

      for (let i = 0; i < this.snake.parts.length; i++) {
        /* if it's head, just move it depending on moving direction */
        if (i === 0) {
          const oldSnakeHead = this.getSnakeHeadField();
          oldSnakeHead.classList.remove('snakeHead');
          if (this.snake.parts[0].x === this.area.size.x) {
            this.snake.parts[0].x = 1;
          } else {
            this.snake.parts[0].x += 1;
          }
        } else {
          /* if it's a body part, just put it on old coords of previous part */
          const oldPartPos = this.getSnakeBodyPart(i);
          oldPartPos.classList.remove('snakePart');
          this.snake.parts[i].x = oldPartsCoords[i - 1].x;
          this.snake.parts[i].y = oldPartsCoords[i - 1].y;
        }
      }

      this.drawSnake();
    },
  },
};
