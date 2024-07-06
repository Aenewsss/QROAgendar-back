import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ScheduleInput } from "../../database/inputs/schedule.input";
import { SpecialtyInput } from "../../database/inputs/specialty.input";
import { VetUpdateInput } from "../../database/inputs/vet-update.input";
import { VetInput } from "../../database/inputs/vet.input";
import { ScheduleValidator } from "../../database/validators/schedule.validator";
import { SpecialtyValidator } from "../../database/validators/specialty.validator";
import { UserValidator } from "../../database/validators/user.validor";
import { CustomerInput } from "../../database/inputs/customer.input";
import { roleEnum } from "../../database/dto/role.enum";
import { AnimalTypeValidator } from "../../database/validators/animal-type.validator";
import { AnimalTypeInput } from "../../database/inputs/animal_type.input";
import { AnimalInput } from "../../database/inputs/animal.input";
import { AnimalValidator } from "../../database/validators/animal.validator";
import { CustomerUpdateInput } from "../../database/inputs/customer-update.input";
import firestoreService from "../../firebase/firestore.service";
import { CollectionEnum, KeyEnum } from "../../enum";

@Injectable()
export class ManagerService {
    async getAllSpecialties(): Promise<SpecialtyValidator[]> {
        return await firestoreService.getAll(CollectionEnum.specialty)
    }
    async getAllVets(): Promise<UserValidator[]> {
        return await firestoreService.getAll(CollectionEnum.users, { key: KeyEnum.role, operator: '==', value: "employee" })
    }
    async getAllSchedules(): Promise<ScheduleValidator[]> {
        return await firestoreService.getAll(CollectionEnum.schedule)
    }

    async getSchedulesByDateRange(startDate: Date, finalDate: Date): Promise<ScheduleValidator[]> {
        return await firestoreService.getSchedulesByDateRange(CollectionEnum.schedule, startDate, finalDate);
    }

    async createVet(vet: VetInput): Promise<UserValidator> {
        const newVet = await firestoreService.create(CollectionEnum.users, vet)

        // atualizar quantidade de funcionários
        await firestoreService.increaseSpecialtyQttEmployees(CollectionEnum.specialty, newVet.specialty_id)

        return newVet
    }

    async createCustomer(customer: CustomerInput): Promise<UserValidator> {
        return await firestoreService.create(CollectionEnum.users, customer)
    }

    async getAllCustomers(): Promise<UserValidator[]> {
        return await firestoreService.getAll(CollectionEnum.users, { key: KeyEnum.role, operator: "==", value: roleEnum.customer })
    }

    async getCustomerById(id: string): Promise<UserValidator> {
        const customer = await firestoreService.getById(CollectionEnum.users, id)
        return {birthdate: customer.birthdate.toDate(),...customer}
    }

    async removeCustomer(id: string): Promise<UserValidator> {
        return await firestoreService.deleteById(CollectionEnum.users, id)
    }

    async updateCustomerById(newCustomer: CustomerInput): Promise<UserValidator> {
        return await firestoreService.findByIdAndUpdate(CollectionEnum.users, newCustomer.id, {
            name: newCustomer.name,
            email: newCustomer.email,
            phone: newCustomer.phone,
            birthdate: newCustomer.birthdate,
            animals: newCustomer.animals,
            adress: newCustomer.adress
        })
    }

    async createAnimalType(animalType: AnimalTypeInput): Promise<AnimalTypeValidator> {
        return await firestoreService.create(CollectionEnum.animal_type, animalType)
    }

    async getAllAnimalTypes(): Promise<AnimalTypeValidator[]> {
        return await firestoreService.getAll(CollectionEnum.animal_type)
    }

    async removeAnimalType(id: string): Promise<AnimalTypeValidator> {
        return await firestoreService.deleteById(CollectionEnum.animal_type, id)
    }

    async updateAnimalTypeById(newAnimalType: AnimalTypeInput): Promise<AnimalTypeValidator> {
        return await firestoreService.findByIdAndUpdate(CollectionEnum.animal_type, newAnimalType.id, { name: newAnimalType.name })
    }

    async createAnimal(animal: AnimalInput): Promise<UserValidator> {
        return await firestoreService.createAnimal(CollectionEnum.users, animal.userId, animal)
    }

    async getAllAnimals(): Promise<AnimalValidator[][]> {
        return (await firestoreService.getAll(CollectionEnum.users)).map(el => el.animals)
    }

    async getAnimalById(userId: string, animalIndex: number): Promise<AnimalValidator> {
        return (await firestoreService.getById(CollectionEnum.users, userId)).animals[animalIndex]
    }

    async removeAnimal(userId: string, animalIndex: number): Promise<UserValidator> {
        const user = await firestoreService.getById(CollectionEnum.users, userId)

        const userUpdated = user
        userUpdated.animals.splice(animalIndex, 1)

        return await firestoreService.findByIdAndUpdate(CollectionEnum.users, userId, { animals: userUpdated.animals })
    }

    async updateAnimalById(userId: string, newAnimal: AnimalInput, animalIndex: number): Promise<UserValidator> {
        const user = await firestoreService.getById(CollectionEnum.users, userId)

        const userUpdated = user
        userUpdated.animals[animalIndex] = newAnimal

        return await firestoreService.findByIdAndUpdate(CollectionEnum.users, userId, { animals: userUpdated.animals })
    }

    async getVetById(id: string): Promise<UserValidator> {
        return await firestoreService.getById(CollectionEnum.users, id)
    }


    async updateVetById(newData: VetUpdateInput): Promise<UserValidator> {
        return await firestoreService.findByIdAndUpdate(CollectionEnum.users, newData.id, {
            name: newData.name,
            color: newData.color,
            email: newData.email,
            phone: newData.phone,
            specialty_id: newData.specialty_id
        })
    }

    async updateCustomerProfileById(id: string, customer: CustomerUpdateInput): Promise<UserValidator> {
        return await firestoreService.findByIdAndUpdate(CollectionEnum.users, id, {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            password: customer.password,
            image_url: customer.image_url,
            birthdate: customer.birthdate,
            adress: customer.adress,
        })
    }

    async removeVetById(id: string): Promise<UserValidator> {
        const vetRemoved = await firestoreService.deleteById(CollectionEnum.users, id)

        await firestoreService.decreaseSpecialtyQttEmployees(CollectionEnum.specialty, vetRemoved.specialty_id)

        return vetRemoved
    }

    async removeSpecialtyById(id: string): Promise<SpecialtyValidator> {
        return await firestoreService.deleteById(CollectionEnum.specialty, id)
    }

    async getSpecialtyById(id: string): Promise<SpecialtyValidator> {
        return await firestoreService.getById(CollectionEnum.specialty, id)
    }

    async createSpecialty(specialty: SpecialtyInput): Promise<SpecialtyValidator> {
        return await firestoreService.create(CollectionEnum.specialty, specialty)
    }

    async createSchedule(schedule: ScheduleInput): Promise<ScheduleValidator> {
        return await firestoreService.create(CollectionEnum.schedule, schedule)
    }

    async verifyScheduleHour(date: Date, employee_id: string, specialty_id: string): Promise<number> {
        return await firestoreService.verifyScheduleHour(CollectionEnum.schedule, date, employee_id, specialty_id)
    }

    async updateAnimalByIndex(index: number, animal: AnimalInput): Promise<UserValidator> {
        return await firestoreService.findByIdAndUpdate(CollectionEnum.users, animal.userId, {
            [`animals.${index}.avatar`]: animal.avatar,
            [`animals.${index}.breed`]: animal.breed,
            [`animals.${index}.color`]: animal.color,
            [`animals.${index}.gender`]: animal.gender,
            [`animals.${index}.name`]: animal.name,
            [`animals.${index}.neutered`]: animal.neutered,
            [`animals.${index}.typeAnimalId`]: animal.typeAnimalId,
        })
    }

    async removeAnimalByIndex(index: number, userId: string): Promise<UserValidator> {
        return await firestoreService.removeAnimalByIndex(CollectionEnum.users, index, userId);
    }

    async updateScheduleById(id: string, schedule: ScheduleInput): Promise<ScheduleValidator> {
        return await firestoreService.findByIdAndUpdate(CollectionEnum.schedule, id, {
            specialty_id: schedule.specialty_id,
            employee_id: schedule.employee_id,
            date: schedule.date,
            customer_name: schedule.customer_name,
            customer_phone: schedule.customer_phone,
            pet_breed: schedule.pet_breed,
            pet_name: schedule.pet_name,
            pet_type: schedule.pet_type,
            text: schedule.text,
            payment: {
                price: schedule.payment.price,
                method: schedule.payment.method,
            },
        })
    }

    async removeScheduleById(id: string): Promise<ScheduleValidator> {
        return await firestoreService.deleteById(CollectionEnum.schedule, id)
    }

}
