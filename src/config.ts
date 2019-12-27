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
      "build/entities/*.js"
   ],
}


export const ormconfig = connectionOption;