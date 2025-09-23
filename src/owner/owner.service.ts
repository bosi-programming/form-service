import { Injectable } from '@nestjs/common';
import { Owner } from './entities/owner.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OwnerService {
  constructor(
    @InjectModel(Owner.name)
    private formTemplateModel: Model<Owner>,
  ) { }

  findAll() {
    return this.formTemplateModel.find();
  }

  findOne(id: string) {
    return this.formTemplateModel.findById(id);
  }
}
