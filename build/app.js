"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const appInsights = __importStar(require("applicationinsights"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: true }));
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
    appInsights === null || appInsights === void 0 ? void 0 : appInsights.setup(configSetup_1.default.APPINSIGHTS_INSTRUMENTATIONKEY).setAutoDependencyCorrelation(true).setAutoCollectRequests(true).setAutoCollectPerformance(true, true).setAutoCollectExceptions(true).setAutoCollectDependencies(true).setAutoCollectConsole(true, true).setUseDiskRetryCaching(true).start();
    appInsights === null || appInsights === void 0 ? void 0 : appInsights.defaultClient.trackEvent({ name: "App Started Successfully" });
})
    .catch(err => console.error('Error connecting to the database', err));
