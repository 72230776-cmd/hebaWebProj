# GitHub Authentication Setup for Private Repository

## Why Authentication is Needed
Your repository is **Private**, which requires authentication to push code. GitHub no longer accepts passwords - you need a **Personal Access Token**.

## Step-by-Step: Create Personal Access Token

### Step 1: Generate Token
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in the form:
   - **Note**: `hebaWebProj-access` (or any name you prefer)
   - **Expiration**: Choose duration (90 days, 1 year, or no expiration)
   - **Scopes**: Check **`repo`** (this gives full control of private repositories)
4. Scroll down and click **"Generate token"**
5. **IMPORTANT**: Copy the token immediately! It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - You won't be able to see it again
   - Save it somewhere safe temporarily

### Step 2: Push Using Token

When you run `git push`, you'll be prompted for credentials:

```bash
git push -u origin main
```

**When prompted:**
- **Username**: `72230776-cmd` (your GitHub username)
- **Password**: Paste your Personal Access Token (NOT your GitHub password)

### Step 3: Save Credentials (Optional but Recommended)

To avoid entering the token every time, you can configure Git Credential Manager:

#### Option A: Use Git Credential Manager (Windows)
```bash
# This will prompt you once and save credentials
git push -u origin main
# Enter username and token when prompted
# Windows Credential Manager will save it
```

#### Option B: Store in Git Config (Less Secure)
```bash
# Store credentials (valid for 1 hour)
git config --global credential.helper wincred
```

## Alternative: Use GitHub Desktop

If you prefer a GUI approach:

1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. File → Add Local Repository
4. Select your project folder
5. Click "Publish repository" or "Push origin"

## Alternative: Use SSH (More Secure)

### Step 1: Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "72230776@students.liu.edu.lb"
# Press Enter to accept default location
# Press Enter for no passphrase (or set one for security)
```

### Step 2: Copy Public Key
```bash
# Display your public key
cat ~/.ssh/id_ed25519.pub
# Copy the entire output
```

### Step 3: Add to GitHub
1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. **Title**: `My Computer` (or any name)
4. **Key**: Paste your public key
5. Click **"Add SSH key"**

### Step 4: Change Remote to SSH
```bash
git remote set-url origin git@github.com:72230776-cmd/hebaWebProj.git
```

### Step 5: Test Connection
```bash
ssh -T git@github.com
# Should say: "Hi 72230776-cmd! You've successfully authenticated..."
```

### Step 6: Push
```bash
git push -u origin main
```

## Quick Test: Verify Remote
```bash
git remote -v
# Should show: origin  https://github.com/72230776-cmd/hebaWebProj.git (fetch)
#              origin  https://github.com/72230776-cmd/hebaWebProj.git (push)
```

## Troubleshooting

### "Repository not found" Error
- This usually means authentication failed
- Make sure you're using a Personal Access Token, not password
- Verify the token has `repo` scope
- Check that you're logged into the correct GitHub account

### "Permission denied" Error
- Your token might not have the right permissions
- Generate a new token with `repo` scope
- Make sure you own the repository or have write access

### Token Not Working
- Tokens expire based on the expiration you set
- Generate a new token if the old one expired
- Make sure you copied the entire token (starts with `ghp_`)

## Security Notes

⚠️ **Never commit tokens or passwords to Git!**
- Tokens are already in `.gitignore`
- If you accidentally commit a token, revoke it immediately on GitHub
- Generate a new token if compromised

## Next Steps After Authentication

Once you successfully push:
1. Verify on GitHub: https://github.com/72230776-cmd/hebaWebProj
2. You should see your files (README.md, package.json, etc.)
3. Future pushes will be easier (credentials saved)

