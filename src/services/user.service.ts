import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { USER_MODEL_PROVIDER } from "src/config/model-providers.config";
import { User } from "src/models/user.model";

@Injectable()
export class UserService {

    constructor(
        @Inject(USER_MODEL_PROVIDER)
        private userModel: Model<User>,
      ) {}

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOneById(id: number): Promise<User> {
        return this.userModel.findOne({userId: id}).exec();
    }
    
}