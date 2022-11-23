import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { runInThisContext } from 'vm';
import { CreateCarDto, UpdateCarDto } from './dto';
import { Car } from './interfaces/car.interface';

@Injectable()
export class CarsService {
  private cars: Car[] = [
    // {
    //   id: '070d7290-a873-496b-bdef-85e300f96146',
    //   brand: 'Toyota',
    //   model: 'Corolla',
    // },
  ];

  findAll() {
    return this.cars;
  }
  findOneById(id: string) {
    const car = this.cars.find((car) => car.id == id);
    if (!car) throw new NotFoundException(`Cart with id '${id}' not found'`);
    return car;
  }
  create(createCartDto: CreateCarDto) {
    const car: Car = { id: uuid(), ...createCartDto };
    this.cars.push(car);
    return car;
  }
  update(id: string, updateCarDto: UpdateCarDto) {
    if (updateCarDto.id && updateCarDto.id !== id)
      throw new BadRequestException(`Car id is not valid inside body`);
    let carDB = this.findOneById(id);
    this.cars = this.cars.map((car) => {
      if (car.id === id) {
        carDB = { ...carDB, ...updateCarDto, id };
        return carDB;
      }
      return car;
    });
    return carDB;
  }
  delete(id: string) {
    let car = this.findOneById(id);
    this.cars = this.cars.filter((car) => car.id !== id);
    return car;
  }
  fillCarsWithSeedData(cars: Car[]) {
    this.cars = cars;
  }
}
