import { ProjectEntity } from "src/projects/entities/project.entity";

export class TaskEntity {
    id: number;
    name: string;
    description?: string;
    projectId: number;
    project?: ProjectEntity;
}