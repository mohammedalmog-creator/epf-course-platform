import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mysql from 'mysql2/promise';

let conn: mysql.Connection;

beforeAll(async () => {
  conn = await mysql.createConnection(process.env.DATABASE_URL!);
});

afterAll(async () => {
  await conn.end();
});

describe('EPF Lesson Images', () => {
  it('all 35 EPF lessons should have image_url set', async () => {
    const [rows] = await conn.execute<mysql.RowDataPacket[]>(
      'SELECT COUNT(*) as total, COUNT(image_url) as with_img FROM lessons WHERE id <= 35'
    );
    expect(rows[0].total).toBe(35);
    expect(rows[0].with_img).toBe(35);
  });

  it('image URLs should be valid CDN URLs', async () => {
    const [rows] = await conn.execute<mysql.RowDataPacket[]>(
      'SELECT id, image_url FROM lessons WHERE id <= 35 ORDER BY id'
    );
    for (const row of rows) {
      expect(row.image_url).toBeTruthy();
      expect(row.image_url).toMatch(/^https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\//);
    }
  });

  it('each lesson should have a unique image URL', async () => {
    const [rows] = await conn.execute<mysql.RowDataPacket[]>(
      'SELECT COUNT(DISTINCT image_url) as unique_imgs FROM lessons WHERE id <= 35 AND image_url IS NOT NULL'
    );
    expect(rows[0].unique_imgs).toBe(35);
  });
});
