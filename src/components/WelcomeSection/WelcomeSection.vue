<template lang="pug">
  section.welcome
    welcome-logo
    h1.welcomeTitle Vue-snake-game
</template>

<script>
import WelcomeLogo from './WelcomeLogo.vue';

export default {
  name: 'HelloWorld',
  components: {
    WelcomeLogo,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '@/styles/colors.scss';

.welcome {
  padding: 80px 40px;
  .welcomeTitle {
    color: white;
    text-shadow: 0px 1px 4px rgba(0,0,0,.5);
    font-size: 5rem;
    font-weight: bold;
    text-transform: uppercase;
  }
}
</style>
