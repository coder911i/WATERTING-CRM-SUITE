import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTowerDto } from './dto/create-tower.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, page = 1, limit = 25) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where: { tenantId },
        skip,
        take: limit,
        include: { _count: { select: { towers: true } } },
      }),
      this.prisma.project.count({ where: { tenantId } }),
    ]);
    return { items, total, page, limit };
  }

  async create(tenantId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: { ...dto, tenantId },
    });
  }

  async findOne(id: string, tenantId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, tenantId },
      include: { towers: { include: { _count: { select: { units: true } } } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, tenantId: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findFirst({ where: { id, tenantId } });
    if (!project) throw new NotFoundException('Project not found');

    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  async addTower(projectId: string, tenantId: string, dto: CreateTowerDto) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, tenantId } });
    if (!project) throw new NotFoundException('Project not found');

    return this.prisma.tower.create({
      data: { ...dto, projectId, tenantId },
    });
  }
}
