<template lang="pug">
  button.startGameBtn(@click="onClick")
    span.btnIcon
      fa-icon(icon="play-circle")
    span.btnText {{ buttonTextComputed }}
</template>

<script>
export default {
  props: {
    repeat: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {

    };
  },
  computed: {
    buttonTextComputed() {
      return (this.repeat) ? 'Try one more!' : 'Start a game!';
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

$fontSize: 1.4rem;

.startGameBtn {
  padding: 10px 20px;
  background: $mainColor;
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0,0,0,.2);
  height: 60px;
  transition: all .5s ease;
  &:hover {
    background: $secondColor;
    border: 6px solid $mainColor;
    transition: all .2s ease;
  }
  .btnIcon {
    font-size: $fontSize;
    margin-right: 10px;
  }
  .btnText {
    font-size: $fontSize;
    font-family: Monospace;
    font-weight: bold;
  }
}
</style>
