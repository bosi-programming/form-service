import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Owner } from 'src/owner/entities/owner.entity';
import { FormResponseController } from './form-responses.controller';
import { FormResponseService } from './form-responses.service';

describe('FormResponseController', () => {
  let controller: FormResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormResponseController],
      providers: [
        { provide: FormResponseService, useValue: {} },
        { provide: getModelToken(Owner.name), useValue: {} },
        JwtService,
      ],
    }).compile();

    controller = module.get<FormResponseController>(FormResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
