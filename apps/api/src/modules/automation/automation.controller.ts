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
  async findAll() {
    return this.prisma.automation.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create automation rule' })
  async create(@Body() body: any) {
    return this.prisma.automation.create({
      data: {
        name: body.name,
        description: body.description || null,
        trigger: body.trigger,
        conditions: body.conditions || [],
        actions: body.actions,
      },
    });
  }
}
