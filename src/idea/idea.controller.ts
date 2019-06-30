import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../common/validation.pipe';

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
  @UsePipes(new ValidationPipe())
  createIdea(@Body() data: IdeaDTO) {
    return this.ideaService.create(data);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
    return this.ideaService.update(id, data);
  }

  @Delete(':id')
  deleteIdea(@Param('id') id: string) {
    return this.ideaService.destroy(id);
  }
}
