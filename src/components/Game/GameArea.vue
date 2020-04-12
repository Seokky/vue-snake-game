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

    async prepareForGame() {
      this.setAreaElement();
      this.setClientSizes();
      this.setAreaSizes();
      this.createArea();
      this.drawSnake();
      await this.drawMeat();
    },

    createArea() {
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

    finishTheGame() {
      this.isRunning = !false;
      clearInterval(this.interval);

      /* eslint-disable-next-line no-alert */
      window.confirm('The snake bit itself. Try again?');
      this.$router.back();
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

    async drawMeat() {
      await meat.create(snake.parts, this.area.size);

      DOM
        .getFieldByCoords(meat.coordinates.x, meat.coordinates.y)
        .classList.add('areaField', 'meatField');
    },

    async drawSnake() {
      /* drawing each part of snake */
      for (let i = 0; i < snake.parts.length; i += 1) {
        const className = (i > 0) ? 'snakePart' : 'snakeHead';

        snake
          .getBodyPartElement(i)
          .classList.add(className);
      }

      if (this.isSnakeOnMeat()) {
        score.increase();
        meat.remove();
        await this.drawMeat();
        snake.addBodyPart(this.area.size.x, this.area.size.y);
      }

      if (snake.onItself()) {
        this.finishTheGame();
      }
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
      snake.move(this.area.size);
      this.drawSnake();
    },

    isSnakeOnMeat() {
      const xIsEquals = snake.parts[0].x === meat.coordinates.x;
      const yIsEquals = snake.parts[0].y === meat.coordinates.y;

      return xIsEquals && yIsEquals;
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
