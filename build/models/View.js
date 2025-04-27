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
exports.View = exports.PostOptions = exports.ViewType = exports.PostType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Post_1 = require("./Post");
var PostType;
(function (PostType) {
    PostType["POSE"] = "pose";
    PostType["STYLE"] = "style";
})(PostType || (exports.PostType = PostType = {}));
var ViewType;
(function (ViewType) {
    ViewType["FRONT"] = "front";
    ViewType["OPEN"] = "open";
})(ViewType || (exports.ViewType = ViewType = {}));
var PostOptions;
(function (PostOptions) {
    PostOptions["STANDING"] = "standing";
    PostOptions["SITTING"] = "sitting";
    PostOptions["LYING_DOWN"] = "lying_down";
    PostOptions["WALKING"] = "walking";
    PostOptions["RUNNING"] = "running";
    PostOptions["JUMPING"] = "jumping";
    PostOptions["LEANING"] = "leaning";
})(PostOptions || (exports.PostOptions = PostOptions = {}));
let View = class View extends sequelize_typescript_1.Model {
};
exports.View = View;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], View.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", String)
], View.prototype, "images", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(PostType))),
    __metadata("design:type", String)
], View.prototype, "postType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(ViewType))),
    __metadata("design:type", String)
], View.prototype, "viewType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", String)
], View.prototype, "options", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.ForeignKey)(() => Post_1.Post),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], View.prototype, "postId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Post_1.Post, 'postId'),
    __metadata("design:type", Post_1.Post)
], View.prototype, "post", void 0);
exports.View = View = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: false, tableName: 'views' })
], View);
