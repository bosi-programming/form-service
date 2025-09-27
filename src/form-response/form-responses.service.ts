import { Injectable } from '@nestjs/common';
import { FormResponse } from './entities/form-response.entity';
import { CreateFormResponseDto } from './dto/create-form-response.dto';
import { UpdateFormResponseDto } from './dto/update-form-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OwnerDocument } from 'src/owner/entities/owner.entity';

@Injectable()
export class FormResponseService {
  constructor(
    @InjectModel(FormResponse.name)
    private formResponseModel: Model<FormResponse>,
  ) { }
  create(createFormResponseDto: CreateFormResponseDto, owner: OwnerDocument) {
    const formResponse = new this.formResponseModel({
      ...createFormResponseDto,
      owner: owner._id,
    });
    return formResponse.save();
  }

  findAll(owner: OwnerDocument) {
    return this.formResponseModel.find({ owner: owner._id });
  }

  findOne(id: string, owner: OwnerDocument) {
    return this.formResponseModel.findOne({ _id: id, owner: owner._id });
  }

  async update(
    id: string,
    updateFormResponseDto: UpdateFormResponseDto,
    owner: OwnerDocument,
  ) {
    const currentFormResponse = await this.formResponseModel.findOne({
      _id: id,
      owner: owner._id,
    });
    return this.formResponseModel.findOneAndUpdate(
      { _id: id, owner: owner._id },
      { ...currentFormResponse, ...updateFormResponseDto },
    );
  }

  remove(id: string, owner: OwnerDocument) {
    return this.formResponseModel.findOneAndDelete({
      _id: id,
      owner: owner.id,
    });
  }
}
