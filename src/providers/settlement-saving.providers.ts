import { Connection, connection } from 'mongoose';
import { DATABASE_PROVIDER, SETTLEMENT_SAVING_MODEL_PROVIDER } from 'src/config/model-providers.config';
import { SettlementSavingSchema } from 'src/models/schemas/settlement-saving.schema';

export const settlementSavingProviders = [
  {
    provide: SETTLEMENT_SAVING_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('SettlementSaving', SettlementSavingSchema),
    inject: [DATABASE_PROVIDER],
  },
];