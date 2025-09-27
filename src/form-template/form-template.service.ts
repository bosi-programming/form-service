import { Injectable } from '@nestjs/common';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { FormTemplate } from './entities/form-template.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OwnerDocument } from 'src/owner/entities/owner.entity';

@Injectable()
export class FormTemplateService {
  constructor(
    @InjectModel(FormTemplate.name)
    private formTemplateModel: Model<FormTemplate>,
  ) { }
  create(createFormTemplateDto: CreateFormTemplateDto, owner: OwnerDocument) {
    const formTemplate = new this.formTemplateModel({
      ...createFormTemplateDto,
      owner: owner._id,
    });
    return formTemplate.save();
  }

  findAll(owner: OwnerDocument) {
    return this.formTemplateModel.find({ owner: owner._id });
  }

  findOne(id: string, owner: OwnerDocument) {
    return this.formTemplateModel.findOne({ _id: id, owner: owner._id });
  }

  async update(
    id: string,
    updateFormTemplateDto: UpdateFormTemplateDto,
    owner: OwnerDocument,
  ) {
    const currentFormTemplate = await this.formTemplateModel.findOne({
      _id: id,
      owner: owner._id,
    });
    return this.formTemplateModel.findOneAndUpdate(
      { _id: id, owner: owner._id },
      {...currentFormTemplate, ...updateFormTemplateDto},
    );
  }

  remove(id: string, owner: OwnerDocument) {
    return this.formTemplateModel.findOneAndDelete({
      _id: id,
      owner: owner._id,
    });
  }
}
