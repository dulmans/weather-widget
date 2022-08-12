interface LocateList{
    id: number,
    locateInfo: {
        city: string,
        country: string
    },
    coords: {
        latitude: number,
        longitude: number
    },
    current: boolean,
}

export default LocateList;