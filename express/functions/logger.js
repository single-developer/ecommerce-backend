const { createLogger, transports, format } = require(`winston`);

const userLogger = createLogger({
  transports: [
    new transports.File({
      filename: `success.log`,
      level: `info`,
      format: format.combine(format.timestamp(), format.align(), format.json()),
    }),
    new transports.File({
      filename: `error.log`,
      level: `error`,
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = { userLogger };
