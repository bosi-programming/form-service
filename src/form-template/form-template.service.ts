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
  ) { }
  create(createFormTemplateDto: CreateFormTemplateDto, owner: string) {
    const formTemplate = new this.formTemplateModel({
      ...createFormTemplateDto,
      owner,
    });
    return formTemplate.save();
  }

  findAll(owner: string) {
    return this.formTemplateModel.find({ owner });
  }

  findOne(id: string, owner: string) {
    return this.formTemplateModel.findOne({ _id: id, owner });
  }

  async update(
    id: string,
    updateFormTemplateDto: UpdateFormTemplateDto,
    owner: string,
  ) {
    const currentFormTemplate = await this.formTemplateModel.findOne({
      _id: id,
      owner,
    });
    return this.formTemplateModel.findOneAndUpdate(
      { _id: id, owner },
      { ...currentFormTemplate, ...updateFormTemplateDto },
    );
  }

  remove(id: string, owner: string) {
    return this.formTemplateModel.findOneAndDelete({
      _id: id,
      owner,
    });
  }
}
