const sql = require('mssql');
var aws = require( "aws-sdk" );
var Q = require( "q" );
var chalk = require( "chalk" );

var config = {
  "aws": {
    "region": "eu-west-1",
    "accessID": "AKIAIWWDC7DVU2TL7K5Q",
    "queueUrl": "https://sqs.eu-west-1.amazonaws.com/300787642153/henry_test_queue",
    "secretKey": "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"
  }
};

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
}

var sqs = new aws.SQS({
  region: config.aws.region,
  accessKeyId: config.aws.accessID,
  secretAccessKey: config.aws.secretKey,

  params: {
    QueueUrl: config.aws.queueUrl
  }
});

var receiveMessage = Q.nbind( sqs.receiveMessage, sqs );
var deleteMessage = Q.nbind( sqs.deleteMessage, sqs );


(function pollQueueForMessages() {

  console.log( chalk.yellow( "Starting long-poll operation." ) );

  receiveMessage({
    WaitTimeSeconds: 3, // Enable long-polling (3-seconds).
    VisibilityTimeout: 10
  })
    .then(
      function handleMessageResolve( data ) {

        if ( ! data.Messages ) {

          throw(
            workflowError(
              "EmptyQueue",
              new Error( "There are no messages to process." )
            )
          );

        }

        sql.connect(dbConfig).then(function () {

          new sql.Request().query(`insert into from_sqs(message) values('${data.Messages[0].Body}')`).then(function (res) {
            console.log(`Inserted ${data.Messages[0].Body} into sql server`);
            console.log( chalk.green( "Deleting:", data.Messages[ 0 ].MessageId ) );

            return(
              deleteMessage({
                ReceiptHandle: data.Messages[ 0 ].ReceiptHandle
              })
            );
          });
        });
        

      }
    )
    .then(
      function handleDeleteResolve( data ) {

        console.log( chalk.green( "Message Deleted!" ) );

      }
    )

    .catch(
      function handleError( error ) {

        switch ( error.type ) {
          case "EmptyQueue":
            console.log( chalk.cyan( "Expected Error:", error.message ) );
            break;
          default:
            console.log( chalk.red( "Unexpected Error:", error.message ) );
            break;
        }

      }
    )

    .finally( pollQueueForMessages );

})();

function workflowError( type, error ) {

  error.type = type;

  return( error );

}
