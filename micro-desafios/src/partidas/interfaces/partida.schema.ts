import * as mongoose from 'mongoose';

export const PartidaSchema = new mongoose.Schema(
  {
    categoria: { type: mongoose.Schema.Types.ObjectId },
    desafio: { type: mongoose.Schema.Types.ObjectId },
    jogadores: [{ type: mongoose.Schema.Types.ObjectId }],
    def: { type: mongoose.Schema.Types.ObjectId },
    resultado: [{ set: { type: String } }],
  },
  { timstamps: true, collection: 'desafios' },
);
