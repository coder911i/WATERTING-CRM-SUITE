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
  @ApiOperation({ summary: 'List inventory with filters' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'towerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: UnitStatus })
  @ApiQuery({ name: 'bhk', required: false })
  async findAll(
    @Query('projectId') projectId?: string,
    @Query('towerId') towerId?: string,
    @Query('status') status?: UnitStatus,
    @Query('bhk') bhk?: string,
  ) {
    return this.inventoryService.findAll({ projectId, towerId, status, bhk });
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Add unit manually' })
  async create(@Body() dto: CreateUnitDto) {
    return this.inventoryService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update unit details' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUnitDto,
  ) {
    return this.inventoryService.update(id, dto);
  }

  @Post(':id/reserve')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT)
  @ApiOperation({ summary: 'Reserve unit for a lead' })
  async reserve(
    @Param('id') id: string,
    @Body() dto: ReserveUnitDto,
  ) {
    return this.inventoryService.reserve(id, dto);
  }

  @Post(':id/unreserve')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Remove reservation' })
  async unreserve(
    @Param('id') id: string,
  ) {
    return this.inventoryService.unreserve(id);
  }

  @Patch('bulk/price')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Bulk update unit prices' })
  async bulkUpdatePrice(
    @Body('towerId') towerId: string,
    @Body('floor') floor: number,
    @Body('basePrice') basePrice: number,
  ) {
    return this.inventoryService.bulkUpdatePrice({ towerId, floor }, basePrice);
  }
}
