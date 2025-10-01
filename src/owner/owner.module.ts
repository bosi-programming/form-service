import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Owner, OwnerSchema } from './entities/owner.entity';
import { OwnerService } from './owner.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Owner.name, schema: OwnerSchema }]),
  ],
  controllers: [],
  providers: [OwnerService],
  exports: [OwnerService],
})
export class OwnerModule { }
