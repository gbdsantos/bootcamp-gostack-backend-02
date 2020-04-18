import { getRepository } from 'typeorm';
// import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';
import { compare } from 'bcryptjs';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Incorrect email/password combination.');
    }

    // user.password - Senha criptografada
    // password - Senha não-criptografada

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorrect email/password combination.');
    }

    // Usuário autenticado
    const token = sign({}, 'c2e9008e023866bdab152745df477781', {
      subject: user.id,
      expiresIn: '1d',
    })
    return {
      user,
      token,
    }
  }
}

export default AuthenticateUserService;
