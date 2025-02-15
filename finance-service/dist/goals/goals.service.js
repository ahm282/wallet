"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoalsService", {
    enumerable: true,
    get: function() {
        return GoalsService;
    }
});
const _common = require("@nestjs/common");
const _goalschema = require("./schemas/goal.schema");
const _mongoose = require("mongoose");
const _mongoose1 = require("@nestjs/mongoose");
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
let GoalsService = class GoalsService {
    async create(createGoalDto) {
        const session = await this.connection.startSession();
        session.startTransaction();
        const createdGoal = new this.goalModel(createGoalDto);
        const now = Math.floor(Date.now() / 1000);
        createdGoal.createdAt = now;
        createdGoal.updatedAt = now;
        await createdGoal.save();
        await session.commitTransaction();
        session.endSession();
        return createdGoal;
    }
    async findAll() {
        console.log('Request received to find all goals!');
        let all_goals = await this.goalModel.find().exec();
        await console.log(all_goals);
        return all_goals;
    }
    findOne(id) {
        return this.goalModel.findById(id);
    }
    update(id, updateGoalDto) {
        return this.goalModel.findByIdAndUpdate(id, updateGoalDto);
    }
    remove(id) {
        return this.goalModel.findByIdAndDelete(id);
    }
    constructor(connection, goalModel){
        this.connection = connection;
        this.goalModel = goalModel;
    }
};
GoalsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose1.InjectConnection)()),
    _ts_param(1, (0, _mongoose1.InjectModel)(_goalschema.Goal.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose.Connection === "undefined" ? Object : _mongoose.Connection,
        typeof _mongoose.Model === "undefined" ? Object : _mongoose.Model
    ])
], GoalsService);

//# sourceMappingURL=goals.service.js.map