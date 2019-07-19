<template lang="pug">
  section.gameInfoWrapper
    .row
      .col
        .label Score:
        .value {{ score.reached }}
      .col
        .label {{ (isRunning) ? 'Pause:' : 'Play:' }}
        .value SPACE
      .col
        .label Speed:
        .value {{ (maxSpeed) ? 'MAX SPEED' : speed }}
</template>

<script>
export default {
  props: {
    isRunning: {
      required: true,
      type: Boolean,
    },
    maxSpeed: {
      required: true,
      type: Boolean,
    },
    speed: {
      required: true,
      type: Number,
    },
    score: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';
@import '@/styles/sizes.scss';

.gameInfoWrapper {
  position: fixed;
  top: 10px;
  left: 10px;
  right: 10px;
  height: $scoreBoardHeight;
  background: rgba(128, 0, 128, .6);
  box-shadow: 0px 1px 6px rgba(0,0,0,.3);
  border-bottom: 6px dashed $mainColor;
  .row {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 100%;
  }
  .col {
    height: 100%;
    padding: 10px 30px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }
  .label, .value {
    display: inline-block;
    color: white;
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-weight: normal;
    font-size: 3rem;
  }
  .label {
    margin-right: 10px;
    color: $mainColor;
    text-transform: uppercase;
    text-shadow: -1px 1px 2px rgba(black, .65);
  }
}
</style>
