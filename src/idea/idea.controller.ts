import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../common/validation.pipe';
import { AuthGuard } from 'src/common/auth.guard';
import { User } from 'src/user/user.decorator';

@Controller('api/idea')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  getAllIdeas() {
    return this.ideaService.showAll();
  }

  @Get(':id')
  getIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createIdea(@Body() data: IdeaDTO, @User('id') userID: string) {
    return this.ideaService.create(data, userID);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateIdea(
    @Param('id') id: string,
    @Body() data: Partial<IdeaDTO>,
    @User('id') userID: string,
  ) {
    return this.ideaService.update(id, data, userID);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  deleteIdea(@Param('id') id: string, @User('id') userID: string) {
    return this.ideaService.destroy(id, userID);
  }
}
