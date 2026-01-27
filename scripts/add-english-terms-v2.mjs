import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Key terminology that MUST have English equivalents
const criticalTerms = [
  { ar: 'الفاصل', en: 'Separator' },
  { ar: 'مجمع الأنابيب', en: 'Manifold' },
  { ar: 'السخان', en: 'Heater' },
  { ar: 'النفط', en: 'Oil' },
  { ar: 'الغاز', en: 'Gas' },
  { ar: 'المياه', en: 'Water' },
  { ar: 'الضغط', en: 'Pressure' },
  { ar: 'درجة الحرارة', en: 'Temperature' },
  { ar: 'التدفق', en: 'Flow' },
  { ar: 'الصمام', en: 'Valve' },
  { ar: 'المضخة', en: 'Pump' },
  { ar: 'الضاغط', en: 'Compressor' },
  { ar: 'الخزان', en: 'Tank' },
  { ar: 'الأنابيب', en: 'Piping' },
  { ar: 'مبادل حراري', en: 'Heat Exchanger' },
  { ar: 'الفصل', en: 'Separation' },
  { ar: 'المعالجة', en: 'Processing' },
  { ar: 'التثبيت', en: 'Stabilization' },
  { ar: 'التجفيف', en: 'Dehydration' },
  { ar: 'إزالة الأملاح', en: 'Desalting' },
  { ar: 'التحلية', en: 'Sweetening' },
  { ar: 'الأمين', en: 'Amine' },
  { ar: 'الجليكول', en: 'Glycol' },
  { ar: 'المياه المنتجة', en: 'Produced Water' },
  { ar: 'نقطة الندى', en: 'Dew Point' },
  { ar: 'ضغط البخار', en: 'Vapor Pressure' },
  { ar: 'الإيقاف الطارئ', en: 'Emergency Shutdown (ESD)' },
  { ar: 'كشف الحريق', en: 'Fire Detection' },
  { ar: 'كشف الغاز', en: 'Gas Detection' },
  { ar: 'صمام الأمان', en: 'Safety Valve' },
  { ar: 'التشغيل', en: 'Operation' },
  { ar: 'الصيانة', en: 'Maintenance' },
  { ar: 'بدء التشغيل', en: 'Startup' },
  { ar: 'الإيقاف', en: 'Shutdown' }
];

// Get all lessons
const [lessons] = await connection.query('SELECT id, module_id, `order`, content_markdown FROM lessons ORDER BY module_id, `order`');

let updatedCount = 0;

for (const lesson of lessons) {
  let content = lesson.content_markdown;
  let modified = false;
  
  for (const term of criticalTerms) {
    // Check if the Arabic term exists but NOT already followed by English in parentheses
    const pattern = term.ar;
    const replacement = `${term.en} (${term.ar})`;
    
    // Split content into lines to process line by line
    const lines = content.split('\n');
    const newLines = [];
    
    for (let line of lines) {
      // Skip if line already contains the English term
      if (!line.includes(term.en) && line.includes(pattern)) {
        // Replace only the first occurrence in each line to avoid over-replacement
        line = line.replace(pattern, replacement);
        modified = true;
      }
      newLines.push(line);
    }
    
    content = newLines.join('\n');
  }
  
  if (modified) {
    await connection.query(
      'UPDATE lessons SET content_markdown = ? WHERE id = ?',
      [content, lesson.id]
    );
    updatedCount++;
    console.log(`✅ Updated Unit ${lesson.module_id}, Lesson ${lesson.order}`);
  }
}

await connection.end();
console.log(`\n✅ Updated ${updatedCount} lessons with English terminology!`);
