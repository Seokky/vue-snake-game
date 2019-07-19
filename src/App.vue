<template lang="pug">
  section#app
    router-view
</template>

<style lang="scss">
@import '@/styles/reset.scss';
@import '@/styles/colors.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
  border: 10px solid rgba($mainColor, 1);
  background: $secondColor;
  box-shadow: inset 0px 0px 16px rgba(0,0,0,.4);
  max-width: 1920px;
  display: block;
  margin: 0 auto;
}
</style>
