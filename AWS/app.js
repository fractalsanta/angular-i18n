const sql = require('mssql');
const axios = require('axios');
const Q = require('q');


const dbConfig = {
  user: 'sa',
  password: 'sweetmamma',
  server: "10.37.129.3\\SQLEXPRESS",
  database: "demo",
  connectionTimeout: 300000,
  requestTimeout: 300000,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000
  }
};


function sendRecordsById(recordset) {
  sql.connect(dbConfig).then(function () {

    let chain = Q.when();
    recordset.forEach(function (record, index) {
      chain = chain.then(function (res) {
        console.log(index, ' -- ', record);
        return sendRecord(record);
      });
    });
    console.log('All done!');


  }).catch(function (err) {
    console.log(err);
  });
}

function sendRecord(id) {

  let postObject = {};
  postObject.body = {};

  return new sql.Request().query(`select user_name, user_level from users where user_id = ${id}`).then(function (values) {
    const record = values[0];
    postObject.body.user_name = record.user_name.toString();
    postObject.body.user_level = record.user_level.toString();
  }).then(function () {
    return axios.post(`http://localhost:8080/user`, postObject);
  }).then(function (res) {
    return res.status;
  }).catch(function (err) {
    console.log(err);
  });
}

function synchronizeRecords() {
  sql.connect(dbConfig).then(function () {

    new sql.Request().query(`select user_id from users order by user_id`).then(function (res) {
      let fArray = res.map(function (item) {
        return item.user_id;
      });
      sendRecordsById(fArray);
    });
  });
}
function test() {
  sql.connect(dbConfig).then(function () {

    new sql.Request().query(`insert into users(user_name) values('aaa')`).then(function (res) {
      console.log('done');
    });
  });
}


// sql.connect(dbConfig).then(function () {
// sendRecord(1);
// });

// sendRecordsById([1, 2]);

synchronizeRecords();
// test();