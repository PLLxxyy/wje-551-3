export function ok<T>(data: T) {
  return { code: 0, data };
}

export class BusinessException extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}
