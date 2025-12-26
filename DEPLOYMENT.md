# Deployment Guide

This guide covers deployment options for the Priority Focus Manager application.

## Recommended Deployment Platforms

### Option 1: Railway (Recommended for MVP)

Railway provides simple deployment for both frontend and backend with PostgreSQL support.

#### Backend Deployment

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Create new project**
   ```bash
   cd backend
   railway init
   ```

4. **Add PostgreSQL database**
   ```bash
   railway add
   # Select PostgreSQL
   ```

5. **Set environment variables**
   ```bash
   railway variables set JWT_SECRET=your-production-secret-key
   # DATABASE_URL is automatically set by Railway
   ```

6. **Deploy**
   ```bash
   railway up
   ```

#### Frontend Deployment

1. **Update API URL in frontend**
   - Create `.env.production` in frontend directory
   - Set `VITE_API_URL=https://your-backend-url.railway.app`

2. **Deploy to Vercel**
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

### Option 2: Vercel (Frontend) + Render (Backend)

#### Backend on Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add PostgreSQL database
6. Set environment variables

#### Frontend on Vercel

1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set environment variable: `VITE_API_URL`

### Option 3: Digital Ocean App Platform

1. Create new app from GitHub repository
2. Add two components:
   - Backend (Node.js service)
   - Frontend (Static site)
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy

## Environment Variables

### Backend (.env)

```env
PORT=3001
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-very-secure-secret-key-change-this
NODE_ENV=production
```

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend-api-url
```

## Database Migration

After deploying, run migrations:

```bash
# For Railway
railway run npm run migrate

# For Render or other platforms
# SSH into your server or use their CLI
npm run migrate
```

## Security Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use HTTPS for all connections
- [ ] Set NODE_ENV=production
- [ ] Enable CORS only for your frontend domain
- [ ] Set up database backups
- [ ] Use strong database password
- [ ] Keep dependencies updated
- [ ] Monitor error logs

## Performance Optimization

### Backend

- Enable gzip compression
- Set up connection pooling (already configured)
- Add Redis for session management (optional)
- Set up CDN for static assets

### Frontend

- Already optimized with Vite's build
- Consider adding service worker for PWA (future)
- Enable gzip on hosting platform
- Set up proper caching headers

## Monitoring

Recommended tools:
- **Error tracking**: Sentry
- **Analytics**: Simple Analytics or Plausible
- **Uptime monitoring**: UptimeRobot
- **Performance**: Vercel Analytics

## Scaling Considerations

For MVP (0-100 users):
- Single server instance is sufficient
- Basic PostgreSQL plan
- No caching needed

For Growth (100-1000 users):
- Consider read replicas for database
- Add Redis for caching
- Use CDN for assets
- Enable auto-scaling

## Backup Strategy

1. **Database Backups**
   - Daily automated backups (provided by most hosting platforms)
   - Test restore process monthly
   - Keep backups for 30 days

2. **Code Backups**
   - Git repository is source of truth
   - Tag releases: `git tag v1.0.0`
   - Keep deployment history

## Rollback Plan

If deployment fails:

1. **Immediate rollback**
   ```bash
   # For Railway
   railway rollback

   # For Vercel
   vercel rollback
   ```

2. **Database rollback**
   - Keep migration rollback scripts
   - Test rollback process before production deployment

## Cost Estimates (Monthly)

### Minimal Setup
- Vercel (Frontend): Free tier
- Railway (Backend + DB): ~$5-10
- **Total: $5-10/month**

### Production Setup
- Vercel Pro: $20
- Railway Pro: $20
- Database: $10-20
- Monitoring: $0-10
- **Total: $50-70/month**

## Post-Deployment

1. Test all functionality
2. Set up monitoring alerts
3. Configure backup notifications
4. Document any deployment-specific configurations
5. Create runbook for common issues

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Verify migrations ran successfully
- Check logs for specific errors

### Frontend can't connect to API
- Verify VITE_API_URL is set correctly
- Check CORS configuration
- Verify backend is running

### Database connection issues
- Check connection string format
- Verify SSL settings
- Check firewall rules
- Verify database is running

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
