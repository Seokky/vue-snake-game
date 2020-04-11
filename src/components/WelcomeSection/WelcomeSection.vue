<template lang="pug">
  section.welcome
    welcome-logo

    h1.welcomeTitle Vue-snake-game

    start-game-button(
      @click="redirectToGame"
    )
</template>

<script>
/* child components */
import StartGameButton from '@/components/common/StartGameButton.vue';
import WelcomeLogo from './WelcomeLogo.vue';

/* common components */

export default {
  name: 'WelcomeSection',
  components: {
    WelcomeLogo,
    StartGameButton,
  },
  methods: {
    redirectToGame() {
      this.$router.push({ name: 'game' });
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/colors.scss';

.welcome {
  padding: 80px 40px;

  .welcomeTitle {
    color: white;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    font-size: 5rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 80px;
    margin-bottom: 60px;
  }
}
</style>
