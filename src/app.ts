import express from 'express'
import tenantRoute from './modules/tenants/tenant.routes'
import authRoute from './modules/auth/auth.routes'

const app = express()

app.use(express.json())

app.use("/api/tenants", tenantRoute)
app.use("/api/auth", authRoute)

export default app