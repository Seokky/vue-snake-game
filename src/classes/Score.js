import Vue from 'vue';

class Score {
  #state = Vue.observable({
    reached: 0,
    rewardAmount: 5,
    nextBreakpoint: 0,
    breakpoints: [
      { boundary: 5, passed: false },
      { boundary: 15, passed: false },
      { boundary: 35, passed: false },
      { boundary: 70, passed: false },
      { boundary: 100, passed: false },
      { boundary: 135, passed: false },
      { boundary: 165, passed: false },
      { boundary: 200, passed: false },
    ],
    speedGradeNumber: 1,
    speedGradeValue: 15,
  })

  get reached() {
    return this.#state.reached;
  }

  get rewardAmount() {
    return this.#state.rewardAmount;
  }

  get nextBreakpoint() {
    return this.#state.nextBreakpoint;
  }

  get breakpoints() {
    return this.#state.breakpoints;
  }

  get speedGradeNumber() {
    return this.#state.speedGradeNumber;
  }

  get speedGradeValue() {
    return this.#state.speedGradeValue;
  }

  increase() {
    this.#state.reached += this.rewardAmount;
  }

  increaseSpeedGrade() {
    this.#state.speedGradeNumber += 1;
  }

  increaseNextBreakpoint() {
    this.#state.nextBreakpoint += 1;
  }
}

const score = new Score();

export { score };
