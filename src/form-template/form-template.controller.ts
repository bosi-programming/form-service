import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FormTemplateService } from './form-template.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { type OwnerDocument } from 'src/owner/entities/owner.entity';
import { GetOwner } from 'src/decorators/owner.decorator';

@Controller('form-template')
export class FormTemplateController {
  constructor(private readonly formTemplateService: FormTemplateService) { }

  @Post()
  create(
    @Body() createFormTemplateDto: CreateFormTemplateDto,
    @GetOwner() owner: OwnerDocument,
  ) {
    return this.formTemplateService.create(createFormTemplateDto, owner);
  }

  @Get()
  findAll(@GetOwner() owner: OwnerDocument) {
    return this.formTemplateService.findAll(owner);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetOwner() owner: OwnerDocument) {
    return this.formTemplateService.findOne(id, owner);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormTemplateDto: UpdateFormTemplateDto,
    @GetOwner() owner: OwnerDocument,
  ) {
    return this.formTemplateService.update(id, updateFormTemplateDto, owner);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetOwner() owner: OwnerDocument) {
    return this.formTemplateService.remove(id, owner);
  }
}
