import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UnsubscribeDto } from './dto/unsubscribe.dto';
import { PushService } from './push.service';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Get('vapid-public-key')
  getVapidPublicKey() {
    return this.pushService.getVapidPublicKey();
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  subscribe(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.pushService.subscribe(
      request.user.userId,
      createSubscriptionDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unsubscribe')
  unsubscribe(
    @Body() unsubscribeDto: UnsubscribeDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.pushService.unsubscribe(request.user.userId, unsubscribeDto);
  }
}
