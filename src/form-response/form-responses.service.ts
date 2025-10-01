import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FormResponse } from './entities/form-response.entity';
import { CreateFormResponseDto } from './dto/create-form-response.dto';
import { UpdateFormResponseDto } from './dto/update-form-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FormTemplateService } from 'src/form-template/form-template.service';
import { formValidator } from 'src/validations/formValidator';
import { Validators } from 'src/validations/types';

@Injectable()
export class FormResponseService {
  constructor(
    @InjectModel(FormResponse.name)
    private formResponseModel: Model<FormResponse>,
    private formTemplateService: FormTemplateService,
  ) { }
  async create(createFormResponseDto: CreateFormResponseDto, owner: string) {
    const formTemplate = await this.formTemplateService.findOne(
      createFormResponseDto.formTemplate,
      owner,
    );
    if (!formTemplate) {
      throw new HttpException('Missing formTemplate', HttpStatus.BAD_REQUEST);
    }
    const fields = Object.keys(
      Object.fromEntries(formTemplate.validations),
    ).map((key) => ({
      key,
      validator:
        Validators[
        formTemplate.validations
          .get(key)
          ?.toUpperCase() as keyof typeof Validators
        ] || Validators.STRING,
    }));
    const validator = formValidator(fields);
    console.log({
      formTemplate,
      validator,
      fields,
      answers: createFormResponseDto.formAnswers,
    });
    try {
      const isValid = validator.parse(createFormResponseDto.formAnswers);
      if (!isValid) {
        throw new HttpException('Wrong form response', HttpStatus.BAD_REQUEST);
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
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
      { _id: id, owner },
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
