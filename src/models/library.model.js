const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({});

const Library = mongoose.model("Library", librarySchema);
module.exports = Library;
