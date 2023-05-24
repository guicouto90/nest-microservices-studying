import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadorSchema } from 'src/jogadores/interfaces/jogador.schema';
import { CategoriaSchema } from './interfaces/categoria.schema';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Jogador', schema: JogadorSchema },
      { name: 'Categoria', schema: CategoriaSchema },
    ]),
  ],
})
export class CategoriasModule {}
