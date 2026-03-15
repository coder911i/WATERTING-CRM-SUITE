import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tenants')
@Controller('tenant')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current tenant details' })
  async findOne(@CurrentUser() user: any) {
    return this.tenantsService.findOne(user.tenantId);
  }

  @Patch()
  @Roles(UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Update tenant details' })
  async update(@Body('name') name: string, @CurrentUser() user: any) {
    return this.tenantsService.update(user.tenantId, { name });
  }
}
