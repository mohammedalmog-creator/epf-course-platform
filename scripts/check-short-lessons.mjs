import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get all wellhead course modules
const [modules] = await conn.execute('SELECT id FROM modules WHERE course_id = 2');
const moduleIds = modules.map(m => m.id);

// Find lessons with short content
const [short] = await conn.execute(
  'SELECT id, module_id, lesson_number, title_ar, LENGTH(content_markdown) as len FROM lessons WHERE module_id IN (' + moduleIds.join(',') + ') ORDER BY len ASC LIMIT 15'
);

console.log('Shortest lessons in Wellhead course:');
short.forEach(l => console.log('  [' + l.id + '] M' + l.module_id + ' L' + l.lesson_number + ' (' + l.len + ' chars): ' + l.title_ar));

// Also check for lessons with very similar titles in same module
const [all] = await conn.execute(
  'SELECT id, module_id, lesson_number, title_ar FROM lessons WHERE module_id IN (' + moduleIds.join(',') + ') ORDER BY module_id, lesson_number'
);

await conn.end();
