import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SeedService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("PokemonService");
  onModuleInit() {
    this.$connect();
    this.logger.log("MongoDB connected");
  }

  async executeSeed() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
    const data: PokeResponse = await res.json();

    let seed = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      return { name, no ,type: '' };
    });

    await this.pokemon.createMany({ data: seed });
    return 'se ha creado el seed';
  }
}
