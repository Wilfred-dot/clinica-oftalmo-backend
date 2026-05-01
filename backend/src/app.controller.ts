import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('ping')
  async ping() {
    const tables = await this.prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`;
    return { status: 'ok', tables };
  }
}
