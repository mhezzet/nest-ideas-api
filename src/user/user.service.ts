import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserRO } from './dto/userRo.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll(): Promise<UserRO[]> {
    const users = await this.userRepository.find({ relations: ['ideas'] });
    return users.map(user => user.toResponseObject(false));
  }

  async login(data: UserDTO) {
    const { password, username } = data;

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'username/password invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user.toResponseObject();
  }

  async register(data: UserDTO) {
    const { password, username } = data;
    let user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      throw new HttpException('user is already exist', HttpStatus.BAD_REQUEST);
    }

    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    user = await this.userRepository.findOne({ where: { username } });

    return user.toResponseObject();
  }
}
