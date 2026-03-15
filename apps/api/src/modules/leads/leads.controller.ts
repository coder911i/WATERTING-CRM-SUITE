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
  @ApiQuery({ name: 'stage', enum: PipelineStage, required: false })
  @ApiQuery({ name: 'source', required: false })
  @ApiQuery({ name: 'agentId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 25 })
  async findAll(
    @CurrentUser() user: any,
    @Query('stage') stage?: PipelineStage,
    @Query('source') source?: any,
    @Query('agentId') agentId?: string,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 25,
  ) {
    return this.leadsService.findAll(user.tenantId, { stage, source, agentId, search }, +page, +limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  async create(@CurrentUser() user: any, @Body() dto: CreateLeadDto) {
    return this.leadsService.create(user.tenantId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead profile detail' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leadsService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lead details' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
    @CurrentUser() user: any,
  ) {
    return this.leadsService.update(id, user.tenantId, dto);
  }

  @Delete(':id')
  @Roles(UserRole.TENANT_ADMIN, UserRole.SALES_MANAGER)
  @ApiOperation({ summary: 'Soft delete lead' })
  async softDelete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leadsService.softDelete(id, user.tenantId);
  }

  @Post(':id/stage')
  @ApiOperation({ summary: 'Change lead pipeline stage' })
  async changeStage(
    @Param('id') id: string,
    @Body() dto: ChangeStageDto,
    @CurrentUser() user: any,
  ) {
    return this.leadsService.changeStage(id, user.tenantId, dto.stage, user.id);
  }

  @Post(':id/assign')
  @Roles(UserRole.TENANT_ADMIN, UserRole.SALES_MANAGER)
  @ApiOperation({ summary: 'Assign lead to agent' })
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignLeadDto,
    @CurrentUser() user: any,
  ) {
    return this.leadsService.assign(id, user.tenantId, dto.agentId);
  }
}
