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
exports.Profile = exports.AccountCategory = exports.AccountPrivacy = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Models_1 = require("./Models");
var AccountPrivacy;
(function (AccountPrivacy) {
    AccountPrivacy["PUBLIC"] = "public";
    AccountPrivacy["PRIVATE"] = "private";
    AccountPrivacy["FRIENDS"] = "friends";
})(AccountPrivacy || (exports.AccountPrivacy = AccountPrivacy = {}));
var AccountCategory;
(function (AccountCategory) {
    AccountCategory["PROFESSIONAL"] = "professional";
    AccountCategory["ASPIRING"] = "aspiring";
    AccountCategory["FASHION"] = "fashion";
    AccountCategory["FITNESS"] = "fitness";
    AccountCategory["LIFESTYLE"] = "lifestyle";
    AccountCategory["COMMERCIAL"] = "commercial";
    AccountCategory["INFLUENCER"] = "influencer";
    AccountCategory["NEWCOMER"] = "newcomer";
    AccountCategory["PHOTOGRAPHER"] = "photographer";
    AccountCategory["CLIENT"] = "client";
    AccountCategory["TALENT_AGENCY"] = "talent_agency";
})(AccountCategory || (exports.AccountCategory = AccountCategory = {}));
let Profile = class Profile extends sequelize_typescript_1.Model {
};
exports.Profile = Profile;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], Profile.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], Profile.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], Profile.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Profile.prototype, "avatar", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Profile.prototype, "otherNames", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Profile.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Profile.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATEONLY),
    __metadata("design:type", Date)
], Profile.prototype, "dateOfBirth", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(AccountPrivacy.PUBLIC),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AccountPrivacy))),
    __metadata("design:type", String)
], Profile.prototype, "privacy", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Default)(AccountCategory.NEWCOMER),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AccountCategory))),
    __metadata("design:type", String)
], Profile.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.ForeignKey)(() => Models_1.User),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], Profile.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Models_1.User),
    __metadata("design:type", Models_1.User)
], Profile.prototype, "user", void 0);
exports.Profile = Profile = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'profiles' })
], Profile);
