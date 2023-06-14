import {IUser} from './user'

export interface ICustomer extends IUser {
    customerId: number
}