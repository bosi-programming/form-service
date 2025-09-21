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
  ) {}
  create(createFormResponseDto: CreateFormResponseDto) {
    const formResponse = new this.formResponseModel(createFormResponseDto);
    return formResponse.save();
  }

  findAll() {
    return this.formResponseModel.find();
  }

  findOne(id: string) {
    return this.formResponseModel.findById(id);
  }

  update(id: string, updateFormResponseDto: UpdateFormResponseDto) {
    return this.formResponseModel.findByIdAndUpdate(id, updateFormResponseDto);
  }

  remove(id: string) {
    return this.formResponseModel.findByIdAndDelete(id);
  }
}
