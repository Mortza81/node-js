const http = require('http')
const url = require('url')
const fs = require('fs')
const overviewtemp = fs.readFileSync('./data/template-overview.html', 'utf-8')
const producttemp = fs.readFileSync('./data/template-product.html', 'utf-8')
const cardtemp = fs.readFileSync('./data/template-card.html', 'utf-8')
const data = fs.readFileSync('./data/data.json', 'utf-8')
const dataobj = JSON.parse(data)
function replacefunc(product, temp) {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%ID%}/g, product.id)
    if (product.organic == false) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    }
    return output
}
function replacefuncproducttemp(product, temp) {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%ID%}/g, product.id)
    if (product.organic == false) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    }
    return output
}
const server = http.createServer((req, res) => {
    const path = req.url
    const { pathname, query } = url.parse(req.url, true)
    if (path == '/overview' || path == '/') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const cards = dataobj.map((el) => {
            return replacefunc(el, cardtemp)
        }).join('')
        const result = overviewtemp.replace(/{%PRODUCT_CARDS%}/g, cards)
        res.end(result)
    }
    else if (pathname == '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        let product = dataobj.filter((el => {
            if (el.id == query.id) {
                return el
            }
        }))
        product = replacefuncproducttemp(product[0], producttemp)
        res.end(product)
    }
    else {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        res.end("<h1>page not found</h1>")
    }
})
server.listen('5000', () => {
    console.log('here we go')
})