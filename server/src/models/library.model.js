const mongoose = require("mongoose");

const LibrarySchema = new mongoose.Schema({});
//-------------------------Export-----------------------//
const Library = mongoose.model("Library", LibrarySchema);
module.exports = Library;
