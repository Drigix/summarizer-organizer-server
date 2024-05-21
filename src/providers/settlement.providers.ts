import { Connection, connection } from 'mongoose';
import { DATABASE_PROVIDER, SETTLEMENT_MODEL_PROVIDER, USER_MODEL_PROVIDER } from 'src/config/model-providers.config';
import { SettlementSchema } from 'src/models/schemas/settlement.schema';

export const settlementProviders = [
  {
    provide: SETTLEMENT_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('Settlement', SettlementSchema),
    inject: [DATABASE_PROVIDER],
  },
];