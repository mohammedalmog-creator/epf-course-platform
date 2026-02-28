import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

await conn.execute(
  'UPDATE lessons SET image_url = ? WHERE id = ?',
  ['https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/wellhead-standards-specs-TJcXKDtJ8sh8gnHtatqJUi.webp', 60003]
);

const [r] = await conn.execute('SELECT id, title_ar, image_url FROM lessons WHERE id = 60003');
console.log('Updated lesson 60003:', r[0].title_ar);
console.log('Image URL set:', r[0].image_url ? 'YES' : 'NO');

// Also verify all lessons now have images
const [missing] = await conn.execute(
  'SELECT id, title_ar, module_id FROM lessons WHERE course_id = 2 AND (image_url IS NULL OR image_url = "")'
);
console.log('\nLessons still missing images:', missing.length);
missing.forEach(l => console.log('  [' + l.id + '] Module ' + l.module_id + ': ' + l.title_ar));

await conn.end();
