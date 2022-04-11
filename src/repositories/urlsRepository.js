import { connection } from '../database.js';

export async function createUrl(userId, url, urlShort) {
  const promise = await connection.query(`
    INSERT INTO "shortenedUrls"
      ("userId", url, "shortUrl")
    VALUES
      ($1, $2, $3)
  `, [userId, url, urlShort]);

  return promise;
}

export async function getShortUrl(shortUrl) {
  const promise = await connection.query(`
    SELECT 
      s.id, s."shortUrl", s.url 
    FROM "shortenedUrls" AS s 
    WHERE s."shortUrl"=$1
  `, [shortUrl]);

  return promise;
}

export async function searchedVisitCount(shortUrl) {
  const promise = await connection.query(`
    SELECT 
      s."visitCount"
    FROM "shortenedUrls" AS s 
    WHERE s."shortUrl"=$1
  `, [shortUrl]);

  return promise;
}

export async function updateVisitCount(searchedVisitCount, searchedShortUrlId) {
  const promise = await connection.query(`
    UPDATE "shortenedUrls"
      SET "visitCount"=$1 
    WHERE id=$2
  `, [searchedVisitCount, searchedShortUrlId]);

  return promise;
}

export async function searchedShortUrl(id, userId) {
  const promise = await connection.query(`
    SELECT * FROM "shortenedUrls" AS s 
    WHERE s.id=$1 AND s."userId"=$2
  `, [id, userId]);

  return promise;
}

export async function deleteUrl(id) {
  const promise = await connection.query(`
    DELETE FROM "shortenedUrls" AS s 
    WHERE s.id=$1;
  `, [id]);

  return promise;
}

export async function getUrls() {
  const promise = await connection.query(`
    SELECT 
      *
    FROM "shortenedUrls" AS s
    ORDER BY s."visitCount" DESC
  `);

  return promise;
}