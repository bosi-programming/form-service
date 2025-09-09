import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormsModule } from './forms/forms.module';
import { FormTemplateModule } from './form-template/form-template.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    FormsModule,
    FormTemplateModule,
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'form-service',
      auth: { username: 'root', password: 'temp' },
      appName: 'form-service',
      retryWrites: true,
      autoCreate: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
