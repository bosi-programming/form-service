import { Injectable } from '@nestjs/common';
import { Owner } from './entities/owner.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { encrypt } from 'src/auth/utils';
import { cryptMasterKey } from 'src/auth/constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OwnerService {
  constructor(
    @InjectModel(Owner.name)
    private ownerModel: Model<Owner>,
    private jwtService: JwtService,
  ) { }

  // TODO: Encript password and create responderToken
  async create(createOwnerDto: CreateOwnerDto) {
    const encryptedPassword = encrypt(createOwnerDto.password, cryptMasterKey);
    const owner = new this.ownerModel({
      ...createOwnerDto,
      password: encryptedPassword,
    });
    const savedOwner = await owner.save();
    const responderToken = this.jwtService.signAsync(
      {
        owner: owner._id,
        name: owner.name,
        level: 'responder',
      },
      { expiresIn: '10y' },
    );
    await this.ownerModel.findOneAndUpdate(
      { _id: savedOwner._id },
      { ...savedOwner, responderToken },
    );
    return {
      name: savedOwner.name,
      _id: savedOwner._id,
      responderToken: savedOwner.responderToken,
    };
  }

  findAll() {
    return this.ownerModel.find();
  }

  findOne(id: string) {
    return this.ownerModel.findById(id);
  }
}
