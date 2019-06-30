import { IdeaEntity } from 'src/idea/idea.entity';

export class UserRO {
  id: string;
  username: string;
  created: Date;
  token?: string;
  ideas?: IdeaEntity[];
}
