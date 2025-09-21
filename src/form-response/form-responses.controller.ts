import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FormResponseService } from './form-responses.service';
import { CreateFormResponseDto } from './dto/create-form-response.dto';
import { UpdateFormResponseDto } from './dto/update-form-response.dto';

@Controller('form-response')
export class FormResponseController {
  constructor(private readonly formsService: FormResponseService) {}

  @Post()
  create(@Body() createFormResponseDto: CreateFormResponseDto) {
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
