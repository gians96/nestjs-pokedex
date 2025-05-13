import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon, PrismaClient } from '@prisma/client';

@Injectable()
export class PokemonService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger("PokemonService");
  onModuleInit() {
    this.$connect();
    this.logger.log("MongoDB connected");
  }
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {

      const response = await this.pokemon.create({ data: createPokemonDto });
      return response
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    // Buscar por número
    if (!isNaN(+term)) {
      pokemon = await this.pokemon.findFirst({ where: { no: +term } });
    }
    // Buscar por UUID (MongoDB ObjectId: 24 caracteres hexadecimales)
    else if (!pokemon && /^[0-9a-fA-F]{24}$/.test(term)) {
      pokemon = await this.pokemon.findUnique({ where: { id: term } });
    }
    // Buscar por nombre
    else {
      pokemon = await this.pokemon.findFirst({ where: { name: term.toLowerCase().trim() } });
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with identifier "${term}" does not exist`);
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) { pokemon.name = updatePokemonDto.name.toLowerCase(); }
    if (updatePokemonDto.type) { pokemon.type = updatePokemonDto.type.toLowerCase(); }

    // let changes = await this.pokemon.update({ where: { id: pokemon.id }, data: updatePokemonDto });
    try {
      return await this.pokemon.update({ where: { id: pokemon.id }, data: updatePokemonDto });
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    // return { id }
    // const pokemon = await this.findOne(term);
    try {
      return await this.pokemon.delete({ where: { id } });
    } catch (error) {
      this.handleException(error);
    }
  }

  private handleException(error: any) {
    if (error.code === "P2002") {
      throw new BadRequestException(`Duplicate name exists error ${JSON.stringify(error.keyValue)}`);
    }
    if (error.code === "P2025") {
      throw new BadRequestException(`Record to delete does not exist ${JSON.stringify(error.keyValue)}`);
    }
    // this.logger.error(error);
    throw new InternalServerErrorException(error);
  }
}
