import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/models/schemas/user.schema";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) {}

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOneById(id: number): Promise<User> {
        return this.userModel.findOne({userId: id}).exec();
    }
    
}