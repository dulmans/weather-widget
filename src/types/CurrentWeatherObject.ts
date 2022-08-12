import CurrentCityCounty from './CurrentCityCounty';
import CompassSector from './CompassSector'

interface currentWeatherObject {
    locate: CurrentCityCounty,
    icon: string,
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