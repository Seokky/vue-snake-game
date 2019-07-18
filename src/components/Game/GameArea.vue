<template lang="pug">
  section#gameAreaWrapper
</template>

<script>
/* mixins */
import snakeMixin from '@/mixins/snakeMixin';
import meatMixin from '@/mixins/meatMixin';

/* eslint-disable consistent-return */
export default {
  mixins: [
    snakeMixin,
    meatMixin,
  ],
  data() {
    return {
      area: {
        element: null,
        size: {
          x: 30,
          y: 30,
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
    onKeyUp(event) {
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
    box-shadow: inset 0px 0px 2px rgba(0,0,0,.3);
  }
  .meatField {
    display: block;
    border-radius: 100px;
    box-shadow: none;
  }
}
</style>
