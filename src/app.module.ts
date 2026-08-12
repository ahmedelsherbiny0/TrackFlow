import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_CONFIG } from './config/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(DATABASE_CONFIG)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
