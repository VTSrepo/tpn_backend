const express = require('express');
const bodyParser = require('body-parser');
//const multer = require('multer');
const app = express();


const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '100mb' }))
app.use(cors({origin:'*'}));
const aqp = require('api-query-params');




const { UserAction } = require('./lib/action/user_action');
const { AddressAction } = require("./lib/action/address_action");

const path = require("path");
app.use("/", express.static(path.join(__dirname, "client", "build")));


app.post('/login', function (req, res) {
  var event = {stageVariables: {'env': 'dev'}};
  var userAction = new UserAction();
  event.headers = req.headers;
  event.body = req.body;
  console.log("Login");
  userAction.getUserLogin(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.get("/address", function (req, res) {
  var event = { stageVariables: { env: "dev" } };
  var addressAction = new AddressAction();
  event.headers = req.headers;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  addressAction.GetAddressList(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body);
    },
  });
});




app.post('/address', function (req, res) {
  var event = { stageVariables: { 'env': 'dev' } };
  var addressAction = new AddressAction();
  event.headers = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  console.log("Create address/Update Address");
  addressAction.CreateAddress(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})


module.exports = app;
