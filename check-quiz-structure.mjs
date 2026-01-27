import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get table structure
const [columns] = await connection.query('SHOW COLUMNS FROM quiz_questions');
console.log('Table structure:');
columns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));

// Get the question
const [questions] = await connection.query('SELECT * FROM quiz_questions WHERE id = 6 LIMIT 1');
if (questions.length > 0) {
  console.log('\nQuestion 6:');
  console.log(JSON.stringify(questions[0], null, 2));
}

await connection.end();
