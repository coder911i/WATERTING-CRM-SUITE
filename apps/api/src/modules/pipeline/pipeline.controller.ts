import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { MoveLeadDto } from './dto/move-lead.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Pipeline')
@Controller('pipeline')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Get()
  @ApiOperation({ summary: 'Get all leads grouped by stage (Kanban)' })
  async getKanban() {
    return this.pipelineService.getKanban();
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move lead to new stage' })
  async moveLead(
    @Param('id') id: string,
    @Body() dto: MoveLeadDto,
    @CurrentUser() user: any,
  ) {
    return this.pipelineService.moveLead(id, dto.stage, user.id);
  }
}
