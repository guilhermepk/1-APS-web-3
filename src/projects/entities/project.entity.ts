import { TaskEntity } from "src/tasks/entities/task.entity";

export class ProjectEntity {
    id: number;
    name: string;
    tasks?: TaskEntity[];
}