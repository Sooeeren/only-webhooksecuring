const mongoose = require('mongoose');
const router = require('../router/router.js');
const sendercontroller = require('./sendercontroller.js');
const dotenv = require('dotenv');
dotenv.config();

const MainSchema = new mongoose.Schema({
  wid: String,
  whitelistedips : [String],
  targetwebhook: String
});

function generateid() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const Main = mongoose.model('MainSchema', MainSchema);

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database loaded');
});

if (mongoose.models.MainSchema) {
} else {
  Main.createCollection();
}

function NewWebhook(target, ips) {
  if (mongoose.models.MainSchema) {
    if (Main.find()) {
      var id = generateid();
      if (!Main.find({ id: id })) {
        Main.create({ wid: id, whitelistedips: ips, targetwebhook: target }, function(err, doc) {
          if (err) {
            console.log(err);
            return false;
          } else {
            return true;
          }
        });
      } else {
        id = generateid();
        Main.create({ wid: id, whitelistedips: ips, targetwebhook: target }, function(err, doc) {
          if (err) {
            console.log(err);
            return false;
          } else {
            return true;
          }
        });
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function fetchallids() {
  if (mongoose.models.MainSchema) {
    if (Main.find()) {
      Main.find({}, function(err, docs) {
        if (err) {
          console.log(err);
          return false;
        } else {
          var ids = [];
          docs.forEach(function(doc) {
            ids.push(doc.wid);
          });
          router.LoadRoutes(ids);
        }
      });
    } else {
      return false;
    }
  } else {
    return false;
  }
}

async function verifywhitelist(id, ip, message) {
  if (mongoose.models.MainSchema) {
    if (Main.find({ wid: id })) {
      Main.findOne({ wid: id }, function(err, doc) {
        if (err) {
          console.log(err);
          return false;
        } else {
          if (doc.whitelistedips.includes(ip)) {
            sendercontroller.sendWebhook(doc.targetwebhook, message);
            return true;
          } else {
            return false;
          }
        }
      });
    } else {
      return false;
    }
  } else {
    return false;
  }
}

fetchallids();

exports.NewWebhook = NewWebhook;
exports.verifywhitelist = verifywhitelist;