import { Module } from '@nestjs/common';
import { FormTemplateService } from './form-template.service';
import { FormTemplateController } from './form-template.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FormTemplate,
  FormTemplateSchema,
} from './entities/form-template.entity';
import { OwnerModule } from 'src/owner/owner.module';
import { Owner, OwnerSchema } from 'src/owner/entities/owner.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FormTemplate.name, schema: FormTemplateSchema },
      { name: Owner.name, schema: OwnerSchema },
    ]),
    OwnerModule,
  ],
  controllers: [FormTemplateController],
  providers: [FormTemplateService],
  exports: [FormTemplateService],
})
export class FormTemplateModule { }
