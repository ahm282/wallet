"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Goal: function() {
        return Goal;
    },
    GoalSchema: function() {
        return GoalSchema;
    }
});
const _mongoose = require("@nestjs/mongoose");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Goal = class Goal {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], Goal.prototype, "title", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Goal.prototype, "description", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", Number)
], Goal.prototype, "totalAmount", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", Number)
], Goal.prototype, "currentAmount", void 0);
_ts_decorate([
    (0, _mongoose.Virtual)({
        get: function() {
            return this.totalAmount === this.currentAmount ? 1 : 0;
        }
    }),
    _ts_metadata("design:type", Number)
], Goal.prototype, "status", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: Number,
        required: true,
        set: toUnixTimestamp,
        get: (value)=>value
    }),
    _ts_metadata("design:type", Number)
], Goal.prototype, "dueDate", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], Goal.prototype, "userId", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: Number,
        required: true,
        set: toUnixTimestamp,
        get: (value)=>value
    }),
    _ts_metadata("design:type", Number)
], Goal.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: Number,
        required: true,
        set: toUnixTimestamp,
        get: (value)=>value
    }),
    _ts_metadata("design:type", Number)
], Goal.prototype, "updatedAt", void 0);
Goal = _ts_decorate([
    (0, _mongoose.Schema)({
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    })
], Goal);
function toUnixTimestamp(value) {
    if (typeof value === 'number') return value;
    if (value instanceof Date) return Math.floor(value.getTime() / 1000);
    return Math.floor(new Date(value).getTime() / 1000);
}
const GoalSchema = _mongoose.SchemaFactory.createForClass(Goal);

//# sourceMappingURL=goal.schema.js.map