import { Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { DATABASE_PROVIDER } from 'src/config/model-providers.config';
import * as autoIncrement from 'mongoose-id-autoincrement';
// import { initSettlementSchemaIncrement } from 'src/models/schemas/settlement.schema';

export const databaseProviders = [
  {
    provide: DATABASE_PROVIDER,
    useFactory: async (): Promise<typeof mongoose> => {
      const db = await mongoose.connect('mongodb://localhost:27017/sum_org_db');
      autoIncrement.initialize(db);
      // initSettlementSchemaIncrement();
      return db;
    }
  },
];

