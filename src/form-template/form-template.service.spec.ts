import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FormTemplateService } from './form-template.service';
import { FormTemplate } from './entities/form-template.entity';

describe('FormTemplateService', () => {
  let service: FormTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormTemplateService,
        { provide: getModelToken(FormTemplate.name), useValue: {} },
      ],
    }).compile();

    service = module.get<FormTemplateService>(FormTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
