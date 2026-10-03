import express from 'express'
import tenantRoutes from './modules/tenants/tenant.routes'
import authRoutes from './modules/auth/auth.routes'
import authTestRoutes from './modules/auth/auth.test.routes'

const app = express()

app.use(express.json())

app.use("/api/tenants", tenantRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/test", authTestRoutes)

export default app