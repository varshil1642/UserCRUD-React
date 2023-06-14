import { defineAbility } from '@casl/ability';
import { IUser } from '../models/user';

export default function defineAbilityFor(user: IUser, token: string | undefined | null) {
    // return defineAbility((can) => {
    //     can('read', 'index');

    //     if (token) {
    //         can('update', 'Article', { authorId: user.id });
    //         can('leave', 'Comment');
    //         can('update', 'Comment', { authorId: user.id });
    //     }
    // });
}