import Coords from './Coords'

interface LocateList{
    id: number,
    locateInfo: {
        city: string,
        country: string
    },
    coords: Coords
}

export default LocateList;