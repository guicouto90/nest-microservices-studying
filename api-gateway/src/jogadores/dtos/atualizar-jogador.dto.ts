import { IsNotEmpty, IsOptional } from 'class-validator';

export class AtualizarJogadorDto {
  @IsNotEmpty()
  readonly telefoneCelular: string;

  @IsNotEmpty()
  readonly nome: string;

  @IsOptional()
  readonly categoria: string;
}
