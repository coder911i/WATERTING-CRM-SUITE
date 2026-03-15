import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Automations')
@Controller('automations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AutomationController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all rules' })
  async findAll(@CurrentUser() user: any) {
    return this.prisma.automation.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create automation rule' })
  async create(@CurrentUser() user: any, @Body() body: any) {
    return this.prisma.automation.create({
      data: {
        tenantId: user.tenantId,
        name: body.name,
        description: body.description || null,
        trigger: body.trigger,
        conditions: body.conditions || [],
        actions: body.actions,
      },
    });
  }
}
