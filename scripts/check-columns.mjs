import { createConnection } from 'mysql2/promise';

const conn = await createConnection(process.env.DATABASE_URL);
const [cols] = await conn.execute('DESCRIBE lessons');
console.log('=== LESSONS TABLE COLUMNS ===');
cols.forEach(c => console.log(c.Field, '-', c.Type));

// Get lesson 60015
const [rows] = await conn.execute('SELECT * FROM lessons WHERE id = 60015 LIMIT 1');
if (rows[0]) {
  console.log('\n=== LESSON 60015 KEYS ===');
  Object.keys(rows[0]).forEach(k => {
    const val = rows[0][k];
    if (typeof val === 'string' && val.length > 100) {
      console.log(k + ':', val.substring(0, 150) + '...');
    } else {
      console.log(k + ':', val);
    }
  });
}

await conn.end();
