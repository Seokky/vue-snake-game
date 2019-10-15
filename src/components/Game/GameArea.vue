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

/* classes */
import DOM from '@/classes/DOM';
import SizeCalculator from '@/classes/SizeCalculator';

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

  data: () => ({
    area: {
      element: null,
      size: { x: null, y: null },
    },
    score: {
      reached: 0,
      cost: 5,
      nextBreakpoint: 0,
      breakpoints: [
        { boundary: 5, passed: false },
        { boundary: 10, passed: false },
        { boundary: 15, passed: false },
        { boundary: 70, passed: false },
        { boundary: 100, passed: false },
        { boundary: 135, passed: false },
        { boundary: 165, passed: false },
        { boundary: 200, passed: false },
      ],
    },
    interval: null,
    clientSizes: { height: null, width: null },
  }),

  computed: {
    maxSpeedIsAchieved() {
      const lastBreakpoint = this.score.breakpoints[this.score.breakpoints.length - 1];

      return this.score.reached >= lastBreakpoint.boundary;
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
    prepareForGame() {
      this.setAreaElement();
      this.setClientSizes();
      this.setAreaSizes();

      const fieldSizes = SizeCalculator.fieldSize(
        this.clientSizes.width,
        this.clientSizes.height,
      );

      for (let y = 1; y <= this.area.size.y; y++) {
        for (let x = 1; x <= this.area.size.x; x++) {
          const field = DOM.createGameAreaField(x, y, fieldSizes.width, fieldSizes.height);
          this.area.element.appendChild(field);
        }
      }

      this.drawSnake();
      this.drawNewMeatField();
    },
    onKeyDown(event) {
      const codes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];

      if (!codes.includes(event.code)) return false;

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
      this.snake.isRunning = !false;
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
