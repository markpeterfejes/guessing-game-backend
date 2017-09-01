"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LogEntrySchema = new mongoose_1.Schema({
    guess: { type: Number, required: true },
    solution: { type: Number, required: true },
});
exports.LogEntry = mongoose_1.model("LogEntry", LogEntrySchema);
//# sourceMappingURL=logEntry.js.map