import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { SiteVisitsService } from './site-visits.service';
import { CreateSiteVisitDto } from './dto/create-site-visit.dto';
import { UpdateSiteVisitDto } from './dto/update-site-visit.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { VisitOutcome } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Site Visits')
@Controller('site-visits')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class SiteVisitsController {
  constructor(private readonly siteVisitsService: SiteVisitsService) {}

  @Get()
  @ApiOperation({ summary: 'List site visits with filters' })
  @ApiQuery({ name: 'leadId', required: false })
  @ApiQuery({ name: 'outcome', enum: VisitOutcome, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 25 })
  async findAll(
    @Query('leadId') leadId?: string,
    @Query('outcome') outcome?: VisitOutcome,
    @Query('page') page = 1,
    @Query('limit') limit = 25,
  ) {
    return this.siteVisitsService.findAll({ leadId, outcome }, +page, +limit);
  }

  @Post()
  @ApiOperation({ summary: 'Schedule a new site visit' })
  async create(@CurrentUser() user: any, @Body() dto: CreateSiteVisitDto) {
    return this.siteVisitsService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update site visit status or notes' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSiteVisitDto,
    @CurrentUser() user: any,
  ) {
    return this.siteVisitsService.update(id, user.id, dto);
  }
}

