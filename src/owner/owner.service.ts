import { Injectable } from '@nestjs/common';
import { Owner } from './entities/owner.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOwnerDto } from './dto/create-owner.dto';

@Injectable()
export class OwnerService {
  constructor(
    @InjectModel(Owner.name)
    private ownerModel: Model<Owner>,
  ) { }

  // TODO: Encript password and create responderToken
  create(createOwnerDto: CreateOwnerDto) {
    const formTemplate = new this.ownerModel(createOwnerDto);
    return formTemplate.save();
  }

  findAll() {
    return this.ownerModel.find();
  }

  findOne(id: string) {
    return this.ownerModel.findById(id);
  }
}
