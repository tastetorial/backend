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
exports.User = exports.UserState = exports.UserStatus = exports.UserRole = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Models_1 = require("./Models");
const Post_1 = require("./Post");
const Follow_1 = require("./Follow");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserState;
(function (UserState) {
    UserState["STEP_ONE"] = "STEP_ONE";
    UserState["STEP_TWO"] = "STEP_TWO";
    UserState["STEP_THREE"] = "STEP_THREE";
    UserState["VERIFIED"] = "VERIFIED";
})(UserState || (exports.UserState = UserState = {}));
let User = class User extends sequelize_typescript_1.Model {
};
exports.User = User;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.CHAR(9)),
    __metadata("design:type", String)
], User.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20)),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(UserStatus.ACTIVE),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(UserStatus))),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(UserState.STEP_TWO),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(UserState))),
    __metadata("design:type", String)
], User.prototype, "state", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", Object)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(UserRole.USER),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(UserRole.ADMIN, UserRole.USER)),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], User.prototype, "deviceToken", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Post_1.Post, 'userId'),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Models_1.Profile, 'userId'),
    __metadata("design:type", Models_1.Profile)
], User.prototype, "profile", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => User, () => Follow_1.Follow, 'followingId', 'followerId'),
    __metadata("design:type", Array)
], User.prototype, "followers", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => User, () => Follow_1.Follow, 'followerId', 'followingId'),
    __metadata("design:type", Array)
], User.prototype, "followings", void 0);
exports.User = User = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'users' })
], User);
