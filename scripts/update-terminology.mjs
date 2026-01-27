import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Common scientific terms to update (Arabic → English with Arabic explanation)
const termReplacements = [
  // EPF Components
  { ar: 'فاصل ثلاثي الأطوار', en: 'Three-Phase Separator (فاصل ثلاثي الأطوار)' },
  { ar: 'الفاصل', en: 'Separator (الفاصل)' },
  { ar: 'وحدة التسخين والمعالجة', en: 'Heater Treater (وحدة التسخين والمعالجة)' },
  { ar: 'برج الاستقرار', en: 'Stabilizer Column (برج الاستقرار)' },
  { ar: 'وحدة الجليكول', en: 'Glycol Unit (وحدة الجليكول)' },
  { ar: 'وحدة الأمين', en: 'Amine Unit (وحدة الأمين)' },
  { ar: 'الضاغط', en: 'Compressor (الضاغط)' },
  { ar: 'المبادل الحراري', en: 'Heat Exchanger (المبادل الحراري)' },
  { ar: 'خزان التخزين', en: 'Storage Tank (خزان التخزين)' },
  { ar: 'المشعل', en: 'Flare (المشعل)' },
  
  // Processes
  { ar: 'الفصل الثلاثي', en: 'Three-Phase Separation (الفصل الثلاثي)' },
  { ar: 'إزالة الماء', en: 'Dehydration (إزالة الماء)' },
  { ar: 'إزالة الأملاح', en: 'Desalting (إزالة الأملاح)' },
  { ar: 'الاستقرار', en: 'Stabilization (الاستقرار)' },
  { ar: 'التحلية', en: 'Sweetening (التحلية)' },
  { ar: 'الضغط', en: 'Compression (الضغط)' },
  { ar: 'التبريد', en: 'Cooling (التبريد)' },
  { ar: 'التسخين', en: 'Heating (التسخين)' },
  
  // Properties
  { ar: 'ضغط البخار', en: 'Vapor Pressure (ضغط البخار)' },
  { ar: 'نقطة الندى', en: 'Dew Point (نقطة الندى)' },
  { ar: 'زمن المكوث', en: 'Residence Time (زمن المكوث)' },
  { ar: 'معدل التدفق', en: 'Flow Rate (معدل التدفق)' },
  { ar: 'الكثافة', en: 'Density (الكثافة)' },
  { ar: 'اللزوجة', en: 'Viscosity (اللزوجة)' },
  
  // Safety
  { ar: 'نظام الإطفاء', en: 'Fire Suppression System (نظام الإطفاء)' },
  { ar: 'كاشف الغاز', en: 'Gas Detector (كاشف الغاز)' },
  { ar: 'كاشف اللهب', en: 'Flame Detector (كاشف اللهب)' },
  { ar: 'صمام الإغلاق الطارئ', en: 'Emergency Shutdown Valve (ESD) (صمام الإغلاق الطارئ)' },
  { ar: 'صمام الأمان', en: 'Safety Valve (صمام الأمان)' },
  
  // Chemicals
  { ar: 'الجليكول', en: 'Glycol (الجليكول)' },
  { ar: 'الأمين', en: 'Amine (الأمين)' },
  { ar: 'كبريتيد الهيدروجين', en: 'Hydrogen Sulfide (H₂S) (كبريتيد الهيدروجين)' },
  { ar: 'ثاني أكسيد الكربون', en: 'Carbon Dioxide (CO₂) (ثاني أكسيد الكربون)' },
  { ar: 'الميثان', en: 'Methane (الميثان)' },
  { ar: 'الإيثان', en: 'Ethane (الإيثان)' },
  { ar: 'البروبان', en: 'Propane (البروبان)' },
  { ar: 'البوتان', en: 'Butane (البوتان)' },
];

// Get all lessons
const [lessons] = await connection.execute('SELECT id, content_markdown, title_ar FROM lessons');

let updatedCount = 0;

for (const lesson of lessons) {
  let content = lesson.content_markdown || '';
  let hasChanges = false;
  
  // Apply term replacements
  for (const term of termReplacements) {
    // Only replace standalone terms (not part of other words)
    const regex = new RegExp(`\\b${term.ar}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, term.en);
      hasChanges = true;
    }
  }
  
  if (hasChanges) {
    await connection.execute(
      'UPDATE lessons SET content_markdown = ? WHERE id = ?',
      [content, lesson.id]
    );
    updatedCount++;
    console.log(`✅ Updated lesson ${lesson.id}: ${lesson.title_ar}`);
  }
}

console.log(`\n✅ Updated ${updatedCount} lessons with English terminology!`);
await connection.end();
