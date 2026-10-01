import express from 'express'
import tenantRoute from './modules/tenants/tenant.routes'
const app = express()

app.use(express.json())

app.use("/api/tenants", tenantRoute)

export default app