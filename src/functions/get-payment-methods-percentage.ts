import { paymentMethodEnum } from "src/database/dto/payment_method.enum"
import { ScheduleValidator } from "src/database/validators/schedule.validator"

export function getPaymentMethodsPercentage(schedules: ScheduleValidator[]) {
    const paymentMethodsCount = schedules.reduce((acc, curr) => {
        if (curr.payment.method == paymentMethodEnum.debit) acc.debit++
        else if (curr.payment.method == paymentMethodEnum.credit) acc.credit++
        else if (curr.payment.method == paymentMethodEnum.pix) acc.pix++
        else acc.money++

        return acc
    }, { debit: 0, credit: 0, pix: 0, money: 0 })

    const totalSchedules = schedules.length;

    const paymentMethodsPercentage = {
        debit: (paymentMethodsCount.debit / totalSchedules) * 100,
        credit: (paymentMethodsCount.credit / totalSchedules) * 100,
        money: (paymentMethodsCount.money / totalSchedules) * 100,
        pix: (paymentMethodsCount.pix / totalSchedules) * 100,
    }

    return paymentMethodsPercentage
}