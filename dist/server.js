"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@shared/http/app");
const server_1 = require("@config/server");
const port = server_1.serverConfig.port;
app_1.app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`API prefix: ${server_1.serverConfig.apiPrefix}`);
});
