import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormResponseModule } from './form-response/form-responses.module';
import { FormTemplateModule } from './form-template/form-template.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { OwnerModule } from './owner/owner.module';
import { CatchEverythingFilter } from './filters/catch-everything.filter';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { DATABASE_PASSWORD, DATABASE_USER, JWT_SECRET } from './constants';

@Module({
  imports: [
    OwnerModule,
    FormResponseModule,
    FormTemplateModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'form-service',
      auth: { username: DATABASE_USER, password: DATABASE_PASSWORD },
      appName: 'form-service',
      retryWrites: true,
      autoCreate: true,
    }),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
    }),
    SentryModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    AppService,
  ],
})
export class AppModule {}
