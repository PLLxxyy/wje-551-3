import jwt from 'jsonwebtoken';
import { users } from '../database/seeds/initial.js';
import { BusinessException } from '../utils/response.js';

const secret = process.env.JWT_SECRET ?? 'dev-secret';

export class AuthService {
  login(username: string, password: string) {
    const user = users.find((item) => item.username === username && item.password === password);
    if (!user) throw new BusinessException(400, '账号或密码错误');
    const token = jwt.sign({ sub: user.id, username: user.username }, secret, { expiresIn: '7d' });
    const { password: _password, ...safeUser } = user;
    return { token, user: safeUser };
  }

  me(userId: string) {
    const user = users.find((item) => item.id === userId);
    if (!user) throw new BusinessException(401, '登录已失效');
    const { password, ...safeUser } = user;
    return safeUser;
  }

  verify(token: string) {
    const decoded = jwt.verify(token, secret) as { sub: string };
    const user = users.find((item) => item.id === decoded.sub);
    if (!user) throw new BusinessException(401, '登录已失效');
    return user;
  }
}

export const authService = new AuthService();
