import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [questions] = await connection.query(
  'SELECT * FROM quiz_questions WHERE question_text_ar LIKE ? LIMIT 1',
  ['%كيف يمكن أن تعمل الـ EPF والـ CPF معاً%']
);

if (questions.length > 0) {
  const q = questions[0];
  console.log('Question found:');
  console.log('ID:', q.id);
  console.log('Module:', q.module_id);
  console.log('Question:', q.question_text_ar);
  console.log('\nOptions:', JSON.stringify(JSON.parse(q.options_json), null, 2));
  console.log('\nCorrect Option ID:', q.correct_option_id);
  console.log('\nExplanation:', q.explanation_ar);
} else {
  console.log('Question not found');
}

await connection.end();
