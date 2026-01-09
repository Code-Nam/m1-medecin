import winston from "winston";
import Transport from "winston-transport";
import * as Sentry from "@sentry/node";

const { combine, timestamp, printf, colorize, errors, json, splat } =
    winston.format;

const env = process.env.NODE_ENV || "development";
const SENTRY_DSN = process.env.SENTRY_DSN || "";
const sentryEnabled = !!SENTRY_DSN && env !== "development";

if (sentryEnabled) {
    Sentry.init({
        dsn: SENTRY_DSN,
        environment: env,
        release: process.env.RELEASE,
        tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0,
    });
}

class SentryTransport extends Transport {
    constructor(opts?: Transport.TransportStreamOptions) {
        super(opts || {});
    }

    override log(info: any, callback: () => void) {
        setImmediate(() =>
            (this as unknown as NodeJS.EventEmitter).emit("logged", info)
        );

        if (!sentryEnabled) {
            callback();
            return;
        }

        try {
            const { level, message, stack, ...meta } = info as any;

            if (info instanceof Error || stack) {
                const err = info instanceof Error ? info : new Error(message);
                if (stack) (err as any).stack = stack;

                Sentry.withScope((scope: Sentry.Scope) => {
                    scope.setLevel(mapLevel(level) as any);
                    Object.keys(meta || {}).forEach((k) =>
                        scope.setExtra(k, (meta as any)[k])
                    );
                    Sentry.captureException(err);
                });
            } else {
                Sentry.withScope((scope: Sentry.Scope) => {
                    scope.setLevel(mapLevel(level) as any);
                    Object.keys(meta || {}).forEach((k) =>
                        scope.setExtra(k, (meta as any)[k])
                    );
                    Sentry.captureMessage(message);
                });
            }
        } catch (e) {
            // swallow Sentry errors to avoid crashing the app
        }

        callback();
    }
}

function mapLevel(level: string): string {
    switch (level) {
        case "error":
            return "error";
        case "warn":
            return "warning";
        case "info":
            return "info";
        case "debug":
            return "debug";
        default:
            return "info";
    }
}

const consoleFormat = combine(
    colorize(),
    timestamp(),
    errors({ stack: true }),
    splat(),
    printf((info: any) => {
        const { timestamp, level, message, stack, ...meta } = info;
        const metaStr =
            meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
        return stack
            ? `[${timestamp}] ${level}: ${message}\n${stack}`
            : `[${timestamp}] ${level}: ${message}${metaStr}`;
    })
);

const jsonFormat = combine(
    timestamp(),
    errors({ stack: true }),
    splat(),
    json()
);

const loggerTransports: any[] = [];

if (env === "development") {
    loggerTransports.push(
        new winston.transports.Console({ format: consoleFormat })
    );
} else {
    // preprod / prod: files + json console (useful for container logs)
    loggerTransports.push(
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        })
    );
    loggerTransports.push(
        new winston.transports.File({ filename: "logs/combined.log" })
    );
    loggerTransports.push(
        new winston.transports.Console({ format: jsonFormat })
    );
}

if (sentryEnabled) {
    // only send errors to Sentry
    loggerTransports.push(new SentryTransport({ level: "error" }));
}

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || (env === "development" ? "debug" : "info"),
    format: env === "development" ? consoleFormat : jsonFormat,
    defaultMeta: { service: "m1-medecin-server" },
    transports: loggerTransports,
});

// helper stream for request loggers like morgan
export const expressStream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};
