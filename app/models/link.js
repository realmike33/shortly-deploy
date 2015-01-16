var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');



var LinkSchema = new Schema({
    url: {type: String},
    base_url: {type: String},
    code: {type: String},
    title: {type: String},
    visits:{type: Number, default: 0},
});

LinkSchema.pre('save', function(next) {
  var link = this;
  var code = crypto.createHash('sha1');
  code.update(link.url);
  link.code = code.digest('hex').slice(0, 5);
  next();
});

module.exports = mongoose.model('Link', LinkSchema);
