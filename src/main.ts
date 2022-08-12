import {defineCustomElement} from 'vue';
import App from './App.ce.vue';


const widget = defineCustomElement(App);

customElements.define('weather-widget', widget);

/*
currentWeatherInfo{
	city: string, (Город)[name]
	country: string, (Страна)[sys.country]

	icon: string, (Иконка)[weather.0.icon]
	temp: number, (Температура)[main.temp]

	feelsLike: number, (Ощущаемая температура)[main.feeils_like]
	description: string, (Описание погоды)[weather.0.description]

    wind:{
        speed: number, (Скорость ветра)[wind.speed]
        deg: number, (Направление ветра)[wind.deg]
    }
    pressure: number, (Давление в hPa)[main.pressure]

    humidity: number, (Влажность)[main.humidity]
    visibility: number, (Видимость в метрах)[visibility]
}
 */

/*
    {
        id: 1,
        locateInfo: {
            city: '1',
            country: 'US'
        },
        coords: {
            latitude: 1,
            longitude: 1
        },
        current: true,
    }
*/