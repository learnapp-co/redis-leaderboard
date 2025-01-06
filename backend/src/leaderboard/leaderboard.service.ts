import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class LeaderboardService {
  private leaderboardKey = 'leaderboard';

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async addPlayer(player: string, score: number): Promise<void> {
    await this.redisClient.zadd(this.leaderboardKey, score.toString(), player);
  }

  async getTopPlayers(count: number): Promise<any[]> {
    return await this.redisClient.zrevrange(
      this.leaderboardKey,
      0,
      count - 1,
      'WITHSCORES',
    );
  }

  async getPlayerRank(player: string): Promise<number | null> {
    const rank = await this.redisClient.zrevrank(this.leaderboardKey, player);
    return rank !== null ? rank + 1 : null;
  }

  async getPlayerScore(player: string): Promise<number | null> {
    const score = await this.redisClient.zscore(this.leaderboardKey, player);
    return score ? parseFloat(score) : null;
  }

  async incrementPlayerScore(player: string, increment: number): Promise<void> {
    await this.redisClient.zincrby(
      this.leaderboardKey,
      increment.toString(),
      player,
    );
  }

  async removePlayer(player: string): Promise<void> {
    await this.redisClient.zrem(this.leaderboardKey, player);
  }

  async getLeaderboard(): Promise<{ player: string; score: number }[]> {
    const leaderboard = await this.redisClient.zrevrange(
      this.leaderboardKey,
      0,
      -1,
      'WITHSCORES',
    );
    const result = [];
    for (let i = 0; i < leaderboard.length; i += 2) {
      result.push({
        player: leaderboard[i],
        score: parseFloat(leaderboard[i + 1]),
      });
    }
    return result;
  }

  async totalPlayers(): Promise<number> {
    const totalPlayers = await this.redisClient.zcard(this.leaderboardKey);
    return totalPlayers;
  }
}
