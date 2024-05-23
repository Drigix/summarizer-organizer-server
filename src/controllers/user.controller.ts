import { Controller, Get, Logger, Param } from '@nestjs/common';
import { User } from 'src/models/schemas/user.schema';
import { UserService } from 'src/services/user.service';

@Controller('/api/user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  getUser(@Param('id') id: number): Promise<User> {
    Logger.debug('Request to get user with id: ' + id);
    return this.userService.findOneById(id);
  }
}
