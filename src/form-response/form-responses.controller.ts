import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FormResponseService } from './form-responses.service';
import { CreateFormResponseDto } from './dto/create-form-response.dto';
import { UpdateFormResponseDto } from './dto/update-form-response.dto';
import { ResponderGuard } from 'src/auth/responder.guard';
import { GetOwner } from 'src/decorators/owner.decorator';
import { type OwnerDocument } from 'src/owner/entities/owner.entity';
import { OwnerGuard } from 'src/auth/owner.guard';

@Controller('form-response')
export class FormResponseController {
  constructor(private readonly formsService: FormResponseService) { }

  @UseGuards(ResponderGuard)
  @Post()
  create(
    @Body() createFormResponseDto: CreateFormResponseDto,
    @GetOwner() owner: OwnerDocument,
  ) {
    return this.formsService.create(createFormResponseDto, owner);
  }

  @UseGuards(OwnerGuard)
  @Get()
  findAll(@GetOwner() owner: OwnerDocument) {
    return this.formsService.findAll(owner);
  }

  @UseGuards(OwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @GetOwner() owner: OwnerDocument) {
    return this.formsService.findOne(id, owner);
  }

  @UseGuards(ResponderGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormResponseDto: UpdateFormResponseDto,
    @GetOwner() owner: OwnerDocument,
  ) {
    return this.formsService.update(id, updateFormResponseDto, owner);
  }

  @UseGuards(OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetOwner() owner: OwnerDocument) {
    return this.formsService.remove(id, owner);
  }
}
