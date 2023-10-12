import { Controller, Post, Get, Req, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users';
import { AppRequest } from '../shared';

@Controller('users')
export class UserController {
  constructor(private userService: UsersService) {}

  @Get(':id')
  async findById(@Req() req: AppRequest) {
    const user = await this.userService.findOne(req.params.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { user },
    };
  }

  @Get()
  async getUsers() {
    const users = await this.userService.getAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { users },
    };
  }

  @Post()
  async registerUser(@Req() req: AppRequest) {
    const { name, password, email } = req.body;
    const user = await this.userService.create({ name, password, email });
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { user },
    };
  }
}
