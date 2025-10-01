import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Owner, OwnerSchema } from './entities/owner.entity';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Owner.name, schema: OwnerSchema }]),
  ],
  controllers: [OwnerController],
  providers: [OwnerService],
  exports: [OwnerService],
})
export class OwnerModule { }
