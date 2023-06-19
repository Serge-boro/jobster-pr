require('dotenv').config()

const connectDB = require('./db/connect')
const JobModel = require('./models/Job')
const jsonJob = require('./MOCK_DATA.json')

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    await JobModel.deleteMany()
    await JobModel.create(jsonJob)
    console.log('SUCCESS!!!')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

start()
