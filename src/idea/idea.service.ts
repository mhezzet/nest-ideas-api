import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async showAll() {
    const ideas = await this.ideaRepository.find({ relations: ['author'] });

    return ideas.map(idea => idea.toResponseObject());
  }

  async create(data: IdeaDTO, userID: string) {
    const user = await this.userRepository.findOne({ where: { id: userID } });
    const idea = await this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save(idea);
    return idea.toResponseObject();
  }

  async read(id: string) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!idea) {
      throw new HttpException('no such an idea', HttpStatus.NOT_FOUND);
    }

    return idea;
  }

  async update(id: string, data: Partial<IdeaDTO>, userID: string) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!idea) {
      throw new HttpException('no such an idea', HttpStatus.NOT_FOUND);
    }
    if (idea.author.id != userID) {
      throw new HttpException(
        'its not your idea to update',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.ideaRepository.update({ id }, data);
    idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    return idea.toResponseObject();
  }

  async destroy(id: string, userID: string) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!idea) {
      throw new HttpException('no such an idea', HttpStatus.NOT_FOUND);
    }

    if (idea.author.id != userID) {
      throw new HttpException(
        'its not your idea to delete',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.ideaRepository.delete({ id });
    return idea.toResponseObject();
  }
}
