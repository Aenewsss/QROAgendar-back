import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
    @Get('')
    async hello() {
        return 'QRO AGENDAR API'
    }
}
