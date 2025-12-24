# Render Environment Variables Configuration

## Complete List of Required Environment Variables

Copy and paste these into your Render backend service's Environment tab:

### Database Configuration (PostgreSQL)
```
DB_TYPE=postgres
DB_HOST=dpg-d54ve36mcj7s73f24trg-a.oregon-postgres.render.com
DB_PORT=5432
DB_USER=africa_db_user
DB_PASSWORD=IkjL4VsT4aqRzoWASWTcTJVqRBZp78UP
DB_NAME=africa_db
```

### JWT Authentication
```
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random-and-secure
JWT_EXPIRE=30d
```

### Application Configuration
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://72230776-cmd.github.io
```

### Email Configuration (Required for Checkout Feature)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=72230776@students.liu.edu.lb
SMTP_PASSWORD=zqbfhiqmctukezmo
```

**Note**: Port 465 (SSL) is used instead of 587 (TLS) as it sometimes works better with Render's network restrictions. If emails still don't work, Render's free tier may be blocking SMTP connections entirely - in that case, orders will still work but emails won't be sent.

**Important Notes for Email:**
- Remove spaces from the app password when adding to Render (no spaces)
- This enables invoice emails when orders are created
- This enables delivery emails when orders are marked as delivered

---

## How to Set Environment Variables in Render

1. Go to your Render Dashboard: https://dashboard.render.com
2. Click on your **backend service** (not the database)
3. Click on the **"Environment"** tab
4. Click **"Add Environment Variable"** for each variable
5. Enter the **Key** and **Value** for each variable above
6. Click **"Save Changes"**
7. Render will automatically redeploy your service

---

## Important Notes

### JWT_SECRET
- **MUST be a long, random, secure string**
- Example: `JWT_SECRET=sk_live_51H3b4K3y_Ch4n63_7h15_70_50m37h1n6_R4nd0m`
- You can generate one using: `openssl rand -base64 32`
- Or use an online generator: https://randomkeygen.com/

### DB_PASSWORD
- This is your PostgreSQL database password from Render
- Keep it secure and never commit it to Git

### FRONTEND_URL
- This is used for CORS configuration
- Should match your GitHub Pages URL: `https://72230776-cmd.github.io`

### PORT
- Render automatically sets this, but you can override it
- Default Render port is usually `10000`

---

## Quick Copy-Paste (All Variables)

```
DB_TYPE=postgres
DB_HOST=dpg-d54ve36mcj7s73f24trg-a.oregon-postgres.render.com
DB_PORT=5432
DB_USER=africa_db_user
DB_PASSWORD=IkjL4VsT4aqRzoWASWTcTJVqRBZp78UP
DB_NAME=africa_db
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random-and-secure
JWT_EXPIRE=30d
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://72230776-cmd.github.io
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=72230776@students.liu.edu.lb
SMTP_PASSWORD=zqbfhiqmctukezmo
```

---

## Verification

After setting all variables and redeploying, check your Render logs to verify:
- ✅ Database connection successful
- ✅ Server running on port
- ✅ Email service ready (for checkout feature)
- ✅ No "Cannot find module" errors
- ✅ No "ENOTFOUND" database errors

---

## Troubleshooting

If you see errors:
1. **"Cannot find module 'pg'"** → Make sure `pg` is in `package.json` (it is)
2. **"ENOTFOUND" database error** → Check DB_HOST, DB_USER, DB_PASSWORD are correct
3. **"JWT_SECRET" error** → Make sure JWT_SECRET is set
4. **CORS errors** → Make sure FRONTEND_URL matches your frontend domain

