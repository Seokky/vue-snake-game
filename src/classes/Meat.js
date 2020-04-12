import Vue from 'vue';
import DOM from '@/classes/DOM';
import Randomizer from '@/classes/Randomizer';

class Meat {
  #state = Vue.observable({
    coords: {
      x: null,
      y: null,
    },
  })

  get coordinates() {
    return this.#state.coords;
  }

  create(snakeParts, areaSize) {
    return new Promise((resolve) => {
      do {
        this.coordinates.x = Randomizer.getRandomNumber(1, areaSize.x);
        this.coordinates.y = Randomizer.getRandomNumber(1, areaSize.y);
      } while (!DOM.fieldIsEmpty(this.coordinates.x, this.coordinates.y, snakeParts));

      resolve();
    });
  }

  remove() {
    DOM
      .getFieldByCoords(this.coordinates.x, this.coordinates.y)
      .classList.remove('meatField');
  }
}

const meat = new Meat();

export { meat };
