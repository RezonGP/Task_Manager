import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";



export class CreateTaskDto {
    @IsString()
    @MaxLength(255)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsIn(['todo', 'doing', 'done'])
    status?: 'todo' | 'doing' | 'done';

}
