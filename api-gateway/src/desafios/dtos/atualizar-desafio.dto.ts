import { IsOptional } from 'class-validator';

export enum DesafioStatus {
  REALIZADO = 'REALIZADO',
  PENDENTE = 'PENDENTE',
  ACEITO = 'ACEITO',
  NEGADO = 'NEGADO',
  CANCELADO = 'CANCELADO',
}

export class AtualizarDesafioDto {
  @IsOptional()
  status: DesafioStatus;
}
