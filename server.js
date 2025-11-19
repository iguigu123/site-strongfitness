const http = require('http')
const fs = require('fs')
const path = require('path')

const root = __dirname
const port = process.env.PORT || 8000
const homePage = process.env.DEFAULT_PAGE || (String(port)==='8001' ? 'admin-login.html' : 'index.html')

const types = { '.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon' }

const server = http.createServer((req,res)=>{
  const urlPath = decodeURIComponent(req.url.split('?')[0])
  let filePath = path.join(root, urlPath === '/' ? homePage : urlPath.replace(/^\//,''))
  if(!filePath.startsWith(root)) { res.writeHead(403); return res.end('Forbidden') }
  fs.stat(filePath, (err, stat) => {
    if (err) { res.writeHead(404); return res.end('Not Found') }
    if (stat.isDirectory()) filePath = path.join(filePath, 'index.html')
    fs.readFile(filePath, (e,data)=>{
      if(e){ res.writeHead(404); return res.end('Not Found') }
      const ext = path.extname(filePath).toLowerCase()
      res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' })
      res.end(data)
    })
  })
})

server.listen(port, () => {
  console.log(`Local server running at http://localhost:${port}/`)
})