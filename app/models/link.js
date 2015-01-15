// var db = require('../config');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');



var LinkSchema = new Schema({
    url: {type: String},
    base_url: {type: String},
    code: {type: String},
    title: {type: String},
    visits:{type: Number},
});

LinkSchema.pre('save', function(next) {
  var link = this;
  var code = crypto.createHash('sha1');
  code.update(link.url);
  link.code = code.digest('hex').slice(0, 5);
  next();
});

module.exports = mongoose.model('Link', UserSchema);
