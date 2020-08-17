'use strict'

const express = require('express')
const cors = require('cors')
const sql = require('mssql')

const app = async config => {
  console.log('DEBUG: config', config)

  const exapp = express()
  exapp.use(cors())
  exapp.get('/posts', async function (req, res) {
    try {
      const config = {
        user: 'sa',
        password: 'reallyStrongPwd123',
        server: '127.0.0.1',
        database: 'testdb'
      }
      await sql.connect(config)

      const {
        recordset
      } = await sql.query('select * from test')
      sql.close()

      // send records as a response
      res.send(recordset)
    } catch (err) {
      console.log('DEBUG: getDataMSSQL -> err', err)
    }
  })

  exapp.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })

  return exapp
}

module.exports = app
