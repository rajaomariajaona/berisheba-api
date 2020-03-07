import { ConnectionOptions } from 'typeorm';

var connectionOption: ConnectionOptions = {
   type: "postgres",
   host: process.env.DB_HOST || "localhost",
   port: Number(process.env.DB_PORT) || 5432,
   username: process.env.DB_USER || "postgres",
   password: process.env.DB_PASSWORD || "toor11",
   database: process.env.DB_DATABASE || "berisheba",
   schema: "public",
   synchronize: true,
   entities: [
    "src/entities/**/*.ts"
   ],
}

var connectionOptionHeroku: ConnectionOptions = {
   type: "postgres",
   url: process.env.DATABASE_URL,
   synchronize: true,
   schema: "public",
   entities: [
    "src/entities/**/*.ts"
   ],
}


export const ormconfig = process.env.DATABASE_URL? connectionOptionHeroku : connectionOption;