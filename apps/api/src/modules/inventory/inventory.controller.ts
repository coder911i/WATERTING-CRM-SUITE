import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { ReserveUnitDto } from './dto/reserve-unit.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, UnitStatus } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Inventory')
@Controller('units')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'List units with filters' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'towerId', required: false })
  @ApiQuery({ name: 'status', enum: UnitStatus, required: false })
  @ApiQuery({ name: 'bhk', required: false })
  async findAll(
    @CurrentUser() user: any,
    @Query('projectId') projectId?: string,
    @Query('towerId') towerId?: string,
    @Query('status') status?: UnitStatus,
    @Query('bhk') bhk?: string,
  ) {
    return this.inventoryService.findAll(user.tenantId, { projectId, towerId, status, bhk });
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new unit' })
  async create(@CurrentUser() user: any, @Body() dto: CreateUnitDto) {
    return this.inventoryService.create(user.tenantId, dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update unit details or status' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUnitDto,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.update(id, user.tenantId, dto);
  }

  @Post(':id/reserve')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT)
  @ApiOperation({ summary: 'Reserve unit for a lead' })
  async reserve(
    @Param('id') id: string,
    @Body() dto: ReserveUnitDto,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.reserve(id, user.tenantId, dto);
  }

  @Post(':id/unreserve')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Release unit reservation' })
  async unreserve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.inventoryService.unreserve(id, user.tenantId);
  }
}
