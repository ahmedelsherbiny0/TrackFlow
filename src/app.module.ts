import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_CONFIG } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DATABASE_CONFIG),
    AuthModule,
    UsersModule,
    AssignmentsModule,
    TracksModule,
    SubmissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
