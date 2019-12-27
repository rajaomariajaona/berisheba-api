"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connectionOption = {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "toor11",
    database: process.env.DB_DATABASE || "berisheba",
    schema: "public",
    synchronize: true,
    entities: [
        "build/entities/*.js"
    ],
};
var connectionOptionHeroku = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    entities: [
        "build/entities/*.js"
    ],
};
exports.ormconfig = process.env.DATABASE_URL ? connectionOptionHeroku : connectionOption;
//# sourceMappingURL=config.js.map