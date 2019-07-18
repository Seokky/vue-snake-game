import Vue from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import './icons';
import App from './App.vue';
import router from './router/index';

Vue.config.productionTip = false;

Vue.component('fa-icon', FontAwesomeIcon);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
