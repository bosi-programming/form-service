import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Owner } from './entities/owner.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { hashPassword } from '../auth/password';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OwnerService {
  constructor(
    @InjectModel(Owner.name)
    private ownerModel: Model<Owner>,
    private jwtService: JwtService,
  ) {}

  async create(createOwnerDto: CreateOwnerDto) {
    const ownerWithSameName = await this.ownerModel.findOne({
      name: createOwnerDto.name,
    });
    if (ownerWithSameName) {
      throw new HttpException(
        'Invalid name, try again with a different name',
        HttpStatus.BAD_REQUEST,
      );
    }
    const owner = new this.ownerModel({
      ...createOwnerDto,
      password: await hashPassword(createOwnerDto.password),
    });
    const responderToken = await this.jwtService.signAsync(
      {
        owner: owner._id,
        name: owner.name,
        level: 'responder',
      },
      { expiresIn: '10y' },
    );
    owner.responderToken = responderToken;
    const savedOwner = await owner.save();
    return {
      name: savedOwner.name,
      _id: savedOwner._id,
      responderToken: savedOwner.responderToken,
    };
  }

  findAll() {
    return this.ownerModel.find();
  }

  findById(id: string) {
    return this.ownerModel.findById(id);
  }
  findByName(name: string) {
    return this.ownerModel.findOne({ name });
  }
}
