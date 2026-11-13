# MongoDB Connection

Read and analyze this document, and answer the following questions to be asked. Reply back to the developer if there are areas or conflicts that needs to be address before planning.

## Rules: 

Add these rules to `AGENTS.md` file under the header like "MongoDB handshake rules" or "Backend database configuration rules".

1. DO NOT READ or manipulate the `.env` file.
2. DO NOT INCLUDE the `.env` file in the specs.
3. You can edit and update this Markdown file based on the discussed and agreed plans.

---

## Configuration: `db.js`

1. Does `node:dns` still needs in the file? What are the industry-standard approach? 

---

## `app.js`

1. Is this file still important in the codebase? Explain why in 2 to 3 sentences.

---

## `index.js`

1. I make the ExpressJS handshake simpler. But does these following imports and code blocks are important and relevant in the file?

```js
import { configureMongoDns, connectDatabase } from './config/db.js'
import { loadEnv } from './config/env.js'
import { createApp } from './app.js'

try {
  config = loadEnv()
} catch (error) {
  console.error(`Configuration error: ${error.message}`)
  process.exit(1)
}

try {
  configureMongoDns()
  await connectDatabase(config.mongoUri)
  console.log('MongoDB connection established.')
} catch (error) {
  console.warn(`MongoDB is unavailable: ${error.message}`)
}

const app = createApp({ corsOrigins: config.corsOrigins })

const server = app.listen(config.port, () => {
  console.log(`CIIT campus tour API listening on port ${config.port}.`)
})

function shutdown(signal) {
  console.log(`${signal} received. Shutting down.`)
  server.close(() => {
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))


export default app;

```

---

## `env.js`

1. Does `env.js` important in the codebase? Or no because it just adds more complexity, making it more complicated to manage in the codebase?