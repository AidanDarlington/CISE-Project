"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_1 = __importDefault(require("express"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const expressApp = (0, express_1.default)();
    expressApp.use(express_1.default.json());
    expressApp.get('/', (req, res) => {
        res.send('GET request to the homepage');
    });
    expressApp.post('/', (req, res) => {
        res.send('POST request to the homepage');
    });
    expressApp.put('/', (req, res) => {
        res.send('PUT request to the homepage');
    });
    expressApp.patch('/', (req, res) => {
        res.send('PATCH request to the homepage');
    });
    expressApp.delete('/', (req, res) => {
        res.send('DELETE request to the homepage');
    });
    expressApp.options('/', (req, res) => {
        res.send('OPTIONS request to the homepage');
    });
    app.use(expressApp);
    const port = process.env.PORT || 8082;
    await app.listen(port, () => console.log(`Server running on port ${port}`));
}
bootstrap();
//# sourceMappingURL=main.js.map