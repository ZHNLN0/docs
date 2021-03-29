const http = require('http')
const fs = require('fs')
const path = require('path')

const pathResolve = (dir) => {
  return path.resolve(__dirname, 'static', `.${dir}`)
}

const fsSend = (pathname) => {
  return new Promise((resolve, reject) => {
    if (pathname === '/') pathname = '/index.html'
    const filePath = pathResolve(pathname)
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
  
}


const server = http.createServer()

// server.on('connect', (a, b) => {
//   console.log(a, b)
// })

server.on('request', (req, res) => {
  fsSend(req.url).then(data => {
    res.write(data)
    res.end()
  }).catch(e => {
    res.writeHeader(404)
    res.end()
  })
  // fs.readFile(resolve('./index.html'), (err, data) => {
  //   if (err) {
  //     console.log(err)
  //     res.end(err.message)
  //   }
  //   res.write(data, 'utf8')
  //   res.end()
  // })
})

server.listen(7796, '127.0.0.1', () => {
  console.log('80 duankou')
})