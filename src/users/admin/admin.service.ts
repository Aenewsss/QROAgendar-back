import { Injectable } from '@nestjs/common';
import { ManagerInput } from '../../database/inputs/manager.input';
import { UserValidator } from "../../database/validators/user.validor";
import { ScheduleValidator } from "../../database/validators/schedule.validator";
import firestoreService from "../../firebase/firestore.service";
import { CollectionEnum, KeyEnum } from "../../enum";

@Injectable()
export class AdminService {
    async getAllUsers(): Promise<UserValidator[]> {
        return await firestoreService.getAll(CollectionEnum.users)
    }

    async deleteUser(id: string): Promise<UserValidator> {
        return await firestoreService.deleteById(CollectionEnum.users, id);
    }

    async createManager(manager: ManagerInput): Promise<any> {
        return await firestoreService.create(CollectionEnum.users, manager);
    }

    async getScheduleByVetId(vetId: string): Promise<ScheduleValidator[]> {
        return await firestoreService.getWhere(CollectionEnum.schedule,
            { key: KeyEnum.employee_id, operator: '==', value: vetId },
            { key: KeyEnum.date, direction: 'desc' }
        );
    }

    async getSchedulesByVetIdAndByDateRange(vetId: string, startDate: Date, finalDate: Date): Promise<ScheduleValidator[]> {
        return await firestoreService.getSchedulesByVetIdAndByDateRange(CollectionEnum.schedule, vetId, startDate, finalDate)
    }
}
