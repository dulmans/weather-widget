import WeatherIcon from './WeatherIcon';

interface GetApiJson {
    name: string,
    visibility: number,
    weather: {
        0: {
            description: string,
            icon: WeatherIcon
        }
    },
    wind: {
        speed: number,
        deg: number
    }
    sys:{
        country: string
    },
    main: {
        temp: number,
        feels_like: number,
        humidity: number,
        pressure: number,
    },
    coord?: {
        lat: number,
        lon: number
    }
}

export default GetApiJson;