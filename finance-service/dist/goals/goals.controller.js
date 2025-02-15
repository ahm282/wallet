"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoalsController", {
    enumerable: true,
    get: function() {
        return GoalsController;
    }
});
const _common = require("@nestjs/common");
const _goalsservice = require("./goals.service");
const _creategoaldto = require("./dto/create-goal.dto");
const _updategoaldto = require("./dto/update-goal.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let GoalsController = class GoalsController {
    create(createGoalDto) {
        return this.goalsService.create(createGoalDto);
    }
    findAll() {
        return this.goalsService.findAll();
    }
    findOne(id) {
        return this.goalsService.findOne(id);
    }
    update(id, updateGoalDto) {
        return this.goalsService.update(id, updateGoalDto);
    }
    async remove(id) {
        const result = await this.goalsService.remove(id);
        if (!result) {
            throw new _common.NotFoundException(`Goal with id ${id} not found`);
        }
        return {
            code: 200,
            msg: 'Goal deleted successfully'
        };
    }
    constructor(goalsService){
        this.goalsService = goalsService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _creategoaldto.CreateGoalDto === "undefined" ? Object : _creategoaldto.CreateGoalDto
    ]),
    _ts_metadata("design:returntype", void 0)
], GoalsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], GoalsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], GoalsController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updategoaldto.UpdateGoalDto === "undefined" ? Object : _updategoaldto.UpdateGoalDto
    ]),
    _ts_metadata("design:returntype", void 0)
], GoalsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], GoalsController.prototype, "remove", null);
GoalsController = _ts_decorate([
    (0, _common.Controller)('goals'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _goalsservice.GoalsService === "undefined" ? Object : _goalsservice.GoalsService
    ])
], GoalsController);

//# sourceMappingURL=goals.controller.js.map