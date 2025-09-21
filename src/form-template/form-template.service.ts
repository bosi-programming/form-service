import { Injectable } from '@nestjs/common';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { FormTemplate } from './entities/form-template.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FormTemplateService {
  constructor(
    @InjectModel(FormTemplate.name)
    private formTemplateModel: Model<FormTemplate>,
  ) {}
  create(createFormTemplateDto: CreateFormTemplateDto) {
    const formTemplate = new this.formTemplateModel(createFormTemplateDto);
    return formTemplate.save();
  }

  findAll() {
    return this.formTemplateModel.find();
  }

  findOne(id: string) {
    return this.formTemplateModel.findById(id);
  }

  update(id: string, updateFormTemplateDto: UpdateFormTemplateDto) {
    return this.formTemplateModel.findByIdAndUpdate(id, updateFormTemplateDto);
  }

  remove(id: string) {
    return this.formTemplateModel.findByIdAndDelete(id);
  }
}
