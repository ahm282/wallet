"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _goalscontroller = require("./goals.controller");
const _goalsservice = require("./goals.service");
describe('GoalsController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _goalscontroller.GoalsController
            ],
            providers: [
                _goalsservice.GoalsService
            ]
        }).compile();
        controller = module.get(_goalscontroller.GoalsController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=goals.controller.spec.js.map