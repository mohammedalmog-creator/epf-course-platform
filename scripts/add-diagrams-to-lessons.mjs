import mysql from 'mysql2/promise';
import fs from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const mapping = JSON.parse(fs.readFileSync('/home/ubuntu/epf-course-platform/diagram_mapping.json', 'utf8'));

for (const [key, url] of Object.entries(mapping)) {
  const [unitStr, lessonStr] = key.split('_');
  const moduleId = parseInt(unitStr.replace('unit', ''));
  const lessonOrder = parseInt(lessonStr.replace('lesson', ''));
  
  // Get current content
  const [rows] = await connection.query(
    'SELECT content_markdown FROM lessons WHERE module_id = ? AND `order` = ?',
    [moduleId, lessonOrder]
  );
  
  if (rows.length > 0) {
    let content = rows[0].content_markdown;
    
    // Add diagram at the beginning after the title
    const lines = content.split('\n');
    const titleIndex = lines.findIndex(line => line.startsWith('#'));
    
    if (titleIndex !== -1) {
      // Insert diagram after title and a blank line
      const diagramMarkdown = `\n![رسم توضيحي](${url})\n`;
      lines.splice(titleIndex + 1, 0, diagramMarkdown);
      content = lines.join('\n');
      
      // Update database
      await connection.query(
        'UPDATE lessons SET content_markdown = ? WHERE module_id = ? AND `order` = ?',
        [content, moduleId, lessonOrder]
      );
      
      console.log(`✅ Added diagram to Unit ${moduleId}, Lesson ${lessonOrder}`);
    }
  }
}

await connection.end();
console.log('\n✅ All diagrams added successfully!');
