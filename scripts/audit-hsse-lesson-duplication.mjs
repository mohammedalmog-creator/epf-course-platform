import "dotenv/config";
import mysql from "mysql2/promise";
import { writeFile } from "node:fs/promises";

const COURSE_ID = 3;

function normalize(value) {
  return String(value ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/^# .*$/gm, " ")
    .replace(/## الهدف التعليمي[\s\S]*?(?=\n## )/g, " ")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLowerCase();
}

function tokens(value) {
  return new Set(normalize(value).split(/\s+/).filter((token) => token.length > 2));
}

function jaccard(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  const union = a.size + b.size - intersection;
  return union === 0 ? 1 : intersection / union;
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const [rows] = await connection.execute(
    `SELECT l.id, l.module_id AS moduleId, m.module_number AS moduleNumber,
            l.lesson_number AS lessonNumber, l.title_ar AS titleAr,
            l.content_markdown AS content
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
      WHERE m.course_id = ?
      ORDER BY m.module_number, l.lesson_number`,
    [COURSE_ID],
  );

  const exactGroups = new Map();
  for (const row of rows) {
    const key = normalize(row.content);
    const group = exactGroups.get(key) ?? [];
    group.push(row);
    exactGroups.set(key, group);
  }

  const similarPairs = [];
  for (let index = 0; index < rows.length; index += 1) {
    for (let next = index + 1; next < rows.length; next += 1) {
      const left = rows[index];
      const right = rows[next];
      const score = jaccard(left.content, right.content);
      if (score >= 0.72) {
        similarPairs.push({
          left: `${left.moduleNumber}.${left.lessonNumber} ${left.titleAr}`,
          right: `${right.moduleNumber}.${right.lessonNumber} ${right.titleAr}`,
          sameModule: left.moduleId === right.moduleId,
          score: Number(score.toFixed(3)),
        });
      }
    }
  }

  similarPairs.sort((a, b) => b.score - a.score);
  const exactDuplicateGroups = [...exactGroups.values()]
    .filter((group) => group.length > 1)
    .map((group) => group.map((row) => `${row.moduleNumber}.${row.lessonNumber} ${row.titleAr}`));
  const moduleOne = rows.filter((row) => row.moduleNumber === 1);
  const moduleOnePairs = similarPairs.filter((pair) => pair.left.startsWith("1.") && pair.right.startsWith("1."));

  const report = {
    generatedAt: new Date().toISOString(),
    lessonCount: rows.length,
    exactDuplicateGroups,
    highSimilarityPairCount: similarPairs.length,
    sameModuleHighSimilarityPairCount: similarPairs.filter((pair) => pair.sameModule).length,
    moduleOneLessonCount: moduleOne.length,
    moduleOneHighSimilarityPairs: moduleOnePairs,
    topHighSimilarityPairs: similarPairs.slice(0, 80),
  };

  const reportFile = process.env.HSSE_DUPLICATION_REPORT ?? "hsse-lesson-duplication-report.json";
  await writeFile(
    new URL(`../verification/${reportFile}`, import.meta.url),
    JSON.stringify(report, null, 2),
    "utf8",
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await connection.end();
}
