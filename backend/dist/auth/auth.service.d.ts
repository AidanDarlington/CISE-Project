import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Role } from './role.enum';
export declare class AuthService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    validateUser(email: string, password: string): Promise<User | null>;
    createUser(email: string, password: string, role: Role): Promise<User>;
}
