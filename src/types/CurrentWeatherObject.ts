import CurrentCityCounty from './CurrentCityCountry';
import CompassSector from './CompassSector'
import WeatherIcon from './WeatherIcon'

interface currentWeatherObject {
    locate: CurrentCityCounty,
    icon: WeatherIcon,
    temp: number,
    feelsLike: number,
    description: string,
    wind:{
        speed: number,
        deg: number,
        direction: CompassSector
    },
    pressure: number,
    humidity: number,
    visibility: number,
};

export default currentWeatherObject;