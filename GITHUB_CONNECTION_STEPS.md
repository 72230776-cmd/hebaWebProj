# GitHub Connection Steps for Heba's Account

## ✅ Current Git Configuration
- **Name**: Heba
- **Email**: 72230776@students.liu.edu.lb
- **Repository**: Initialized and ready

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Make sure you're logged in as the account associated with: **72230776@students.liu.edu.lb**
3. Repository name: `africa-full-website` (or your preferred name)
4. Description: "Full-stack web application - CSCI426 Project Phase 2"
5. Choose **Public** or **Private**
6. **DO NOT** check "Initialize with README" (we already have files)
7. Click **"Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see a page with setup instructions. Use one of these methods:

### Option A: If repository is empty (recommended)
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/africa-full-website.git
git branch -M main
git push -u origin main
```

### Option B: If you need to change existing remote
```bash
# Check current remote (if any)
git remote -v

# Remove old remote (if exists)
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/africa-full-website.git

# Push to new repository
git branch -M main
git push -u origin main
```

## Step 3: Authentication

When you push, GitHub will ask for authentication. You have two options:

### Option A: Personal Access Token (Recommended)
1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token
5. When prompted for password, paste the token instead

### Option B: GitHub CLI
```bash
# Install GitHub CLI if not installed
# Then authenticate
gh auth login
```

## Step 4: Verify Connection

```bash
# Check remote URL
git remote -v

# Should show:
# origin  https://github.com/YOUR_USERNAME/africa-full-website.git (fetch)
# origin  https://github.com/YOUR_USERNAME/africa-full-website.git (push)
```

## Important Notes

- The Git config is set **locally** for this repository only
- Your commits will show as "Heba <72230776@students.liu.edu.lb>"
- Make sure you're logged into the correct GitHub account when creating the repository
- If you have multiple GitHub accounts, use GitHub Desktop or configure SSH keys

## Troubleshooting

### If you get "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/africa-full-website.git
```

### If authentication fails
- Make sure you're using a Personal Access Token (not password)
- Check that the token has `repo` permissions
- Verify you're logged into the correct GitHub account

### If you need to change GitHub account
1. Log out of current GitHub account
2. Log in with account: 72230776@students.liu.edu.lb
3. Create new repository
4. Connect using the commands above

