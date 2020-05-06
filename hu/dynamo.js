var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');

var db = new AWS.DynamoDB();

function dynamo(table) {
  this.LRU = require("lru-cache");
  this.cache = new this.LRU({ max: 500 });
  this.tableName = table;
};

dynamo.prototype.init = function (whendone) {
  var tableName = this.tableName;
  var self = this;
  var params = {
    TableName: tableName /* required */
  };
  db.waitFor('tableExists', params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else
      whendone();
  });


};


dynamo.prototype.get = function (callback) {
  var params = {
    TableName: "Temperatura",
    FilterExpression: "#userID=:VAL",
    ExpressionAttributeNames: {
      "#userID": "userID"
    },
    ExpressionAttributeValues: {
      ":VAL": {
        S: "1"
      }
    }
  };
  var js = [];
  db.scan(params, function onScan(err, data) {
    if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      data.Items.forEach(function (a) {
        js.push({ "timeTemp": a.timeTemp.S, "temp": +a.temp.S });
      });
      var answer = js.map(el => Object.values(el));
      answer.sort(sortFunction);
      function sortFunction(a, b) {
        if (a[0] === b[0]) {
          return 0;
        }
        else {
          return (a[0] < b[0]) ? 1 : -1;
        }
      }
      fi=answer.slice(0, 5);
      fi[0][0]=fi[0][0].substring(8,10)+":"+fi[0][0].substring(10,12)+":"+fi[0][0].substring(12,14);
      fi[1][0]=fi[1][0].substring(8,10)+":"+fi[1][0].substring(10,12)+":"+fi[1][0].substring(12,14);
      fi[2][0]=fi[2][0].substring(8,10)+":"+fi[2][0].substring(10,12)+":"+fi[2][0].substring(12,14);
      fi[3][0]=fi[3][0].substring(8,10)+":"+fi[3][0].substring(10,12)+":"+fi[3][0].substring(12,14);
      fi[4][0]=fi[4][0].substring(8,10)+":"+fi[4][0].substring(10,12)+":"+fi[4][0].substring(12,14);
    }
    callback(err, fi);

  });
};

dynamo.prototype.getL = function (callback) {
  var params = {
    TableName: "Luz",
    FilterExpression: "#userID=:VAL",
    ExpressionAttributeNames: {
      "#userID": "userID"
    },
    ExpressionAttributeValues: {
      ":VAL": {
        S: "1"
      }
    }
  };
  var js = [];
  db.scan(params, function onScan(err, data) {
    if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      data.Items.forEach(function (a) {
        js.push({ "timeTemp": a.timeLuz.S, "temp": +a.luz.S });
      });
      var answer = js.map(el => Object.values(el));
      answer.sort(sortFunction);
      function sortFunction(a, b) {
        if (a[0] === b[0]) {
          return 0;
        }
        else {
          return (a[0] < b[0]) ? 1 : -1;
        }
      }
     // console.log(answer);
      // js.sort((a, b) => (a.timeTemp > b.timeTemp) ? -1 : 1)
      //console.log("jsnew"+js);
      fi=answer.slice(0, 5);
      fi[0][0]=fi[0][0].substring(8,10)+":"+fi[0][0].substring(10,12)+":"+fi[0][0].substring(12,14);
      fi[1][0]=fi[1][0].substring(8,10)+":"+fi[1][0].substring(10,12)+":"+fi[1][0].substring(12,14);
      fi[2][0]=fi[2][0].substring(8,10)+":"+fi[2][0].substring(10,12)+":"+fi[2][0].substring(12,14);
      fi[3][0]=fi[3][0].substring(8,10)+":"+fi[3][0].substring(10,12)+":"+fi[3][0].substring(12,14);
      fi[4][0]=fi[4][0].substring(8,10)+":"+fi[4][0].substring(10,12)+":"+fi[4][0].substring(12,14);
    }
    callback(err, fi);

  });
};

dynamo.prototype.getH = function (callback) {
  var params = {
    TableName: "Humedad",
    FilterExpression: "#userID=:VAL",
    ExpressionAttributeNames: {
      "#userID": "userID"
    },
    ExpressionAttributeValues: {
      ":VAL": {
        S: "1"
      }
    }
  };
  var js = [];
  db.scan(params, function onScan(err, data) {
    if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      data.Items.forEach(function (a) {
        js.push({ "timeHumedad": a.timeHumedad.S, "humedad": +a.humedad.S });
      });
      var answer = js.map(el => Object.values(el));
      answer.sort(sortFunction);
      function sortFunction(a, b) {
        if (a[0] === b[0]) {
          return 0;
        }
        else {
          return (a[0] < b[0]) ? 1 : -1;
        }
      }
     // console.log(answer);
      // js.sort((a, b) => (a.timeTemp > b.timeTemp) ? -1 : 1)
      //console.log("jsnew"+js);
      fi=answer.slice(0, 5);
      fi[0][0]=fi[0][0].substring(8,10)+":"+fi[0][0].substring(10,12)+":"+fi[0][0].substring(12,14);
      fi[1][0]=fi[1][0].substring(8,10)+":"+fi[1][0].substring(10,12)+":"+fi[1][0].substring(12,14);
      fi[2][0]=fi[2][0].substring(8,10)+":"+fi[2][0].substring(10,12)+":"+fi[2][0].substring(12,14);
      fi[3][0]=fi[3][0].substring(8,10)+":"+fi[3][0].substring(10,12)+":"+fi[3][0].substring(12,14);
      fi[4][0]=fi[4][0].substring(8,10)+":"+fi[4][0].substring(10,12)+":"+fi[4][0].substring(12,14);
    }
    callback(err, fi);

  });
};

module.exports = dynamo;
