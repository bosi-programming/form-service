import { Controller, Post, Body } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { CreateOwnerDto } from './dto/create-owner.dto';

@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) { }

  @Post()
  create(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownerService.create(createOwnerDto);
  }
}
