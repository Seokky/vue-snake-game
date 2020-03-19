<template lang="pug">
  section#gameAreaWrapper
    game-info-panel(
      :is-running="isRunning"
      :score="score"
      :speed="snake.speedGradeNumber"
      :max-speed="maxSpeedIsAchieved"
    )
</template>

<script>
/* constants */
import { SCORE_COST } from '@/constants';

/* mixins */
import snakeMixin from '@/mixins/snakeMixin';
import meatMixin from '@/mixins/meatMixin';

/* utils */
import {
  createGameAreaField,
  getGameAreaElement,
  calculateFieldSize,
  getClientSizes,
  calculateAreaSize,
} from '@/utils/game-dom';

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
    isRunning: false,
    area: {
      element: null,
      size: { x: null, y: null },
    },
    score: {
      reached: 0,
      cost: SCORE_COST,
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
    'score.reached': function(reachedScore) {
      this.gradeSpeedIfBoundaryAchieved(reachedScore);
    },
    isRunning(value) {
      if (value) {
        this.startGameLoop();
      } else {
        this.stopGameLoop();
      }
    },
  },

  beforeDestroy() {
    this.stopGameLoop();
  },

  mounted() {
    this.prepareForGame();

    document.addEventListener('keydown', (e) => { this.onKeyDown(e); });
  },

  methods: {
    prepareForGame() {
      this.setAreaElement();
      this.setClientSizes();
      this.setAreaSizes();

      const fieldSizes = calculateFieldSize(
        this.clientSizes.width,
        this.clientSizes.height,
      );

      for (let y = 1; y <= this.area.size.y; y += 1) {
        for (let x = 1; x <= this.area.size.x; x += 1) {
          const field = createGameAreaField(x, y, fieldSizes.width, fieldSizes.height);
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
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          this.changeSnakeDirection(event.code.slice(5).toLowerCase());
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
    },
    startGameLoop() {
      this.interval = setInterval(this.moveSnake, this.snake.speed);
    },
    stopGameLoop() {
      clearInterval(this.interval);
    },
    finishTheGame() {
      this.stopGameLoop();
      window.confirm('The snake bit itself. Try again?');
      this.$router.back();
    },
    setAreaElement() {
      this.area.element = getGameAreaElement();
    },
    setClientSizes() {
      this.clientSizes = getClientSizes(this.area.element);
    },
    setAreaSizes() {
      const areaSize = calculateAreaSize(
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
