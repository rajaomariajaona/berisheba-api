var obj = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "toor11",
    database: "berisheba",
    schema: "public",
    synchronize: true,
    entities: [
        "build/entities/*.js"
    ],
    cli: {
        entitiesDir: "src/entities"
    }
};
//# sourceMappingURL=ormconfig.js.map