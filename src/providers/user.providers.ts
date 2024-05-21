import { Connection } from 'mongoose';
import { DATABASE_PROVIDER, USER_MODEL_PROVIDER } from 'src/config/model-providers.config';
import { UserSchema } from 'src/models/schemas/user.schema';

export const userProviders = [
  {
    provide: USER_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: [DATABASE_PROVIDER],
  },
];