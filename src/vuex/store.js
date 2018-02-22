import Vuex from 'vuex';
import Vue from 'vue';
import { Notification } from 'element-ui';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    getters: {},

    mutations: {},
    actions: {
        showToast(state, { type, message, title }) {
            Notification({
                title,
                message,
                type,
            });
        },
        showSuccessToast(state, message) {
            state.dispatch('showToast', { message, type: 'success' });
        },
        showErrorToast(state, message) {
            state.dispatch('showToast', { message, type: 'error' });
        },
    },
});
