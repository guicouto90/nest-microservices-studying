import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/adminbackend', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    CategoriasModule,
    JogadoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
