import {IUser} from './user'

export interface IPublisher extends IUser {
    publisherId: number,
    publisherName: string
}