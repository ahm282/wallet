"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _goalsservice = require("./goals.service");
describe('GoalsService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _goalsservice.GoalsService
            ]
        }).compile();
        service = module.get(_goalsservice.GoalsService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});

//# sourceMappingURL=goals.service.spec.js.map