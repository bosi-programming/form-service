import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FormTemplateService } from 'src/form-template/form-template.service';
import { FormResponseService } from './form-responses.service';
import { FormResponse } from './entities/form-response.entity';

describe('FormResponseService', () => {
  let service: FormResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormResponseService,
        { provide: getModelToken(FormResponse.name), useValue: {} },
        { provide: FormTemplateService, useValue: {} },
      ],
    }).compile();

    service = module.get<FormResponseService>(FormResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
