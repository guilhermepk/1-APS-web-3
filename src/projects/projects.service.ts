import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectEntity } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async verifyIfNameIsUsed(name: string): Promise<void> {
    const foundProject = await this.prisma.project.findUnique({
      where: { name }
    });

    if (foundProject) throw new ForbiddenException(`Já existe um projeto com o nome ${name}`);
  }

  async create(createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    await this.verifyIfNameIsUsed(createProjectDto.name);

    return await this.prisma.project.create({ data: createProjectDto });
  }

  async findAll(): Promise<Array<ProjectEntity>> {
    const foundProjects = await this.prisma.project.findMany();

    if (!foundProjects || foundProjects.length < 1) throw new NotFoundException('Nenhum projeto encontrado');

    return foundProjects;
  }

  async findOne(id: number): Promise<ProjectEntity> {
    const foundProject = await this.prisma.project.findUnique({
      where: { id }
    });

    if (!foundProject) throw new NotFoundException(`Projeto ${id} não encontrado`);

    return foundProject;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<ProjectEntity> {
    if (Object.values(updateProjectDto).length < 1) throw new BadRequestException('Ao menos alguma informação deve ser enviada para a atualização');

    await this.findOne(id);

    if (updateProjectDto.name) await this.verifyIfNameIsUsed(updateProjectDto.name);

    const result = await this.prisma.project.update({
      where: { id },
      data: updateProjectDto
    });

    return result;
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);

    const result = await this.prisma.project.delete({
      where: { id }
    });

    if (!result) throw new UnprocessableEntityException(`Não foi possível deletar o projteo ${id}`);

    return { message: `Projeto ${id} deletado com sucesso` };
  }
}
