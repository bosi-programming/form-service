import { Injectable } from '@nestjs/common';
import { FormResponse } from './entities/form-response.entity';
import { CreateFormResponseDto } from './dto/create-form-response.dto';
import { UpdateFormResponseDto } from './dto/update-form-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FormResponseService {
  constructor(
    @InjectModel(FormResponse.name)
    private formResponseModel: Model<FormResponse>,
  ) { }
  create(createFormResponseDto: CreateFormResponseDto, owner: string) {
    const formResponse = new this.formResponseModel({
      ...createFormResponseDto,
      owner,
    });
    return formResponse.save();
  }

  findAll(owner: string) {
    return this.formResponseModel.find({ owner });
  }

  findOne(id: string, owner: string) {
    return this.formResponseModel.findOne({ _id: id, owner });
  }

  async update(
    id: string,
    updateFormResponseDto: UpdateFormResponseDto,
    owner: string,
  ) {
    const currentFormResponse = await this.formResponseModel.findOne({
      _id: id,
      owner,
    });
    return this.formResponseModel.findOneAndUpdate(
      { _id: id, owner},
      { ...currentFormResponse, ...updateFormResponseDto },
    );
  }

  remove(id: string, owner: string) {
    return this.formResponseModel.findOneAndDelete({
      _id: id,
      owner,
    });
  }
}
