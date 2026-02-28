import { createConnection } from 'mysql2/promise';

const conn = await createConnection(process.env.DATABASE_URL);

// Check actual column names
const [cols] = await conn.execute('DESCRIBE lessons');
const colNames = cols.map(c => c.Field);
console.log('Columns:', colNames.join(', '));

// Check modules table columns
const [modCols] = await conn.execute('DESCRIBE modules');
const modColNames = modCols.map(c => c.Field);
console.log('Module Columns:', modColNames.join(', '));

// Get all wellhead lessons
const [allLessons] = await conn.execute(`
  SELECT l.id, l.title_ar, l.image_url, LENGTH(l.content_markdown) as content_len,
         m.title_ar as module_title
  FROM lessons l 
  JOIN modules m ON l.module_id = m.id
  WHERE m.course_id = 20001
  ORDER BY l.id
`);

console.log('\nTotal wellhead lessons:', allLessons.length);
allLessons.forEach(l => {
  const hasImg = l.image_url ? 'IMG' : 'NO_IMG';
  console.log(`ID:${l.id} | ${l.title_ar} | ${hasImg} | len:${l.content_len}`);
});

await conn.end();
