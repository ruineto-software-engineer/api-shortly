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