/* utils */
import { fieldIsEmpty, getFieldByCoords } from '@/utils/game-dom';
import { getRandomNumber } from '@/utils/random';

export default {
  data: () => ({
    meat: {
      coords: {
        x: null,
        y: null,
      },
    },
  }),

  methods: {
    drawNewMeatField() {
      do {
        this.meat.coords.x = getRandomNumber(1, this.area.size.x);
        this.meat.coords.y = getRandomNumber(1, this.area.size.y);
      } while (
        !fieldIsEmpty(
          this.meat.coords.x,
          this.meat.coords.y,
          this.snake.parts,
        )
      );

      const field = getFieldByCoords(this.meat.coords.x, this.meat.coords.y);

      field.classList.add('areaField', 'meatField');
    },
    isSnakeOnMeat() {
      const xIsEquals = this.snake.parts[0].x === this.meat.coords.x;
      const yIsEquals = this.snake.parts[0].y === this.meat.coords.y;

      return xIsEquals && yIsEquals;
    },
    removeMeatFromField() {
      const snakeHead = this.getSnakeHeadField();

      snakeHead.classList.remove('meatField');
    },
  },
};
