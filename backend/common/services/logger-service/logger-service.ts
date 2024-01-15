import pino from 'pino'
import { type LoggerServiceInterface } from './logger-service.interface'

export class LoggerService implements LoggerServiceInterface {
  private readonly logger: pino.Logger

  constructor ({ name, level }: { name: string, level: pino.LevelWithSilent }) {
    this.logger = pino({
      name,
      level
    })
  }

  info (details: Record<string, any>, msg: string): void {
    this.logger.info({ details }, msg)
  }

  error (details: Record<string, any>, msg: string): void {
    this.logger.error({ details }, msg)
  }

  warn (details: Record<string, any>, msg: string): void {
    this.logger.warn({ details }, msg)
  }

  fatal (details: Record<string, any>, msg: string): void {
    this.logger.fatal({ details }, msg)
  }

  trace (details: Record<string, any>, msg: string): void {
    this.logger.trace({ details }, msg)
  }
}
