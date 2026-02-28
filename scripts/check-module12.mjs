import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Check module 12 lessons for potential duplicates
const [lessons] = await conn.execute(
  'SELECT id, title_ar, title_en, LEFT(content_markdown, 300) as preview FROM lessons WHERE module_id = 30012 ORDER BY lesson_number'
);

for (const l of lessons) {
  console.log('\n=== Lesson ' + l.id + ': ' + l.title_ar + ' ===');
  console.log('EN: ' + l.title_en);
  console.log('Preview:', l.preview.substring(0, 200));
}

// Also check module 1 L4 and L5 for potential overlap with L1-L3
const [m1] = await conn.execute(
  'SELECT id, title_ar, LEFT(content_markdown, 300) as preview FROM lessons WHERE module_id = 30001 ORDER BY lesson_number'
);
console.log('\n\n=== MODULE 1 LESSONS ===');
for (const l of m1) {
  console.log('\n[' + l.id + '] ' + l.title_ar + ':');
  console.log(l.preview.substring(0, 150));
}

await conn.end();
