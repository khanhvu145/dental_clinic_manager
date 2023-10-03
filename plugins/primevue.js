import Vue from 'vue'
import PrimeVue from 'primevue/config';
import InputNumber from 'primevue/inputnumber'

export default () => {
	Vue.use(PrimeVue, { ripple: true })
    Vue.component('InputNumber', InputNumber);
};
