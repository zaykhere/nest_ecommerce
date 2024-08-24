import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigService} from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.getOrThrow('PG_HOST'),
      port: configService.getOrThrow('PG_PORT'),
      database: configService.getOrThrow('PG_DBNAME'),
      username: configService.getOrThrow('PG_USERNAME'),
      password: configService.getOrThrow('PG_PASS'),
      autoLoadEntities: true,
      synchronize: configService.getOrThrow('PG_SYNCHRONIZE'),
      logging: true, // Enables query logging
      logger: 'advanced-console', // Optional: choose a logging format
    }),
    inject: [ConfigService]
  })]
})
export class DatabaseModule {}
