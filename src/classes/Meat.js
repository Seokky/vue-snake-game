import Vue from 'vue';
import DOM from '@/classes/DOM';

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

  removeMeat() {
    const meatEl = DOM.getFieldByCoords(this.coordinates.x, this.coordinates.y);

    meatEl.classList.remove('meatField');
  }
}

const meat = new Meat();

export { meat };
