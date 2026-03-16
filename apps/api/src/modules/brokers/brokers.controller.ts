import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { BrokersService } from './brokers.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Brokers')
@Controller('brokers')
export class BrokersController {
  constructor(private readonly brokersService: BrokersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all brokers in tenant' })
  async findAll(@CurrentUser() user: any) {
    return this.brokersService.findAll(user.tenantId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add broker manually' })
  async create(@CurrentUser() user: any, @Body() dto: CreateBrokerDto) {
    return this.brokersService.create(user.tenantId, dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Public self-registration for brokers' })
  async registerPublic(@Query('tenantId') tenantId: string, @Body() dto: CreateBrokerDto) {
    return this.brokersService.registerPublic(tenantId, dto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get broker profile with stats' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.brokersService.findOne(id, user.tenantId);
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve broker account' })
  async approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.brokersService.approve(id, user.tenantId);
  }

  @Patch(':id/deactivate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate broker' })
  async deactivate(@Param('id') id: string, @CurrentUser() user: any) {
    return this.brokersService.deactivate(id, user.tenantId);
  }
}
