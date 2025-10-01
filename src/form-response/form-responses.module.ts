import { Module } from '@nestjs/common';
import { FormResponseService } from './form-responses.service';
import { FormResponseController } from './form-responses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FormResponse,
  FormResponseSchema,
} from './entities/form-response.entity';
import { OwnerModule } from 'src/owner/owner.module';
import { Owner, OwnerSchema } from 'src/owner/entities/owner.entity';
import { FormTemplateModule } from 'src/form-template/form-template.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FormResponse.name, schema: FormResponseSchema },
      { name: Owner.name, schema: OwnerSchema },
    ]),
    OwnerModule,
    FormTemplateModule,
  ],
  controllers: [FormResponseController],
  providers: [FormResponseService],
})
export class FormResponseModule { }
