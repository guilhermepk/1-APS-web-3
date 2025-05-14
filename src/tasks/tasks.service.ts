import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectsService } from 'src/projects/projects.service';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService
  ) { }

  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    await this.projectsService.findOne(createTaskDto.projectId);

    return await this.prisma.task.create({
      data: createTaskDto
    });
  }

  async findAll(): Promise<Array<TaskEntity>> {
    const result = await this.prisma.task.findMany();

    if (!result || result.length < 1) throw new NotFoundException(`Nenhuma tarefa encontrada`);

    return result;
  }

  async findOne(id: number): Promise<TaskEntity> {
    const result = await this.prisma.task.findUnique({
      where: { id }
    });

    if (!result) throw new NotFoundException(`Tarefa ${id} não encontrada`);

    return result
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    if (Object.values(updateTaskDto).length < 1) throw new UnprocessableEntityException('Ao menos alguma informação deve ser enviada para a atualização');

    await this.findOne(id);

    if (updateTaskDto.projectId) await this.projectsService.findOne(updateTaskDto.projectId);

    const result = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto
    });

    if (!result) throw new UnprocessableEntityException(`N"ao foi possível atualizar a tarefa ${id}`);

    return result;
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);

    const result = await this.prisma.task.delete({
      where: { id }
    });

    if (!result) throw new UnprocessableEntityException(`Não foi possível remover a tarefa ${id}`);

    return { message: `Tarefa ${id} removida com sucesso` };
  }
}
