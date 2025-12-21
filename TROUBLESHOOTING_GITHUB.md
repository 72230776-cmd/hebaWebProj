# Troubleshooting GitHub Connection

## Issue: Repository Not Found

If you get "Repository not found" error, check the following:

### 1. Verify Repository Exists
- Go to: https://github.com/72230776-cmd/hebaWebProj
- Make sure you're logged in with the correct GitHub account
- Verify the repository exists and you have access

### 2. Repository Name Check
The repository URL should be exactly:
```
https://github.com/72230776-cmd/hebaWebProj.git
```

### 3. Create Repository if It Doesn't Exist
If the repository doesn't exist yet:

1. Go to: https://github.com/new
2. Repository name: `hebaWebProj`
3. Description: "Full-stack web application - CSCI426 Project Phase 2"
4. Choose Public or Private
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

### 4. Authentication Issues

If the repository exists but you still get "not found", you need to authenticate:

#### Option A: Personal Access Token (Recommended)
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" > "Generate new token (classic)"
3. Name: "hebaWebProj-access"
4. Select scope: `repo` (full control)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

When pushing, use the token as password:
```bash
git push -u origin main
# Username: 72230776-cmd (or your GitHub username)
# Password: [paste your personal access token]
```

#### Option B: GitHub CLI
```bash
gh auth login
# Follow the prompts
```

#### Option C: SSH (Alternative)
1. Generate SSH key:
```bash
ssh-keygen -t ed25519 -C "72230776@students.liu.edu.lb"
```

2. Add to GitHub:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to: https://github.com/settings/keys
   - Add new SSH key

3. Change remote to SSH:
```bash
git remote set-url origin git@github.com:72230776-cmd/hebaWebProj.git
```

### 5. Verify Access
Make sure you're logged into GitHub with the account that owns the repository.

### 6. Try Again
After fixing the issue, try:
```bash
git push -u origin main
```

