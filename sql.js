import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export let pool = new pg.Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});