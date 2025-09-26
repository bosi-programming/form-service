import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FormResponseService } from './form-responses.service';
import { CreateFormResponseDto } from './dto/create-form-response.dto';
import { UpdateFormResponseDto } from './dto/update-form-response.dto';
import { ResponderGuard } from 'src/auth/responder.guard';
import { GetOwner } from 'src/decorators/owner.decorator';
import { Owner } from 'src/owner/entities/owner.entity';

@Controller('form-response')
export class FormResponseController {
  constructor(private readonly formsService: FormResponseService) { }

  @UseGuards(ResponderGuard)
  @Post()
  create(
    @Body() createFormResponseDto: CreateFormResponseDto,
    @GetOwner() owner: Owner,
  ) {
    return this.formsService.create(createFormResponseDto);
  }

  @Get()
  findAll() {
    return this.formsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormResponseDto: UpdateFormResponseDto,
  ) {
    return this.formsService.update(id, updateFormResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formsService.remove(id);
  }
}
