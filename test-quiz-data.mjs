import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(
  'SELECT id, question_text_ar, options_json, correct_option_id FROM quiz_questions WHERE module_id = 1 LIMIT 2'
);

console.log('Quiz Questions Data:');
rows.forEach((row, idx) => {
  console.log(`\n--- Question ${idx + 1} ---`);
  console.log('ID:', row.id);
  console.log('Question:', row.question_text_ar.substring(0, 50) + '...');
  console.log('Options:', row.options_json);
  console.log('Correct Option ID:', row.correct_option_id);
  console.log('Type of correct_option_id:', typeof row.correct_option_id);
  
  const options = JSON.parse(row.options_json);
  console.log('Parsed options:');
  options.forEach(opt => {
    console.log(`  - ${opt.id} (type: ${typeof opt.id}): ${opt.textAr.substring(0, 30)}...`);
  });
});

await connection.end();
