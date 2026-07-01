import { Module } from '@nestjs/common';
import { GatewayModule } from '../gateway/gateway.module';
import { AttachmentBoardRoleGuard } from './guards/attachment-board-role.guard';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';

@Module({
  imports: [GatewayModule],
  controllers: [AttachmentsController],
  providers: [AttachmentsService, AttachmentBoardRoleGuard],
})
export class AttachmentsModule {}
