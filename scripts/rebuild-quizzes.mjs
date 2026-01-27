import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Quiz files mapping
const quizFiles = [
  { moduleId: 1, file: '/home/ubuntu/epf_course_content/unit_1/quiz.md' },
  { moduleId: 2, file: '/home/ubuntu/epf_course_content/unit_2/quiz.md' },
  { moduleId: 3, file: '/home/ubuntu/epf_course_content/unit_3/quiz.md' },
  { moduleId: 4, file: '/home/ubuntu/epf_course_content/unit_4/quiz.md' },
  { moduleId: 5, file: '/home/ubuntu/epf_course_content/unit_5/quiz.md' },
  { moduleId: 6, file: '/home/ubuntu/epf_course_content/unit_6/quiz.md' },
  { moduleId: 7, file: '/home/ubuntu/epf_course_content/unit_7/quiz.md' },
  { moduleId: 9, file: '/home/ubuntu/epf_course_content/unit_9/quiz.md' },
];

// Correct answers for each module (from the markdown files)
const correctAnswersMap = {
  1: ['c', 'b', 'b', 'c', 'b', 'b'],
  2: ['b', 'c', 'a', 'b', 'c'],
  3: ['a', 'b', 'c'],
  4: ['b', 'a', 'c', 'b'],
  5: ['a', 'b', 'c', 'a'],
  6: ['b', 'c', 'a', 'b', 'c', 'a'],
  7: ['b', 'a', 'c', 'b', 'a'],
  9: ['b', 'a', 'c', 'b'],
};

function parseQuizFile(content, moduleId) {
  const questions = [];
  const lines = content.split('\n');
  
  let currentQuestion = null;
  let questionNumber = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Match question pattern: **السؤال X:**
    if (line.match(/^\*\*السؤال \d+:\*\*/)) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      
      questionNumber++;
      const questionText = line.replace(/^\*\*السؤال \d+:\*\*\s*/, '');
      currentQuestion = {
        questionText,
        options: [],
        correctOptionId: correctAnswersMap[moduleId][questionNumber - 1] || 'a'
      };
    }
    // Match options: أ), ب), ج), د)
    else if (currentQuestion && line.match(/^[أ-د]\)/)) {
      const optionLetter = line.charAt(0);
      const optionText = line.substring(2).trim();
      
      // Map Arabic letters to English
      const letterMap = { 'أ': 'a', 'ب': 'b', 'ج': 'c', 'د': 'd' };
      const optionId = letterMap[optionLetter];
      
      if (optionId && optionText) {
        currentQuestion.options.push({
          id: optionId,
          textAr: optionText
        });
      }
    }
  }
  
  if (currentQuestion && currentQuestion.options.length > 0) {
    questions.push(currentQuestion);
  }
  
  return questions;
}

let totalInserted = 0;

for (const { moduleId, file } of quizFiles) {
  if (!fs.existsSync(file)) {
    console.log(`⚠️  File not found: ${file}`);
    continue;
  }
  
  const content = fs.readFileSync(file, 'utf-8');
  const questions = parseQuizFile(content, moduleId);
  
  console.log(`\nModule ${moduleId}: Found ${questions.length} questions`);
  
  for (let idx = 0; idx < questions.length; idx++) {
    const q = questions[idx];
    if (q.options.length !== 4) {
      console.log(`  ⚠️  Skipping question with ${q.options.length} options: ${q.questionText.substring(0, 50)}...`);
      continue;
    }
    
    await connection.execute(
      'INSERT INTO quiz_questions (module_id, question_text_ar, options_json, correct_option_id, `order`) VALUES (?, ?, ?, ?, ?)',
      [moduleId, q.questionText, JSON.stringify(q.options), q.correctOptionId, idx + 1]
    );
    
    totalInserted++;
    console.log(`  ✅ Inserted: ${q.questionText.substring(0, 60)}... (correct: ${q.correctOptionId})`);
  }
}

console.log(`\n✅ Total questions inserted: ${totalInserted}`);
await connection.end();
