import pg from "pg";

const { Pool } = pg;

const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

if (process.env.NODE_ENV === "dev") {
  delete databaseConfig.ssl;
}

const connection = new Pool(databaseConfig);

export default connection;
