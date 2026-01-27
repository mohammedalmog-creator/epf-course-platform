import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Correct answers for each module based on the original quiz files
const correctAnswers = {
  1: ['c', 'b', 'b', 'c', 'b', 'b'], // Unit 1
  2: ['b', 'c', 'a', 'b', 'c'],      // Unit 2
  3: ['a', 'b', 'c'],                 // Unit 3
  4: ['b', 'a', 'c', 'b'],            // Unit 4
  5: ['a', 'b', 'c', 'a'],            // Unit 5
  6: ['b', 'c', 'a', 'b', 'c', 'a'],  // Unit 6
  7: ['b', 'a', 'c', 'b', 'a'],       // Unit 7
  9: ['b', 'a', 'c', 'b'],            // Unit 9 (Unit 8 is graduation project, no quiz)
};

let totalFixed = 0;

for (const [moduleId, answers] of Object.entries(correctAnswers)) {
  const [questions] = await connection.execute(
    'SELECT id FROM quiz_questions WHERE module_id = ? ORDER BY id',
    [moduleId]
  );
  
  for (let i = 0; i < questions.length && i < answers.length; i++) {
    const questionId = questions[i].id;
    const correctAnswer = answers[i];
    
    await connection.execute(
      'UPDATE quiz_questions SET correct_option_id = ? WHERE id = ?',
      [correctAnswer, questionId]
    );
    
    totalFixed++;
    console.log(`✅ Fixed Module ${moduleId}, Question ${i + 1}: correct answer is now "${correctAnswer}"`);
  }
}

console.log(`\n✅ Total questions fixed: ${totalFixed}`);
await connection.end();
