import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ManagerService } from './manager.service';
import { UseGuards } from '@nestjs/common';
import { UserValidator } from "../../database/validators/user.validor";
import { VetInput } from "../../database/inputs/vet.input";
import { VetUpdateValidator } from "../../database/validators/vet-update.validator";
import { VetUpdateInput } from "../../database/inputs/vet-update.input";
import { SpecialtyInput } from "../../database/inputs/specialty.input";
import { SpecialtyValidator } from "../../database/validators/specialty.validator";
import { ScheduleValidator } from "../../database/validators/schedule.validator";
import { ScheduleInput } from "../../database/inputs/schedule.input";
import { ScheduleCalendarValidator } from "../../database/validators/schedule-calendar.validator";
import { CustomerInput } from "../../database/inputs/customer.input";
import { AnimalInput } from "../../database/inputs/animal.input";
import { AnimalTypeValidator } from "../../database/validators/animal-type.validator";
import { AnimalTypeInput } from "../../database/inputs/animal_type.input";
import { AnimalValidator } from "../../database/validators/animal.validator";
import { VetService } from "../vet/vet.service";
import { CustomerUpdateInput } from "../../database/inputs/customer-update.input";
import { GqlAuthGuard } from "../../guards/auth.guard";

@Resolver()
export class ManagerResolver {
    constructor(
        private managerService: ManagerService,
        private vetService: VetService
    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserValidator)
    async createVet(
        @Args('vet') vet: VetInput,
    ): Promise<UserValidator> {
        return await this.managerService.createVet(vet);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserValidator)
    async updateVet(
        @Args('vet') vet: VetUpdateInput,
    ): Promise<VetUpdateValidator> {
        return await this.managerService.updateVetById(vet);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserValidator)
    async removeVet(
        @Args('id') id: string,
    ): Promise<UserValidator> {
        return await this.managerService.removeVetById(id);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => SpecialtyValidator)
    async removeSpecialty(
        @Args('id') id: string,
    ): Promise<SpecialtyValidator> {
        const { qtt_employees } = await this.vetService.getSpecialtyById(id)

        if (qtt_employees) throw new Error("Não é possível remover uma especialidade que possui funcionários cadastrados")

        return await this.managerService.removeSpecialtyById(id);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => SpecialtyValidator)
    async createSpecialty(
        @Args('specialty') specialty: SpecialtyInput,
    ): Promise<SpecialtyValidator> {
        return await this.managerService.createSpecialty(specialty);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [SpecialtyValidator])
    async getAllSpecialties(): Promise<SpecialtyValidator[]> {
        return await this.managerService.getAllSpecialties();
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [UserValidator])
    async getAllVets(): Promise<UserValidator[]> {
        return await this.managerService.getAllVets();
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => ScheduleValidator)
    async createSchedule(
        @Args('schedule') schedule: ScheduleInput,
    ): Promise<ScheduleValidator> {
        // const hasScheduleHour = await this.managerService.verifyScheduleHour(schedule.date, schedule.employee_id, schedule.specialty_id)

        // if (hasScheduleHour) throw new Error("Este funcionário já possui um agendamento nesse horário")

        return await this.managerService.createSchedule(schedule);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [ScheduleValidator])
    async getSchedules(): Promise<ScheduleValidator[]> {
        return await this.managerService.getAllSchedules();
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [ScheduleCalendarValidator])
    async getSchedulesCalendar(): Promise<ScheduleCalendarValidator[]> {

        const schedules = await this.managerService.getAllSchedules()

        const scheduleCalendar: ScheduleCalendarValidator[] = await Promise.all(schedules.map(async schedule => {
            const { name, color } = await this.managerService.getVetById(schedule.employee_id)
            const { title } = await this.vetService.getSpecialtyById(schedule.specialty_id)

            return {
                id: schedule.id,
                specialty_name: title,
                pet_name: schedule.pet_name,
                customer_name: schedule.customer_name,
                customer_phone: schedule.customer_phone,
                employee_id: schedule.employee_id,
                specialty_id: schedule.specialty_id,
                // @ts-ignore
                date: schedule.date?.toDate(),
                pet_breed: schedule.pet_breed,
                payment: schedule.payment,
                pet_type: schedule.pet_type,
                employee_name: name,
                employee_color: color
            }
        }))

        return scheduleCalendar;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserValidator)
    async createCustomer(
        @Args('customer') customer: CustomerInput,
    ): Promise<UserValidator> {
        return await this.managerService.createCustomer(customer);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => UserValidator)
    async getAllAnimals(): Promise<AnimalValidator[][]> {
        return await this.managerService.getAllAnimals()
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserValidator)
    async removeAnimal(
        @Args('userId') userId: string,
        @Args('animalIndex') animalIndex: number
    ): Promise<UserValidator> {
        return await this.managerService.removeAnimal(userId, animalIndex)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserValidator)
    async createAnimal(
        @Args('animal') animal: AnimalInput,
    ): Promise<UserValidator> {
        return await this.managerService.createAnimal(animal);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserValidator)
    async updateAnimal(
        @Args('animal') animal: AnimalInput,
        @Args('userId') userId: string,
        @Args('animalIndex') animalIndex: number
    ): Promise<UserValidator> {
        return await this.managerService.updateAnimalById(userId, animal, animalIndex);
    }


    @UseGuards(GqlAuthGuard)
    @Mutation(() => AnimalTypeValidator)
    async createAnimalType(
        @Args('animalType') animalType: AnimalTypeInput,
    ): Promise<AnimalTypeValidator> {
        return await this.managerService.createAnimalType(animalType);
    }


    @UseGuards(GqlAuthGuard)
    @Mutation(() => AnimalTypeValidator)
    async updateAnimalType(
        @Args('animalType') animalType: AnimalTypeInput,
    ): Promise<AnimalTypeValidator> {
        return await this.managerService.updateAnimalTypeById(animalType);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [AnimalTypeValidator])
    async getAllAnimalTypes(): Promise<AnimalTypeValidator[]> {
        return await this.managerService.getAllAnimalTypes()
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => AnimalTypeValidator)
    async removeAnimalType(
        @Args('id') id: string,
    ): Promise<AnimalTypeValidator> {
        return await this.managerService.removeAnimalType(id);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [UserValidator])
    async getAllCustomers(): Promise<UserValidator[]> {
        return await this.managerService.getAllCustomers();
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserValidator)
    async updateCustomerProfile(
        @Args('id') id: string,
        @Args('customer') customer: CustomerUpdateInput,
    ): Promise<UserValidator> {
        return await this.managerService.updateCustomerProfileById(id, customer);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserValidator)
    async updateAnimalByIndex(
        @Args('index') index: number,
        @Args('animal') animal: AnimalInput,
    ): Promise<UserValidator> {
        return await this.managerService.updateAnimalByIndex(index, animal);
    }
    
    @UseGuards(GqlAuthGuard)
    @Mutation(() => UserValidator)
    async removeAnimalByIndex(
        @Args('index') index: number,
        @Args('userId') userId: string,
    ): Promise<UserValidator> {
        return await this.managerService.removeAnimalByIndex(index, userId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => ScheduleValidator)
    async updateSchedule(
        @Args('id') id: string,
        @Args('schedule') schedule: ScheduleInput,
    ): Promise<ScheduleValidator> {
        return await this.managerService.updateScheduleById(id, schedule);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => ScheduleValidator)
    async removeSchedule(
        @Args('id') id: string,
    ): Promise<ScheduleValidator> {
        return await this.managerService.removeScheduleById(id);
    }
}
