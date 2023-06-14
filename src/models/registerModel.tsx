import {IUser} from './user'

export interface registerModel extends IUser {
    publisherName: string | null
    userType: number
}