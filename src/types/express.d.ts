import { Request } from 'express';
import { Owner } from 'src/owner/entities/owner.entity';

declare module 'express' {
  export interface Request {
    owner?: Owner;
  }
}
