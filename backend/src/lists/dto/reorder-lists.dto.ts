import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class ReorderListItemDto {
  @IsString()
  id!: string;

  @IsNumber()
  position!: number;
}

export class ReorderListsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderListItemDto)
  items!: ReorderListItemDto[];
}
