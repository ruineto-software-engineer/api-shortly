import * as userRepository from "../repositories/userRepository.js";
import bcrypt from 'bcrypt';

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await userRepository.existingUsers(user.email);
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await userRepository.createUser(user.name, user.email, passwordHash);

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
    const searchedUser = await userRepository.searchedUser(id);
    if(searchedUser.rowCount === 0){
      res.sendStatus(404);
      return;
    }

    const searchedShortUrls = await userRepository.searchedShortUrls(searchedUser.rows[0].id);

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
    const usersRanking = await userRepository.usersRanking();

    res.send(usersRanking.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}