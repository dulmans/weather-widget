import CurrentLocate from './CurrentLocate';

interface currentWeatherObject {
    locate: CurrentLocate,
    icon: string,
    temp: number,
    feelsLike: number,
    description: string,
    wind:{
        speed: number,
        deg: number
    },
    pressure: number,
    humidity: number,
    dewPoint: number,
    visibility: number,
};

export default currentWeatherObject;