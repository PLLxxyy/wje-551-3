import { BusinessException } from './response.js';

export function assertRequired(value: unknown, label: string) {
  if (value === undefined || value === null || value === '') {
    throw new BusinessException(400, `${label}不能为空`);
  }
}

export function assertPositiveInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new BusinessException(400, `${label}必须为正整数`);
  }
}
