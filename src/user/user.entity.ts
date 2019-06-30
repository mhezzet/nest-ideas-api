import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import * as bycrpt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './dto/userRo.dto';

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

  @BeforeInsert()
  async hashPassword() {
    const salt = await bycrpt.genSalt(10);
    this.password = await bycrpt.hash(this.password, salt);
  }

  toResponseObject(showToken: boolean = true) {
    const { id, username, created, token } = this;
    const returnObject: UserRO = { id, username, created };
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
