import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.TENANT_ADMIN, UserRole.SALES_MANAGER)
  @ApiOperation({ summary: 'List all users in tenant' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @Roles(UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Update user role' })
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ) {
    return this.usersService.updateRole(id, role);
  }
}
