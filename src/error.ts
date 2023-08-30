import type { RequestConfig, Response } from './types';

type ErrorMeta = {
  config: RequestConfig;
  response?: Response;
};

export class MiniQuestError extends Error {
  config: RequestConfig;
  response?: Response;

  constructor(message: string, errorMeta: ErrorMeta) {
    const { config, response } = errorMeta;
    super(message);
    this.config = config;
    this.response = response;
  }

  toJSON() {
    return {
      message: this.message,
      stack: this.stack,
      config: this.config,
      status:
        this.response && this.response.status ? this.response.status : null,
    };
  }

  static create(message: string, errorMeta: ErrorMeta) {
    return new this(message, errorMeta);
  }
}

export function createError(message: string, errorMeta: ErrorMeta) {
  return MiniQuestError.create(message, errorMeta);
}
