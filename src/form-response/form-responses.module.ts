import { Module } from '@nestjs/common';
import { FormResponseService } from './form-responses.service';
import { FormResponseController } from './form-responses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FormResponse,
  FormResponseSchema,
} from './entities/form-response.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FormResponse.name, schema: FormResponseSchema },
    ]),
  ],
  controllers: [FormResponseController],
  providers: [FormResponseService],
})
export class FormResponseModule {}
