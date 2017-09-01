"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const models_1 = require("./src/models");
class Router {
    static async startServer() {
        try {
            const options = {
                useMongoClient: true,
                server: { reconnectTries: Number.MAX_SAFE_INTEGER },
                replset: {},
            };
            options.server.socketOptions = options.replset.socketOptions = { keepAlive: 120 };
            mongoose.Promise = Promise;
            await mongoose.connect("mongodb://localhost/guessinggame?w=majority&journal=true", options);
            console.log("Connected to database!");
            this.app = express();
            this.app.use(bodyParser.json({ limit: "1mb" }));
            this.app.get("/guesses", this.getPreviousGuesses);
            this.app.post("/log-guess", this.logRequestHandler);
            this.server = this.app.listen(this.serverPort, () => {
                console.log("Guessing game backend Accepting connections");
            });
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
    static async logRequestHandler(req, res) {
        const guess = +req.body.guess;
        const solution = +req.body.solution;
        if (isNaN(guess)) {
            res.status(400).send({ message: "The 'guess' parameter was misformatted" });
            return;
        }
        if (isNaN(solution)) {
            res.status(400).send({ message: "The 'solution' parameter was misformatted" });
            return;
        }
        res.send(await new models_1.LogEntry({ guess, solution }).save());
    }
    static async getPreviousGuesses(req, res) {
        res.send(await models_1.LogEntry.find());
    }
}
Router.serverPort = 3000;
exports.Router = Router;
Router.startServer();
//# sourceMappingURL=main.js.map