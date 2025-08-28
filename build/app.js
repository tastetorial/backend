"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const configSetup_1 = __importDefault(require("./config/configSetup"));
const authorize_1 = require("./middleware/authorize");
const routes_1 = __importDefault(require("./routes/routes"));
const logRoutes_1 = require("./middleware/logRoutes");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
//serve static files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
app.use(logRoutes_1.logRoutes);
app.get('/', (req, res) => {
    res.send('Hello world! The API is working.');
});
app.all('*', authorize_1.isAuthorized);
app.use('/api', routes_1.default);
db_1.default.sync({}).then(() => {
    app.listen(configSetup_1.default.PORT, () => console.log(`Server is running on http://localhost:${configSetup_1.default.PORT}`));
})
    .catch(err => console.error('Error connecting to the database', err));
