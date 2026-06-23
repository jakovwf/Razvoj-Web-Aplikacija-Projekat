import { Module } from '@nestjs/common';
import { AttachmentBoardRoleGuard } from './guards/attachment-board-role.guard';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentsService, AttachmentBoardRoleGuard],
})
export class AttachmentsModule {}
