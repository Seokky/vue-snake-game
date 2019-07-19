<template lang="pug">
  section.gameWrapper
    game-area
</template>

<script>
import GameArea from '@/components/Game/GameArea.vue';

export default {
  components: {
    GameArea,
  },
  data() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped>
.gameWrapper {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
