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
import { FormTemplateService } from './form-template.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { GetOwner } from 'src/decorators/owner.decorator';
import { OwnerGuard } from 'src/auth/owner.guard';

@Controller('form-template')
export class FormTemplateController {
  constructor(private readonly formTemplateService: FormTemplateService) { }

  @UseGuards(OwnerGuard)
  @Post()
  create(
    @Body() createFormTemplateDto: CreateFormTemplateDto,
    @GetOwner() owner: string,
  ) {
    return this.formTemplateService.create(createFormTemplateDto, owner);
  }

  @UseGuards(OwnerGuard)
  @Get()
  findAll(@GetOwner() owner: string) {
    return this.formTemplateService.findAll(owner);
  }

  @UseGuards(OwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @GetOwner() owner: string) {
    return this.formTemplateService.findOne(id, owner);
  }

  @UseGuards(OwnerGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormTemplateDto: UpdateFormTemplateDto,
    @GetOwner() owner: string,
  ) {
    return this.formTemplateService.update(id, updateFormTemplateDto, owner);
  }

  @UseGuards(OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetOwner() owner: string) {
    return this.formTemplateService.remove(id, owner);
  }
}
