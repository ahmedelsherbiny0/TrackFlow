import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty({ message: 'name should not be empty' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'title should not be empty' })
  @IsString()
  title!: string;

  @IsString()
  description!: string;
}
