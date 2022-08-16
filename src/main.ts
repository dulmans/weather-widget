import {defineCustomElement} from 'vue';
import App from './App.ce.vue';


const widget = defineCustomElement(App);

customElements.define('weather-widget', widget);
