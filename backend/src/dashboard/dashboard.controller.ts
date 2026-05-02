import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles('admin')
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('medico')
  @Roles('medico')
  getMedicoDashboard(@Request() req) {
    return this.dashboardService.getMedicoDashboard(req.user.userId);
  }

  @Get('recepcao')
  @Roles('admin', 'recepcionista')
  getRecepcaoDashboard() {
    return this.dashboardService.getRecepcaoDashboard();
  }
}
