import pino, { transport } from "pino";

const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: `SYS:yyyy-mm-dd HH:MM:`,
            include: "pid,time,hostname",
            
        },
    },
});


export default logger;