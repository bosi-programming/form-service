import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormResponseModule } from './form-response/form-responses.module';
import { FormTemplateModule } from './form-template/form-template.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { OwnerModule } from './owner/owner.module';

@Module({
  imports: [
    OwnerModule,
    FormResponseModule,
    FormTemplateModule,
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'form-service',
      auth: { username: 'root', password: 'temp' },
      appName: 'form-service',
      retryWrites: true,
      autoCreate: true,
    }),
    SentryModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    AppService,
  ],
})
export class AppModule { }
