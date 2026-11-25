import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Owner } from 'src/owner/entities/owner.entity';
import { FormTemplateController } from './form-template.controller';
import { FormTemplateService } from './form-template.service';
import { FormTemplate } from './entities/form-template.entity';

describe('FormTemplateController', () => {
  let controller: FormTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormTemplateController],
      providers: [
        FormTemplateService,
        { provide: getModelToken(FormTemplate.name), useValue: {} },
        { provide: getModelToken(Owner.name), useValue: {} },
        JwtService,
      ],
    }).compile();

    controller = module.get<FormTemplateController>(FormTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
