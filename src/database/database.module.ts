import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { BASE_CONFIG } from '../index.config';
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri:
            BASE_CONFIG.MODE === 'test'
              ? BASE_CONFIG.DB_CONNECTION_TEST_PATH
              : BASE_CONFIG.DB_CONNECTION_PATH,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
