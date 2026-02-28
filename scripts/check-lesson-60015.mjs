import { createConnection } from 'mysql2/promise';

const conn = await createConnection(process.env.DATABASE_URL);

// Get lesson 60015 details
const [lessons60015] = await conn.execute('SELECT id, title_ar, content_ar, image_url FROM lessons WHERE id = 60015');
const lesson = lessons60015[0];
console.log('=== LESSON 60015 ===');
console.log('Title:', lesson.title_ar);
console.log('Image:', lesson.image_url ? 'HAS IMAGE: ' + lesson.image_url.substring(0, 60) : 'NO IMAGE');
console.log('Content length:', lesson.content_ar?.length);
console.log('Content:\n', lesson.content_ar?.substring(0, 800));

// Get all wellhead lessons
const [allLessons] = await conn.execute(`
  SELECT l.id, l.title_ar, l.image_url, m.title_ar as module_title, m.order_index as mod_order, l.order_index as les_order
  FROM lessons l 
  JOIN modules m ON l.module_id = m.id
  WHERE m.course_id = 20001
  ORDER BY m.order_index, l.order_index
`);

console.log('\n=== ALL WELLHEAD LESSONS (60 total) ===');
allLessons.forEach(l => {
  const hasImg = l.image_url ? 'IMG' : 'NO_IMG';
  console.log(`[${l.id}] M${l.mod_order}L${l.les_order} | ${l.title_ar} | ${hasImg}`);
});

await conn.end();
