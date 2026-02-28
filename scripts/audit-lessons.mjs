import { createConnection } from 'mysql2/promise';

const conn = await createConnection(process.env.DATABASE_URL);

// Get full content of lesson 60015
const [rows60015] = await conn.execute('SELECT * FROM lessons WHERE id = 60015 LIMIT 1');
console.log('=== LESSON 60015 FULL CONTENT ===');
console.log(rows60015[0].content_markdown);

// Get all wellhead lessons with content length
const [allLessons] = await conn.execute(`
  SELECT l.id, l.title_ar, l.image_url, l.content_markdown,
         m.title_ar as module_title, m.order_index as mod_order, l.order_index as les_order
  FROM lessons l 
  JOIN modules m ON l.module_id = m.id
  WHERE m.course_id = 20001
  ORDER BY m.order_index, l.order_index
`);

console.log('\n=== ALL WELLHEAD LESSONS ===');
allLessons.forEach(l => {
  const hasImg = l.image_url ? 'IMG' : 'NO_IMG';
  const contentLen = l.content_markdown?.length || 0;
  // Check if content has lists/steps that could benefit from images
  const hasLists = (l.content_markdown?.match(/^\d+\./mg) || []).length;
  const hasTables = (l.content_markdown?.match(/^\|/mg) || []).length;
  console.log(`[${l.id}] M${l.mod_order}L${l.les_order} | ${l.title_ar} | ${hasImg} | len:${contentLen} | lists:${hasLists} | tables:${hasTables}`);
});

await conn.end();
