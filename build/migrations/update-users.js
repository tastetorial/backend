"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
const faker_1 = require("@faker-js/faker");
const User_1 = require("../models/User");
function up(queryInterface) {
    return __awaiter(this, void 0, void 0, function* () {
        // fetch all existing users
        const users = yield queryInterface.sequelize.query('SELECT id FROM users', { type: sequelize_1.QueryTypes.SELECT });
        for (const user of users) {
            const avatarUrl = faker_1.faker.image.avatar();
            yield queryInterface.update(new User_1.User, 'users', { avatar: avatarUrl, updatedAt: new Date() }, { where: { id: user.id } });
        }
    });
}
function down(queryInterface) {
    return __awaiter(this, void 0, void 0, function* () {
        // optional: clear avatar column for rollback
        yield queryInterface.bulkUpdate('users', { avatar: null }, {});
    });
}
