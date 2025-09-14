import path from 'node:path'
import fs from 'node:fs/promises'
import { sendResponse } from './sendResponse.js'
import { getContentType } from './getContentType.js'

export async function serveStatic(req, res, dirname){
    const publicDir = path.join(dirname, 'public')
    const filepath = path.join(publicDir, 
        req.url === '/' ? 'index.html' : req.url
    )
    const ext = path.extname(filepath)
    const contentType = getContentType(ext)

    try {
        const payload = await fs.readFile(filepath)
        sendResponse(res, 200, contentType, payload)
    }
    catch (err) {
        if (err.code === "ENOENT"){   
            const content = await fs.readFile(path.join(publicDir, '404.html'))
            sendResponse(res, 404, "text/html", content)
        }
        else {
            sendResponse(res, 500, "text/html", '<html><h1>Server Error: ${err.code}</h1></html>')
        }
    }
}