import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Role } from './role.enum';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email, password }).exec();
    return user ? user : null;
  }

  async createUser(email: string, password: string, role: Role): Promise<User> {
    const newUser = new this.userModel({ email, password, role });
    return newUser.save();
  }
}