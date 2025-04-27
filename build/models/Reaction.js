"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reaction = exports.ReactionType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const Post_1 = require("./Post");
var ReactionType;
(function (ReactionType) {
    ReactionType["LIKE"] = "like";
    ReactionType["RATING"] = "rating";
})(ReactionType || (exports.ReactionType = ReactionType = {}));
let Reaction = class Reaction extends sequelize_typescript_1.Model {
};
exports.Reaction = Reaction;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], Reaction.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(ReactionType))),
    __metadata("design:type", String)
], Reaction.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Min)(1),
    (0, sequelize_typescript_1.Max)(5),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TINYINT),
    __metadata("design:type", Number)
], Reaction.prototype, "value", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Post_1.Post),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], Reaction.prototype, "postId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], Reaction.prototype, "userId", void 0);
exports.Reaction = Reaction = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'reactions' })
], Reaction);
