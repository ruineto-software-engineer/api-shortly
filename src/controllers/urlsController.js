import { connection } from '../database.js';

export async function postUrl(req, res) {
  const { url } = req.body;
  const user = res.locals.user;

  try {
    if (!url) {
      res.sendStatus(404);
      return;
    }

    const urlShort = (Math.round(Date.now()/1000)).toString(16);

    await connection.query(`
      INSERT INTO "shortenedUrls"
        ("userId", url, "shortUrl")
      VALUES
        ($1, $2, $3)
    `, [user.id, url, urlShort]);

    res.status(201).send({ "shortUrl": urlShort });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getShortUrl(req, res) {
  const shortUrl = req.params.shortUrl;

  try {
    if(!shortUrl){
      res.sendStatus(404);
      return;
    }

    const searchedShortUrl = await connection.query(`
      SELECT * FROM "shortenedUrls" AS s 
      WHERE s."shortUrl"=$1
    `, [shortUrl]);
    if(searchedShortUrl.rowCount === 0){
      res.sendStatus(404);
      return;
    }

    res.status(200).send(searchedShortUrl.rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function deleteUrl(req, res) {
  const user = res.locals.user;
  const { id } = req.params;
  console.log(id);

  try {
    const searchedShortUrl = await connection.query(`
      SELECT * FROM "shortenedUrls" AS s 
      WHERE s.id=$1 AND s."userId"=$2
    `, [id, user.id]);
    if(searchedShortUrl.rowCount === 0){
      res.sendStatus(401);
      return;
    }

    await connection.query(`
      DELETE FROM "shortenedUrls" AS s 
      WHERE s.id=$1;
    `, [id]);

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};