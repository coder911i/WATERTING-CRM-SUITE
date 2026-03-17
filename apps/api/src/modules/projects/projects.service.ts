import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTowerDto } from './dto/create-tower.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 25) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        skip,
        take: limit,
        include: { _count: { select: { towers: true } } },
      }),
      this.prisma.project.count(),
    ]);
    return { items, total, page, limit };
  }

  async create(dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: dto as any,
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id },
      include: { towers: { include: { _count: { select: { units: true } } } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findFirst({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    return this.prisma.project.update({
      where: { id },
      data: dto as any,
    });
  }

  async addTower(projectId: string, dto: CreateTowerDto) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');

    return this.prisma.tower.create({
      data: { ...dto, projectId } as any,
    });
  }
}
