import {defineCustomElement} from 'vue';
import App from './App.ce.vue';


const widget = defineCustomElement(App);

customElements.define('weather-widget', widget);

/*
currentWeatherInfo{
	city: string, (Город)[main.temp]
	country: string, (Страна)[main.temp]

	icon: string, (Иконка)[weather.0.icon]
	temp: number, (Температура)[main.temp]

	feelsLike: number, (Ощущаемая температура)[main.feeils_like]
	description: string, (Описание погоды)[weather.description]

    wind:{
        speed: number, (Скорость ветра)[wind.speed]
        deg: number, (Направление ветра)[wind.deg]
    }
    pressure: number, (Давление в hPa)[main.pressure]

    humidity: number, (Влажность)[main.humidity]
    dewPoint: number, (Давление в hPa)[main.pressure]

    visibility: number, (Видимость в метрах)[visibility]
}
 */