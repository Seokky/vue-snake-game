<template lang="pug">
  section#gameAreaWrapper
    game-info-panel(
      :is-running="isRunning"
      :max-speed="isMaxSpeedAchieved"
    )
</template>

<script>
/* classes */
import DOM from '@/classes/DOM';
import SizeCalculator from '@/classes/SizeCalculator';
import Randomizer from '@/classes/Randomizer';
import { snake } from '@/classes/Snake';
import { score } from '@/classes/Score';
import { meat } from '@/classes/Meat';

/* child components */
import GameInfoPanel from '@/components/Game/GameInfoPanel.vue';

export default {
  components: {
    GameInfoPanel,
  },
  data() {
    return {
      changingDirectionALlowed: true,
      isRunning: false,
      area: {
        element: null,
        size: { x: null, y: null },
      },
      interval: null,
      clientSizes: { height: null, width: null },
    };
  },
  computed: {
    isMaxSpeedAchieved() {
      const lastBreakpoint = score.breakpoints[score.breakpoints.length - 1];

      return score.reached >= lastBreakpoint.boundary;
    },
    reachedScore() {
      return score.reached;
    },
  },
  watch: {
    reachedScore(val) {
      this.gradeSpeedIfBoundaryAchieved(val);
    },
    /* Made small input processing frequency, because in other case
    player can quickly press different arrow buttons and each of them
    will change the snake direction. The problem is conditions of
    changeSnakeDirection() function, that will correctly change the direction
    (from their point of view), but tick of startGameLoop() function is
    too rarely coming, so it will be process only the last imposed direction
    that can be opposite for last direction approved by startGameLoop() function */
    changingDirectionALlowed(val) {
      if (!val) {
        this.$nextTick(() => {
          setTimeout(this.allowChangeOfDirection, snake.speed);
        });
      }
    },
  },
  mounted() {
    this.prepareForGame();

    document.addEventListener('keydown', this.onKeyDown);
  },
  methods: {
    disallowChangeOfDirection() {
      this.changingDirectionALlowed = false;
    },

    allowChangeOfDirection() {
      this.changingDirectionALlowed = true;
    },

    prepareForGame() {
      this.setAreaElement();
      this.setClientSizes();
      this.setAreaSizes();

      const fieldSizes = SizeCalculator.getRelevantFieldSize(
        this.clientSizes.width,
        this.clientSizes.height,
      );

      for (let y = 1; y <= this.area.size.y; y += 1) {
        for (let x = 1; x <= this.area.size.x; x += 1) {
          const field = DOM.createGameAreaField(
            x,
            y,
            fieldSizes.width,
            fieldSizes.height,
          );
          this.area.element.appendChild(field);
        }
      }

      this.drawSnake();
      this.drawNewMeatField();
    },

    onKeyDown(event) {
      const codes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];

      if (!codes.includes(event.code)) return;

      switch (event.code) {
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
        case 'Space':
          this.playPauseGame();
          break;
        default:
          break;
      }
    },

    stopTheGame() {
      this.isRunning = !false;
      clearInterval(this.interval);

      if (window.confirm('The snake bit itself. Try again?')) {
        this.$router.back();
      } else {
        this.$router.back();
      }
    },

    setAreaElement() {
      this.area.element = DOM.getGameAreaElement();
    },

    setClientSizes() {
      this.clientSizes = SizeCalculator.getClientSizes(this.area.element);
    },

    setAreaSizes() {
      const areaSize = SizeCalculator.calculateAreaSize(
        this.clientSizes.width,
        this.clientSizes.height,
      );
      this.area.size.x = areaSize.x;
      this.area.size.y = areaSize.y;
    },

    drawNewMeatField() {
      do {
        meat.coordinates.x = Randomizer.getRandomNumber(1, this.area.size.x);
        meat.coordinates.y = Randomizer.getRandomNumber(1, this.area.size.y);
      } while (!DOM.fieldIsEmpty(meat.coordinates.x, meat.coordinates.y, snake.parts));

      const field = DOM.getFieldByCoords(meat.coordinates.x, meat.coordinates.y);
      field.classList.add('areaField', 'meatField');
    },

    isSnakeOnMeat() {
      const xIsEquals = snake.parts[0].x === meat.coordinates.x;
      const yIsEquals = snake.parts[0].y === meat.coordinates.y;

      return xIsEquals && yIsEquals;
    },

    drawSnake() {
      /* drawing each part of snake */
      for (let i = 0; i < snake.parts.length; i += 1) {
        const field = snake.getBodyPartElement(i);

        if (i > 0) {
          field.classList.add('snakePart');
        } else {
          field.classList.add('snakeHead');
        }
      }

      if (this.isSnakeOnMeat()) {
        score.increase();
        meat.removeMeat();
        this.drawNewMeatField();
        snake.addBodyPart(this.area.size.x, this.area.size.y);
      }

      if (snake.onItself()) {
        this.stopTheGame();
      }
    },

    playPauseGame() {
      this.isRunning = !this.isRunning;

      /* stoping the game loop */
      if (!this.isRunning) {
        clearInterval(this.interval);
      }

      this.startGameLoop();
    },

    startGameLoop() {
      if (!this.isRunning) return;

      this.interval = setInterval(() => {
        this.moveSnake();
      }, snake.speed);
    },

    gradeSpeedIfBoundaryAchieved(reachedScore) {
      const { nextBreakpoint } = score;

      /* if reached score achieved the boundary of the next breakpoint */
      if (reachedScore >= score.breakpoints[nextBreakpoint].boundary) {
        /* if that breakpoint don't passed yet */
        if (!score.breakpoints[nextBreakpoint].passed) {
          /* grade speed and turn breakpoint to passed */
          snake.setSpeed(snake.speed - score.speedGradeValue);
          score.increaseSpeedGrade();
          score.breakpoints[nextBreakpoint].passed = true;

          /* if it's not last breakpoint */
          if (nextBreakpoint < (score.breakpoints.length - 1)) {
            score.increaseNextBreakpoint();
          }
        }
      }

      /* restarting game loop */
      clearInterval(this.interval);
      this.startGameLoop();
    },

    changeSnakeDirection(direction) {
      if (!this.isRunning || !this.changingDirectionALlowed) return;
      if (snake.direction === direction) return;

      if (direction === 'up' && snake.direction === 'down') {
        return;
      }

      if (direction === 'down' && snake.direction === 'up') {
        return;
      }

      if (direction === 'left' && snake.direction === 'right') {
        return;
      }

      if (direction === 'right' && snake.direction === 'left') {
        return;
      }

      snake.setDirection(direction);
      this.disallowChangeOfDirection();
    },

    moveSnake() {
      const oldPartsCoords = snake.getCoordsBeforeMoving();

      for (let i = 0; i < snake.parts.length; i += 1) {
        /* if it's head, just increment/decrement X or Y depending on moving direction */
        if (i === 0) {
          const oldSnakeHead = snake.getHeadElement();
          oldSnakeHead.classList.remove('snakeHead');

          switch (snake.direction) {
            case 'up':
              if (snake.parts[0].y === 1) {
                snake.setPartCoordinate(0, 'y', this.area.size.y);
              } else {
                snake.setPartCoordinate(0, 'y', snake.parts[0].y - 1);
              }
              break;
            case 'down':
              if (snake.parts[0].y === this.area.size.y) {
                snake.setPartCoordinate(0, 'y', 1);
              } else {
                snake.setPartCoordinate(0, 'y', snake.parts[0].y + 1);
              }
              break;
            case 'left':
              if (snake.parts[0].x === 1) {
                snake.setPartCoordinate(0, 'x', this.area.size.x);
              } else {
                snake.setPartCoordinate(0, 'x', snake.parts[0].x - 1);
              }
              break;
            case 'right':
              if (snake.parts[0].x === this.area.size.x) {
                snake.setPartCoordinate(0, 'x', 1);
              } else {
                snake.setPartCoordinate(0, 'x', snake.parts[0].x + 1);
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
          const oldPartPos = snake.getBodyPartElement(i);
          oldPartPos.classList.remove('snakePart');
          snake.setPartCoordinate(i, 'x', oldPartsCoords[i - 1].x);
          snake.setPartCoordinate(i, 'y', oldPartsCoords[i - 1].y);
        }
      }

      this.drawSnake();
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/sizes.scss';

#gameAreaWrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100% - #{$scoreBoardHeight});
  overflow: hidden;
  margin-top: $scoreBoardHeight;

  .areaField {
    display: block;
    border-radius: 5px;
  }

  .meatField {
    display: block;
    border-radius: 100px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
    background-color: white;
  }

  .snakePart {
    background-color: coral;
  }

  .snakeHead {
    background-color: yellow;
  }
}
</style>
