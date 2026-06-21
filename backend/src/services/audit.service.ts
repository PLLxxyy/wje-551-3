import { v4 as uuid } from 'uuid';
import { auditLogs } from '../database/seeds/initial.js';
import type { AuditLog, User } from '../types/index.js';

export class AuditService {
  list(query: Record<string, string | undefined>) {
    return auditLogs
      .filter((log) => !query.module || log.module === query.module)
      .filter((log) => !query.username || log.username.includes(query.username))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async record(input: Omit<AuditLog, 'id' | 'createdAt' | 'userId' | 'username' | 'ip'>, user?: User, ip = '127.0.0.1') {
    setTimeout(() => {
      auditLogs.unshift({
        id: uuid(),
        userId: user?.id ?? 'system',
        username: user?.name ?? '系统',
        ip,
        createdAt: new Date().toISOString(),
        ...input,
      });
    }, 0);
  }
}

export const auditService = new AuditService();
