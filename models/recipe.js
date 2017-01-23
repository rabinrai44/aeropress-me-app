const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    default: `Recipe ${new Date().toISOString()}`.replace(/\d\d\d\d-\d\d-/, (match) => (
     `${match}<wbr>`)), //default to recipe and date
    maxlength: 40
  },
  author: {
    type: String,
    maxlength: 25
  },
  orientation: String,
  massWater: Number,
  massCoffee: Number,
  waterTemp: Number,
  grind: String,
  instructions: String,
  votes: Number, //data from votes collection
  ownerID: String,
  created: {
    type: Date,
    default: Date.now
  }
});


const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
