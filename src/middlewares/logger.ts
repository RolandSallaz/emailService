import expressWinston from "express-winston";
import { format, transports } from "winston";
const { combine, prettyPrint, timestamp, json, simple } = format;

const formatLogs = () =>
  combine(json(), timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }), prettyPrint());

export const requestLogger = expressWinston.logger({
  transports: [new transports.File({ filename: "logs/request.log" })],
  format: formatLogs(),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  requestWhitelist: [...expressWinston.requestWhitelist, "body"], // добавляем 'body' в requestWhitelist
});
export const errorLogger = expressWinston.errorLogger({
  transports: [new transports.File({ filename: "logs/error.log" })],
  format: formatLogs(),
});
