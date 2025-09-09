import { Injectable } from '@nestjs/common';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { FormTemplate } from './entities/form-template.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FormTemplateService {
  constructor(
    @InjectModel(FormTemplate.name) private formTemplateModel: Model<FormTemplate>,
  ) {}
  create(createFormTemplateDto: CreateFormTemplateDto) {
    const formTemplate = new this.formTemplateModel({ name: 'test' });
    return formTemplate.save();
  }

  findAll() {
    return `This action returns all formTemplate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} formTemplate`;
  }

  update(id: number, updateFormTemplateDto: UpdateFormTemplateDto) {
    return `This action updates a #${id} formTemplate`;
  }

  remove(id: number) {
    return `This action removes a #${id} formTemplate`;
  }
}
