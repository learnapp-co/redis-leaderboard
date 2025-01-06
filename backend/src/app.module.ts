import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [LeaderboardModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
