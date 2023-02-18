"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config/config"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const docs_json_1 = __importDefault(require("./docs.json"));
dotenv_1.default.config();
const port = process.env.PORT || 9000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
config_1.default
    .initialize()
    .then(() => console.log('Connected'))
    .catch((err) => console.log(err));
app.use(index_routes_1.default);
app.use('/api', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(docs_json_1.default));
app.listen(9000, () => {
    console.log(`http://localhost:${9000}`);
});
