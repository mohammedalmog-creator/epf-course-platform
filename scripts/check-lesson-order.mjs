import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// First check modules table structure
const [cols] = await conn.execute('DESCRIBE modules');
console.log('Modules columns:', cols.map(c => c.Field).join(', '));

const [modules] = await conn.execute('SELECT id, title_ar FROM modules WHERE course_id = 2 ORDER BY id');

for (const mod of modules) {
  const [lessons] = await conn.execute(
    'SELECT id, lesson_number, title_ar, `order` FROM lessons WHERE module_id = ? ORDER BY lesson_number',
    [mod.id]
  );
  console.log('\nModule ' + mod.id + ': ' + mod.title_ar);
  lessons.forEach(l => console.log('  L' + l.lesson_number + ' [id:' + l.id + ', order:' + l.order + '] ' + l.title_ar));
}

await conn.end();
