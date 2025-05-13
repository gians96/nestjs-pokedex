import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommonModule } from './common/common.module';

@Module({
  imports: [PokemonModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
