import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Post('add')
  async addPlayer(
    @Body() { player, score }: { player: string; score: number },
  ) {
    await this.leaderboardService.addPlayer(player, score);
    return { message: 'Player added to leaderboard' };
  }

  @Get('top/:count')
  async getTopPlayers(@Param('count') count: number) {
    const players = await this.leaderboardService.getTopPlayers(count);
    return { players };
  }

  @Get('rank/:player')
  async getPlayerRank(@Param('player') player: string) {
    const rank = await this.leaderboardService.getPlayerRank(player);
    return { player, rank };
  }

  @Patch('score')
  async incrementScore(
    @Body() { player, increment }: { player: string; increment: number },
  ) {
    await this.leaderboardService.incrementPlayerScore(player, increment);
    return { message: 'Player score incremented' };
  }

  @Delete('remove/:player')
  async removePlayer(@Param('player') player: string) {
    await this.leaderboardService.removePlayer(player);
    return { message: 'Player removed from leaderboard' };
  }

  @Get('list')
  async getLeaderboard() {
    const leaderboard = await this.leaderboardService.getLeaderboard();
    return { leaderboard };
  }

  @Get('total')
  async getTotalPlayers() {
    const totalPlayers = await this.leaderboardService.totalPlayers();
    return { totalPlayers };
  }
}
