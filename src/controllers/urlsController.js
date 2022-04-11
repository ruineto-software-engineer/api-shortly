import * as urlsRepository from "../repositories/urlsRepository.js";

export async function postUrl(req, res) {
  const user = res.locals.user;
  const { url } = req.body;

  try {
    if (!url) {
      res.sendStatus(404);
      return;
    }

    const urlShort = (Math.round(Date.now()/1000)).toString(16);

    await urlsRepository.createUrl(user.id, url, urlShort);

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

    const searchedShortUrl = await urlsRepository.getShortUrl(shortUrl);
    if(searchedShortUrl.rowCount === 0){
      res.sendStatus(404);
      return;
    }

    const searchedVisitCount = await urlsRepository.searchedVisitCount(shortUrl);

    searchedVisitCount.rows[0].visitCount++;

    await urlsRepository.updateVisitCount(searchedVisitCount.rows[0].visitCount, searchedShortUrl.rows[0].id)
    
    res.status(200).send(searchedShortUrl.rows[0].url);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function deleteUrl(req, res) {
  const user = res.locals.user;
  const { id } = req.params;

  try {
    const searchedShortUrl = await urlsRepository.searchedShortUrl(id, user.id);
    if(searchedShortUrl.rowCount === 0){
      res.sendStatus(401);
      return;
    }

    await urlsRepository.deleteUrl(id);

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export async function getUrls(_req, res) {
  try {
    const urls = await urlsRepository.getUrls();

    res.status(200).send(urls.rows);    
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}