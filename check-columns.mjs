import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [columns] = await connection.execute('SHOW COLUMNS FROM lessons');
console.log('Columns in lessons table:');
columns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));
await connection.end();
