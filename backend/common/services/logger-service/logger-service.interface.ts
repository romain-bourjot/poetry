type logFunction = (details: Record<string, any>, msg: string) => void

export interface LoggerServiceInterface {
  info: logFunction
  error: logFunction
  warn: logFunction
  fatal: logFunction
  trace: logFunction
}
