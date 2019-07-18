/* classes */
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
      this.meat.coords.x = Random.getRandomNumber(1, this.area.size.x);
      this.meat.coords.y = Random.getRandomNumber(1, this.area.size.y);

      const field = document.getElementById(`${this.meat.coords.x}:${this.meat.coords.y}`);
      field.classList.add('areaField', 'meatField');
      field.style.backgroundColor = this.meat.color;
    },
    isSnakeOnMeat() {
      return ((this.snake.head.x === this.meat.coords.x) && (this.snake.head.y === this.meat.coords.y));
    },
  },
};