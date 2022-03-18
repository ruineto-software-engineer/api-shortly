import bcrypt from 'bcrypt';
import { connection } from '../database.js';

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query('SELECT * FROM users WHERE email=$1', [user.email])
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(`
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `, [user.name, user.email, passwordHash])

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUser(_req, res) {
  const { user } = res.locals;

  try {
    res.send(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUserShortUrls(req, res) {
  const { id } = req.params;

  try {
    const searchedUser = await connection.query(`
      SELECT 
        u.id, u.name 
      FROM users AS u
      WHERE u.id=$1
    `, [id]);
    if(searchedUser.rowCount === 0){
      res.sendStatus(404);
      return;
    }

    const searchedShortUrls = await connection.query(`
      SELECT 
        s.id, s."shortUrl", s.url, s."visitCount"
      FROM "shortenedUrls" AS s
      WHERE s."userId"=$1
    `, [searchedUser.rows[0].id]);

    let sumVisitCount = 0;
    searchedShortUrls.rows.map(shortUrl => sumVisitCount += shortUrl.visitCount);

    const userShortUrls = {
      ...searchedUser.rows[0],
      "visitCount": sumVisitCount,
      "shortenedUrls": [ ...searchedShortUrls.rows ]
    }

    res.status(200).send(userShortUrls);    
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getUsersRanking(_req, res) {
  try {
    const usersRanking = await connection.query(`
      SELECT 
        u.id, u.name,
        COUNT(s."shortUrl") AS "linksCount",
        SUM(s."visitCount") AS "visitCount"
      FROM users AS u
        JOIN "shortenedUrls" AS s ON s."userId"=u.id
      GROUP BY u.id
      ORDER BY "visitCount" DESC
      LIMIT 10
    `);

    res.send(usersRanking.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}