/* classes */
import DOM from '@/classes/DOM';
import Random from '@/classes/Random';

export default {
  data() {
    return {
      meat: {
        coords: {
          x: null,
          y: null,
        },
      },
    };
  },
  methods: {
    drawNewMeatField() {
      do {
        this.meat.coords.x = Random.getRandomNumber(1, this.area.size.x);
        this.meat.coords.y = Random.getRandomNumber(1, this.area.size.y);
      } while (!DOM.fieldIsEmpty(this.meat.coords.x, this.meat.coords.y, this.snake.parts));

      const field = DOM.getFieldByCoords(this.meat.coords.x, this.meat.coords.y);
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
