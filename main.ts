import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";

import { LogEntry } from "./src/models";

export class Router
{
    public static readonly serverPort = 3000;

    private static app: express.Application;
    private static server: http.Server;

    public static async startServer ()
    {
        try
        {
            const options: mongoose.ConnectionOptions = {
                useMongoClient: true,
                server: { reconnectTries: Number.MAX_SAFE_INTEGER },
                replset: {},
            };

            options.server.socketOptions = options.replset.socketOptions = { keepAlive: 120 };

            (mongoose as any).Promise = Promise;
            await mongoose.connect("mongodb://localhost/guessinggame?w=majority&journal=true", options);
            console.log("Connected to database!");

            this.app = express();

            this.app.use(bodyParser.json({ limit: "1mb" }));

            this.app.get("/guesses", this.getPreviousGuesses);

            this.app.post("/log-guess", this.logRequestHandler);

            this.server = this.app.listen(this.serverPort, () =>
            {
                console.log("Guessing game backend Accepting connections");
            });
        }
        catch (err)
        {
            console.error(err);
            process.exit(1);
        }
    }

    private static async logRequestHandler (req: express.Request, res: express.Response)
    {
        const guess = +req.body.guess;
        const solution = +req.body.solution;

        if (isNaN(guess))
        {
            res.status(400).send({ message: "The 'guess' parameter was misformatted" });
            return;
        }

        if (isNaN(solution))
        {
            res.status(400).send({ message: "The 'solution' parameter was misformatted" });
            return;
        }

        res.send(await new LogEntry({ guess, solution }).save());
    }

    private static async getPreviousGuesses (req: express.Request, res: express.Response)
    {
        res.send(await LogEntry.find());
    }

}

Router.startServer();
