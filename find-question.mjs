import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [questions] = await connection.execute(
  "SELECT id, module_id, question_text_ar, options_json, correct_option_id FROM quiz_questions WHERE question_text_ar LIKE '%EPF%CPF%معاً%'"
);

console.log('\n=== Found Question ===\n');
questions.forEach((q) => {
  console.log(`Module: ${q.module_id}`);
  console.log(`Question: ${q.question_text_ar}`);
  console.log(`Correct Option ID: "${q.correct_option_id}"`);
  
  const options = q.options_json;
  console.log(`\nOptions:`);
  options.forEach(opt => {
    const marker = opt.id === q.correct_option_id ? '✓ CORRECT' : '';
    console.log(`  ${opt.id}) ${opt.textAr} ${marker}`);
  });
});

await connection.end();
