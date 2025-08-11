"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = exports.pinecone = void 0;
var pinecone_1 = require("@pinecone-database/pinecone");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var pinecone = new pinecone_1.Pinecone({
    apiKey: "".concat(process.env.PINECONE_ENV)
});
exports.pinecone = pinecone;
var index = pinecone.index("movie-embeddings");
exports.index = index;
