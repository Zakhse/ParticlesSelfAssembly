import Vue from 'vue';
import _ from 'lodash';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import App from './App';
import store from './vuex/store';

Vue.config.productionTip = false;
Vue.use(Element, { locale });
window._ = _;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    template: '<App/>',
    components: { App },
});
