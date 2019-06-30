import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bycrpt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './dto/userRo.dto';
import { IdeaEntity } from 'src/idea/idea.entity';
import { type } from 'os';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(type => IdeaEntity, idea => idea.author)
  ideas: IdeaEntity[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bycrpt.genSalt(10);
    this.password = await bycrpt.hash(this.password, salt);
  }

  toResponseObject(showToken: boolean = true) {
    const { id, username, created, token, ideas } = this;
    const returnObject: UserRO = { id, username, created, ideas };
    if (showToken) {
      returnObject.token = token;
    }
    return returnObject;
  }

  async comparePassword(attempt: string) {
    return await bycrpt.compare(attempt, this.password);
  }

  private get token() {
    const { id, username } = this;

    return jwt.sign({ id, username }, process.env.JWT_SECRET);
  }
}
