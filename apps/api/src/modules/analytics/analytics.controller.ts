import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.TENANT_ADMIN, UserRole.SALES_MANAGER)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get summary counts and inventory stats for dashboard' })
  async getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('leads-by-status')
  @ApiOperation({ summary: 'Get leads distribution grouping by stage' })
  async getLeadsByStatus() {
    return this.analyticsService.getLeadsByStatus();
  }

  @Get('brokers')
  @ApiOperation({ summary: 'Get broker performance stats' })
  async getBrokerPerformance() {
    return this.analyticsService.getBrokerPerformance();
  }

  @Get('projects')
  @ApiOperation({ summary: 'Get project sales stats' })
  async getProjectSales() {
    return this.analyticsService.getProjectSales();
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Get payment collection forecast for next 30 days' })
  async getPaymentForecast() {
    return this.analyticsService.getPaymentForecast();
  }
}
