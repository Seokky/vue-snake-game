class Randomizer {
  static getRandomNumber(min, max) {
    return Math.floor(Math.random() * ((max + 1) - min)) + min;
  }
}

export default Randomizer;
