import {createApp, defineCustomElement} from 'vue';
import App from './App.ce.vue';

const app = createApp(App)

const widget = defineCustomElement(App)

customElements.define('weather-widget', widget)