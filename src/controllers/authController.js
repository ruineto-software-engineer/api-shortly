import * as authRepository from "../repositories/authRepository.js";
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

export async function login(req, res) {
  const { email, password } = req.body;

  const { rows: users } = await authRepository.searchUserByEmail(email);
  const [user] = users;
  if (!user) {
    return res.sendStatus(401);
  }

  if (bcrypt.compareSync(password, user.password)) {
    const token = uuid();

    await authRepository.createSession(token, user.id);

    return res.send(token);
  }

  res.sendStatus(401);
}