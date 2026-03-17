import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ChangeStageDto } from './dto/change-stage.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, PipelineStage } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Leads')
@Controller('leads')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'List leads with filters' })
  @ApiQuery({ name: 'stage', required: false, enum: PipelineStage })
  @ApiQuery({ name: 'agentId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 25 })
  async findAll(
    @Query('stage') stage?: PipelineStage,
    @Query('agentId') agentId?: string,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 25,
  ) {
    return this.leadsService.findAll({ stage, agentId, search }, +page, +limit);
  }

  @Post()
  @Roles(UserRole.TENANT_ADMIN, UserRole.SALES_MANAGER, UserRole.SALES_AGENT)
  @ApiOperation({ summary: 'Add lead manually' })
  async create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead detail with activities' })
  async findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.TENANT_ADMIN, UserRole.SALES_MANAGER, UserRole.SALES_AGENT)
  @ApiOperation({ summary: 'Update lead info' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    return this.leadsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.TENANT_ADMIN, UserRole.SALES_MANAGER)
  @ApiOperation({ summary: 'Soft delete lead' })
  async remove(@Param('id') id: string) {
    return this.leadsService.softDelete(id);
  }

  @Patch(':id/stage')
  @Roles(UserRole.TENANT_ADMIN, UserRole.SALES_MANAGER, UserRole.SALES_AGENT)
  @ApiOperation({ summary: 'Change lead pipeline stage' })
  async changeStage(
    @Param('id') id: string,
    @Body('stage') stage: PipelineStage,
    @CurrentUser() user: any,
  ) {
    return this.leadsService.changeStage(id, stage, user.id);
  }

  @Get(':id/recommendations')
  @ApiOperation({ summary: 'Get AI property recommendations for lead' })
  async getRecommendations(@Param('id') id: string) {
    return this.leadsService.getRecommendations(id);
  }

  @Post(':id/assign')
  @Roles(UserRole.TENANT_ADMIN, UserRole.SALES_MANAGER)
  @ApiOperation({ summary: 'Assign lead to agent' })
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignLeadDto,
  ) {
    return this.leadsService.assign(id, dto.agentId);
  }
}
