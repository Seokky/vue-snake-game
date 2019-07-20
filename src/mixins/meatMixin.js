/* classes */
import DOM from '@/classes/DOM';
import Random from '@/classes/Random';

export default {
  data() {
    return {
      meat: {
        colors: [
          'yellow',
          'white',
          'brown',
          'purple',
        ],
        color: null,
        coords: {
          x: null,
          y: null,
        },
      },
    };
  },
  methods: {
    drawMeatField() {
      this.meat.color = this.meat.colors[Random.getRandomNumber(0, this.meat.colors.length - 1)];

      do {
        this.meat.coords.x = Random.getRandomNumber(1, this.area.size.x);
        this.meat.coords.y = Random.getRandomNumber(1, this.area.size.y);
      } while (!DOM.fieldIsEmpty(this.meat.coords.x, this.meat.coords.y, this.snake));

      const field = DOM.getFieldByCoords(this.meat.coords.x, this.meat.coords.y);
      field.classList.add('areaField', 'meatField');
    },
    isSnakeOnMeat() {
      return ((this.snake.parts[0].x === this.meat.coords.x) && (this.snake.parts[0].y === this.meat.coords.y));
    },
  },
};
