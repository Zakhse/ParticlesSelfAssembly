// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import _ from 'lodash';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
// import '@/assets/style/element-variables.scss';
import App from './App';
import store from './vuex/store';
// import router from './router';

Vue.config.productionTip = false;
Vue.use(Element, { locale });
window._ = _;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    // router,
    store,
    template: '<App/>',
    components: { App },
});
