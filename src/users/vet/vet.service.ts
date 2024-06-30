import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { ScheduleValidator } from "../../database/validators/schedule.validator";
import { AnimalValidator } from "../../database/validators/animal.validator";
import { UserValidator } from "../../database/validators/user.validor";
import { roleEnum } from "../../database/dto/role.enum";
import { AnimalTypeValidator } from "../../database/validators/animal-type.validator";
import { SpecialtyValidator } from "../../database/validators/specialty.validator";
import firestoreService from "../../firebase/firestore.service";
import { CollectionEnum, KeyEnum } from "../../enum";

@Injectable()
export class VetService {
    async getMySchedules(id: string): Promise<ScheduleValidator[]> {
        return await firestoreService.getAll(CollectionEnum.schedule, { key: KeyEnum.employee, operator: '==', value: id })
    }

    async getScheduleById(id: string): Promise<ScheduleValidator> {
        return await firestoreService.getById(CollectionEnum.schedule, id)
    }

    async getAnimalById(userId: string, animalIndex: number): Promise<any> {
        const user = await firestoreService.getById(CollectionEnum.users, userId)
        const animals = Object.values(user.animals)

        return animals[animalIndex]
    }

    async getUserByNameAndPhone(name: string, phone: string): Promise<UserValidator> {
        return await firestoreService.getUserByNameAndPhone(CollectionEnum.users, name, phone, roleEnum.customer)
    }

    async getAnimalTypeById(id: string): Promise<AnimalTypeValidator> {
        return await firestoreService.getById(CollectionEnum.animal_type, id)
    }

    async getSpecialtyById(id: string): Promise<SpecialtyValidator> {
        return await firestoreService.getById(CollectionEnum.specialty, id)
    }
}
