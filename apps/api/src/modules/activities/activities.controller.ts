import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Activities')
@Controller('leads/:id/activities')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get lead activity timeline' })
  async findByLead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.activitiesService.findByLead(id, user.tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Log call, note, or any activity for a lead' })
  async create(
    @Param('id') id: string,
    @Body() dto: CreateActivityDto,
    @CurrentUser() user: any,
  ) {
    return this.activitiesService.create(id, user.tenantId, user.id, dto);
  }
}
