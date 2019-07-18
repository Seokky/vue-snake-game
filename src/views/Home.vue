<template lang="pug">
  section.home
    welcome-section
</template>

<script>
import WelcomeSection from '@/components/WelcomeSection/WelcomeSection.vue';

export default {
  name: 'home',
  components: {
    WelcomeSection,
  },
};
</script>
