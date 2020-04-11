import Vue from 'vue';
import DOM from '@/classes/DOM';

class Snake {
  #state = Vue.observable({
    speed: 150,
    direction: 'right',
    parts: [{ x: 5, y: 5 }],
  })

  get speed() {
    return this.#state.speed;
  }

  get direction() {
    return this.#state.direction;
  }

  get parts() {
    return this.#state.parts;
  }

  get changingDirectionALlowed() {
    return this.#state.changingDirectionALlowed;
  }

  setDirection(direction) {
    this.#state.direction = direction;
  }

  setPartCoordinate(partIndex, axis, value) {
    this.#state.parts[partIndex][axis] = value;
  }

  addBodyPart(areaWidth, areaHeight) {
    const newBodyPartCoords = {
      x: null,
      y: null,
    };
    const lastPartIndex = this.parts.length - 1;
    /*
      determine the coordinates of the new part of the
      body depending on the direction of movement
    */
    switch (this.direction) {
      case 'up':
        newBodyPartCoords.x = this.parts[lastPartIndex].x;
        if (this.parts[lastPartIndex].y === 1) {
          newBodyPartCoords.y = areaHeight;
        } else {
          newBodyPartCoords.y = this.parts[lastPartIndex].y - 1;
        }
        break;

      case 'down':
        newBodyPartCoords.x = this.parts[lastPartIndex].x;
        if (this.parts[lastPartIndex].y === areaHeight) {
          newBodyPartCoords.y = 1;
        } else {
          newBodyPartCoords.y = this.parts[lastPartIndex].y + 1;
        }
        break;

      case 'left':
        if (this.parts[lastPartIndex].x === areaWidth) {
          newBodyPartCoords.x = 1;
        } else {
          newBodyPartCoords.x = this.parts[lastPartIndex].x + 1;
        }
        newBodyPartCoords.y = this.parts[lastPartIndex].y;
        break;

      case 'right':
        if (this.parts[lastPartIndex].x === 1) {
          newBodyPartCoords.x = areaWidth;
        } else {
          newBodyPartCoords.x = this.parts[lastPartIndex].x - 1;
        }
        newBodyPartCoords.y = this.parts[lastPartIndex].y;
        break;

      default:
        break;
    }

    this.#state.parts.push({
      x: newBodyPartCoords.x,
      y: newBodyPartCoords.y,
    });
  }

  setSpeed(speed) {
    this.#state.speed = speed;
  }

  getBodyPartElement(n) {
    return DOM.getFieldByCoords(this.parts[n].x, this.parts[n].y);
  }

  getHeadElement() {
    return DOM.getFieldByCoords(this.parts[0].x, this.parts[0].y);
  }

  getCoordsBeforeMoving() {
    const oldPartsCoords = [];

    this.parts.forEach((part) => {
      oldPartsCoords.push({
        x: part.x,
        y: part.y,
      });
    });

    return oldPartsCoords;
  }

  onItself() {
    const headEl = this.getHeadElement();

    return headEl.classList.value.includes('snakePart');
  }
}

const snake = new Snake();

export { snake };
