<template lang="pug">
  section#gameAreaWrapper
    game-info-panel(
      :is-running="snake.isRunning"
      :score="score"
      :speed="snake.speedGradeNumber"
      :max-speed="maxSpeedIsAchieved"
    )
</template>

<script>
/* mixins */
import snakeMixin from '@/mixins/snakeMixin';
import meatMixin from '@/mixins/meatMixin';

/* child components */
import GameInfoPanel from '@/components/Game/GameInfoPanel.vue';

/* eslint-disable consistent-return, func-names */
export default {
  mixins: [
    snakeMixin,
    meatMixin,
  ],
  components: {
    GameInfoPanel,
  },
  data() {
    return {
      area: {
        element: null,
        size: {
          x: null,
          y: null,
        },
      },
      interval: null,
      score: {
        reached: 0,
        cost: 5,
        nextBreakpoint: 0,
        breakpoints: [
          { boundary: 15, passed: false },
          { boundary: 30, passed: false },
          { boundary: 50, passed: false },
          { boundary: 70, passed: false },
          { boundary: 100, passed: false },
          { boundary: 135, passed: false },
          { boundary: 165, passed: false },
          { boundary: 200, passed: false },
        ],
      },
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
      let fieldHeight = 30;
      let fieldWidth = 30;

      if (this.clientWidth < 1000 || this.clientHeight < 500) {
        fieldHeight = 20;
        fieldWidth = 20;
      }

      return {
        height: `${fieldHeight}px`,
        width: `${fieldWidth}px`,
        poorHeight: fieldHeight,
        poorWidth: fieldWidth,
      };
    },
    maxSpeedIsAchieved() {
      return this.score.reached >= this.score.breakpoints[this.score.breakpoints.length - 1].boundary;
    },
  },
  watch: {
    'score.reached': function (reachedScore) {
      this.gradeSpeedIfBoundaryAchieved(reachedScore);
    },
  },
  mounted() {
    this.prepareForGame();

    document.addEventListener('keydown', () => { this.onKeyDown(event); });
  },
  methods: {
    calculateAreaSize() {
      this.area.size.x = Math.floor(this.clientWidth / this.fieldSize.poorHeight);
      this.area.size.y = Math.floor(this.clientHeight / this.fieldSize.poorHeight);
    },
    prepareForGame() {
      this.setGameAreaElement();
      this.calculateAreaSize();

      for (let y = 1; y <= this.area.size.y; y++) {
        for (let x = 1; x <= this.area.size.x; x++) {
          this.createGameAreaField(x, y, this.area.element);
        }
      }

      this.drawSnake();
      this.drawMeatField();
    },
    createGameAreaField(x, y, area) {
      const field = document.createElement('div');

      field.classList.add('areaField');
      field.setAttribute('id', `${x}:${y}`);
      field.style.width = this.fieldSize.width;
      field.style.height = this.fieldSize.height;

      area.appendChild(field);
    },
    setGameAreaElement() {
      this.area.element = document.getElementById('gameAreaWrapper');
    },
    onKeyDown(event) {
      const codes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];

      if (!codes.includes(event.code)) return false;

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
    stopTheGame() {
      this.snake.isRunning = !false;
      clearInterval(this.interval);

      if (window.confirm('The snake bit itself. Try again?')) {
        this.$router.back();
      } else {
        this.$router.back();
      }
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
    box-shadow: 0px 1px 4px rgba(0,0,0,.7);
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
