import express from 'express'
import tenantRoutes from './modules/tenants/tenant.routes'
import authRoutes from './modules/auth/auth.routes'
import authTestRoutes from './modules/auth/auth.test.routes'
import postRoutes from './modules/posts/post.routes'
import mediaRoutes from './modules/media/medita.route'


const app = express()

app.use(express.json())

app.use("/api/tenants", tenantRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/test", authTestRoutes)
app.use('/api/posts', postRoutes)
app.use("/api/media", mediaRoutes);
export default app