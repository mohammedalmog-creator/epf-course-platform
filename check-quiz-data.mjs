import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [questions] = await connection.execute(
  'SELECT id, module_id, question_text_ar, options_json, correct_option_id FROM quiz_questions WHERE module_id = 1 LIMIT 3'
);

console.log('\n=== Quiz Questions Analysis ===\n');
questions.forEach((q, idx) => {
  console.log(`Question ${idx + 1}:`);
  console.log(`  ID: ${q.id}`);
  console.log(`  Text: ${q.question_text_ar}`);
  console.log(`  Correct Option ID: "${q.correct_option_id}" (type: ${typeof q.correct_option_id})`);
  console.log(`  Raw options_json type: ${typeof q.options_json}`);
  
  let options;
  if (typeof q.options_json === 'string') {
    options = JSON.parse(q.options_json);
  } else {
    options = q.options_json;
  }
  
  console.log(`  Options:`);
  options.forEach(opt => {
    const isCorrect = opt.id === q.correct_option_id;
    console.log(`    ${isCorrect ? '✓' : ' '} ${opt.id} (type: ${typeof opt.id}): ${opt.textAr}`);
  });
  console.log('');
});

await connection.end();
