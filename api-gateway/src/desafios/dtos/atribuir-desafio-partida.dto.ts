import { IsNotEmpty } from 'class-validator';

export class AtribuirDesafioPartidaDto {
  @IsNotEmpty()
  def: string;

  @IsNotEmpty()
  resultado: Resultado[];
}

export interface Resultado {
  set: string;
}
