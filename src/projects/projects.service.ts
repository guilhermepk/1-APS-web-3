import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(createProjectDto: CreateProjectDto) {
    // TODO: verificar se ja existe um projeto com o mesmo nome

    return await this.prisma.project.create({ data: createProjectDto });
  }

  async findAll() {
    const foundProjects = await this.prisma.project.findMany();

    if (!foundProjects || foundProjects.length < 1) throw new NotFoundException('Nenhum projeto encontrado');

    return foundProjects;
  }

  async findOne(id: number) {
    const foundProject = await this.prisma.project.findUnique({
      where: { id }
    });

    if (!foundProject) throw new NotFoundException(`Projeto ${id} não encontrado`);

    return foundProject;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);

    // TODO: verificar se ja existe um projeto com o mesmo nome

    const result = await this.prisma.project.update({
      where: { id },
      data: updateProjectDto
    });

    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
