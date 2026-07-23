import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { InfrastructureService } from '../infrastructure/infrastructure.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type UserRecord = { id: string; username: string; email: string; password_hash: string };
type PublicUser = Omit<UserRecord, 'password_hash'>;
type SessionResult = { accessToken: string; refreshToken: string; user: PublicUser };

@Injectable()
export class AuthService {
  constructor(private readonly infrastructure: InfrastructureService) {}
  private get jwtSecret() { return process.env.JWT_SECRET ?? 'development-secret-change-me'; }
  private tokenHash(token: string) { return createHash('sha256').update(token).digest('hex'); }
  private accessToken(user: PublicUser) { return sign({ sub: user.id, username: user.username, email: user.email }, this.jwtSecret, { expiresIn: '15m' }); }
  private async createSession(user: PublicUser): Promise<SessionResult> {
    const refreshToken = randomBytes(48).toString('base64url');
    await this.infrastructure.query('INSERT INTO user_sessions (user_id, refresh_token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'30 days\')', [user.id, this.tokenHash(refreshToken)]);
    return { accessToken: this.accessToken(user), refreshToken, user };
  }
  async register(input: RegisterDto) {
    const username = input.username.trim(); const email = input.email.trim().toLowerCase();
    try {
      const passwordHash = await hash(input.password, 12);
      const result = await this.infrastructure.query<UserRecord>('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, password_hash', [username, email, passwordHash]);
      const { password_hash: _, ...user } = result.rows[0];
      return this.createSession(user);
    } catch (error: unknown) { if ((error as { code?: string }).code === '23505') throw new ConflictException('Username or email is already in use.'); throw error; }
  }
  async login(input: LoginDto) {
    const result = await this.infrastructure.query<UserRecord>('SELECT id, username, email, password_hash FROM users WHERE email = $1', [input.email.trim().toLowerCase()]);
    const record = result.rows[0];
    if (!record || !(await compare(input.password, record.password_hash))) throw new UnauthorizedException('Invalid email or password.');
    await this.infrastructure.query('UPDATE users SET last_login = NOW() WHERE id = $1', [record.id]);
    const { password_hash: _, ...user } = record;
    return this.createSession(user);
  }
  async refresh(refreshToken?: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token is required.');
    const result = await this.infrastructure.query<PublicUser>('SELECT u.id, u.username, u.email FROM user_sessions s JOIN users u ON u.id = s.user_id WHERE s.refresh_token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > NOW()', [this.tokenHash(refreshToken)]);
    const user = result.rows[0]; if (!user) throw new UnauthorizedException('Refresh token is invalid or expired.');
    await this.infrastructure.query('UPDATE user_sessions SET revoked_at = NOW() WHERE refresh_token_hash = $1', [this.tokenHash(refreshToken)]);
    return this.createSession(user);
  }
  async logout(refreshToken?: string) { if (refreshToken) await this.infrastructure.query('UPDATE user_sessions SET revoked_at = NOW() WHERE refresh_token_hash = $1', [this.tokenHash(refreshToken)]); }
  async me(accessToken?: string) {
    if (!accessToken) throw new UnauthorizedException('Access token is required.');
    try { const payload = verify(accessToken, this.jwtSecret) as { sub: string }; const result = await this.infrastructure.query<PublicUser>('SELECT id, username, email FROM users WHERE id = $1', [payload.sub]); if (!result.rows[0]) throw new UnauthorizedException(); return result.rows[0]; } catch { throw new UnauthorizedException('Access token is invalid or expired.'); }
  }
}
