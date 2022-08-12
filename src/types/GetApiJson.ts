interface GetApiJson {
    name: string,
    visibility: number,
    weather: {
        0: {
            description: string,
            icon: string
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
    }
}

export default GetApiJson;