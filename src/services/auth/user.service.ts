import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/models/auth/user.schema";

@Injectable()
export class UserService {
    
    
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
    ) {}

    async findOne(username: string): Promise<User | undefined> {
        return this.userModel.findOne({ username }).exec();
    }

    async create(user: User): Promise<User> {
        if (!user.userId || !user.username || !user.password) {
            throw new BadRequestException();
        }
        return this.userModel.create(user);
    }
}