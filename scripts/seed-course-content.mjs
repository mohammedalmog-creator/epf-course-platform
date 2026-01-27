import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { sql } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Module metadata
const moduleMetadata = [
  { number: 1, titleAr: 'مقدمة في صناعة النفط والغاز ودور الـ EPF', titleEn: 'Introduction to Oil & Gas Industry and EPF Role', duration: '1 أسبوع' },
  { number: 2, titleAr: 'فصل السوائل الثلاثي (Three-Phase Separation)', titleEn: 'Three-Phase Separation', duration: '1 أسبوع' },
  { number: 3, titleAr: 'أنظمة معالجة النفط الخام', titleEn: 'Crude Oil Treatment Systems', duration: '1 أسبوع' },
  { number: 4, titleAr: 'معالجة الغاز الطبيعي والمياه المنتجة', titleEn: 'Natural Gas and Produced Water Treatment', duration: '1 أسبوع' },
  { number: 5, titleAr: 'أنظمة التدفئة والتبريد والضغط', titleEn: 'Heating, Cooling, and Compression Systems', duration: '1 أسبوع' },
  { number: 6, titleAr: 'التخزين، القياس، والسلامة', titleEn: 'Storage, Metering, and Safety', duration: '1 أسبوع' },
  { number: 7, titleAr: 'التصميم الأولي والحسابات الهندسية', titleEn: 'Initial Design and Engineering Calculations', duration: '2 أسابيع' },
  { number: 8, titleAr: 'مشروع التخرج', titleEn: 'Graduation Project', duration: '3 أسابيع' },
  { number: 9, titleAr: 'التشغيل والصيانة', titleEn: 'Operations and Maintenance', duration: '1 أسبوع' },
];

async function seedModules() {
  console.log('Seeding modules...');
  
  for (let i = 0; i < moduleMetadata.length; i++) {
    const mod = moduleMetadata[i];
    await connection.execute(
      `INSERT INTO modules (module_number, title_ar, title_en, duration, \`order\`)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title_ar = VALUES(title_ar),
         title_en = VALUES(title_en),
         duration = VALUES(duration),
         \`order\` = VALUES(\`order\`)`,
      [mod.number, mod.titleAr, mod.titleEn, mod.duration, i + 1]
    );
  }
  
  console.log('Modules seeded successfully!');
}

async function seedLessons() {
  console.log('Seeding lessons...');
  
  const contentDir = join(__dirname, '../course_content');
  
  for (let unitNum = 1; unitNum <= 9; unitNum++) {
    const unitDir = join(contentDir, `unit_${unitNum}`);
    
    try {
      const files = readdirSync(unitDir);
      const lessonFiles = files.filter(f => f.startsWith('lesson_') && f.endsWith('.md')).sort();
      
      for (let i = 0; i < lessonFiles.length; i++) {
        const lessonFile = lessonFiles[i];
        const lessonPath = join(unitDir, lessonFile);
        const content = readFileSync(lessonPath, 'utf-8');
        
        // Extract title from markdown (first # heading)
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const titleAr = titleMatch ? titleMatch[1].trim() : `الدرس ${i + 1}`;
        
        // Extract estimated time
        const timeMatch = content.match(/\*\*الزمن التقديري:\*\*\s*(\d+)/);
        const estimatedMinutes = timeMatch ? parseInt(timeMatch[1]) : 45;
        
        await connection.execute(
          `INSERT INTO lessons (module_id, lesson_number, title_ar, content_markdown, estimated_minutes, \`order\`)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [unitNum, i + 1, titleAr, content, estimatedMinutes, i + 1]
        );
      }
      
      console.log(`Unit ${unitNum}: ${lessonFiles.length} lessons seeded`);
    } catch (error) {
      console.log(`Unit ${unitNum}: No lessons found or error:`, error.message);
    }
  }
  
  console.log('Lessons seeded successfully!');
}

async function seedQuizzes() {
  console.log('Seeding quizzes...');
  
  const contentDir = join(__dirname, '../course_content');
  
  for (let unitNum = 1; unitNum <= 9; unitNum++) {
    const quizPath = join(contentDir, `unit_${unitNum}`, 'quiz.md');
    
    try {
      const content = readFileSync(quizPath, 'utf-8');
      
      // Parse quiz questions (simple regex-based parsing)
      const questionBlocks = content.split(/\*\*السؤال \d+:\*\*/);
      
      for (let i = 1; i < questionBlocks.length; i++) {
        const block = questionBlocks[i];
        
        // Extract question text
        const questionMatch = block.match(/^(.+?)(?=\n\nأ\))/s);
        const questionText = questionMatch ? questionMatch[1].trim() : '';
        
        // Extract options
        const optionMatches = [...block.matchAll(/([أ-د])\)\s*(.+?)(?=\n|$)/g)];
        const options = optionMatches.map((m, idx) => ({
          id: String.fromCharCode(97 + idx), // a, b, c, d
          textAr: m[2].trim(),
        }));
        
        // Extract correct answer
        const answerMatch = block.match(/\*\*الإجابة الصحيحة هي \(([أ-د])\)\.\*\*/);
        const correctLetter = answerMatch ? answerMatch[1] : 'أ';
        const correctIndex = ['أ', 'ب', 'ج', 'د'].indexOf(correctLetter);
        const correctOptionId = String.fromCharCode(97 + correctIndex);
        
        // Extract explanation
        const explanationMatch = block.match(/\*\*الشرح:\*\*\s*(.+?)(?=\n\n|\*\*السؤال|$)/s);
        const explanation = explanationMatch ? explanationMatch[1].trim() : '';
        
        if (questionText && options.length > 0) {
          await connection.execute(
            `INSERT INTO quiz_questions (module_id, question_text_ar, options_json, correct_option_id, explanation_ar, \`order\`)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [unitNum, questionText, JSON.stringify(options), correctOptionId, explanation, i]
          );
        }
      }
      
      console.log(`Unit ${unitNum}: Quiz seeded`);
    } catch (error) {
      console.log(`Unit ${unitNum}: No quiz found or error:`, error.message);
    }
  }
  
  console.log('Quizzes seeded successfully!');
}

async function main() {
  try {
    await seedModules();
    await seedLessons();
    await seedQuizzes();
    console.log('\n✅ All course content seeded successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding content:', error);
    await connection.end();
    process.exit(1);
  }
}

main();
