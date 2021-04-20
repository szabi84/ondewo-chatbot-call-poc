const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')

const RPC_PATH = path.join(__dirname, 'ondewo')
const protoPath = path.join(RPC_PATH, 'nlu', 'session.proto')
const packageDefinition = protoLoader.loadSync(
  protoPath,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs:
      [
        path.join(RPC_PATH, 'nlu'),
        path.join(RPC_PATH, 'qa'),
        path.join(__dirname, 'googleapis', 'google')
      ]
  })

// TODO It will fail because of missing dependencies: Error: no such type: google.protobuf.Empty
const proto = grpc.loadPackageDefinition(packageDefinition)['ondewo.nlu']

// TODO Question: grpc.credentials.createInsecure() has to be replaced with what?
const grpcClient = new proto.Session('https://webgrpc-nlu.ondewo.com:443', grpc.credentials.createInsecure())

// TODO Question: How to set up the projectId and the sessionId?
const detectIntentRequest = {
  queryInput: {
    text: {
      text: 'Hi',
      languageCode: 'en'
    }
  }
}

grpcClient.DetectIntent(detectIntentRequest)
  .then((response) => {
    console.log(response)
  })
  .catch((err) => {
    console.log(err)
  })
