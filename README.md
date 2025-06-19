# Framer + MailerLite Webhook (Vercel)

This project provides a Vercel serverless function to connect Framer forms to MailerLite via API.

## Setup

1. **Clone this repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set environment variables in Vercel**
   - `MAILERLITE_API_KEY`: Your MailerLite API key
   - `MAILERLITE_GROUP_ID`: Your MailerLite group ID (e.g., 157146606153500460)
4. **Deploy to Vercel**
   - Push to GitHub and import the repo in Vercel, or use `vercel` CLI.

## Usage

- Set your Framer form action to:
  ```
  https://your-vercel-project.vercel.app/api/subscribe
  ```
- Use method `POST` and include at least the `email` field (optionally `name`).

## Example API Route

See `api/subscribe.js` for the serverless function code.

---

**Security:** Never expose your API key in client-side code. Always use environment variables. 

## **Public Repo Security Checklist**

### 1. **No Secrets in Code**
- **API keys, tokens, or credentials** should NOT be present in any code files.
- Your `api/subscribe.js` uses `process.env.MAILERLITE_API_KEY` and `process.env.MAILERLITE_GROUP_ID`—this is correct and safe.

### 2. **No Secrets in Versioned Files**
- Make sure you have **not committed a `.env` file** or any file containing secrets.
- Your `.gitignore` includes `.env`, so this is good.

### 3. **No Sensitive Data in README or Comments**
- Double-check your `README.md` and code comments for any accidental sensitive info.

### 4. **No Sensitive Data in Git History**
- If you ever committed secrets and then removed them, they may still exist in git history.  
  (If you're unsure, let me know and I can walk you through checking.)

### 5. **Environment Variables Only in Vercel**
- Your actual API key and group ID should only be set in Vercel's environment variables, not in the repo.

## **How to Double-Check**

- Run this command in your project directory to search for your API key or group ID:
  ```sh
  git grep 'YOUR_API_KEY'  # Replace with a unique part of your key
  git grep 'YOUR_GROUP_ID' # Replace with your group ID
  ```
- Or, just search for `MAILERLITE` in your codebase to ensure it only appears in environment variable references.

## **If All Clear:**
You are safe to make your repository public!

## **Summary:**  
- Your current setup is secure for a public repo, as long as secrets are only in Vercel environment variables and not in the code or committed files.

If you want, I can give you a command to scan your repo for secrets, or you can let me know if you want a more thorough check! 