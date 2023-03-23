const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const port = 5000

app.get('/', async(req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Doctor Service listening on port ${port}`)
})