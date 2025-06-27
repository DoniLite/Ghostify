import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import winston from 'winston'

const logDir = path.join(process.cwd(), '/logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      if (stack) {
        return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
      }
      return `${timestamp} [${level.toUpperCase()}]: ${message}`
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log')
    })
  ],
  exitOnError: false
})
