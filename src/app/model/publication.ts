import { User } from "./user";

export interface publication{

    id?: number,
    user: User,
    text: string,
    time?: Date,
    images?: any[],
    videos?: any[],
    audios?: any[],
    coordinates?:{
        latitude: number,
        longitude: number
    },
    likes?: any[],
    comments?: any[]
}