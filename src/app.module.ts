import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormsModule } from './forms/forms.module';
import { FormTemplateModule } from './form-template/form-template.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [FormsModule, FormTemplateModule, MongooseModule.forRoot('mongodb://localhost/nest')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
