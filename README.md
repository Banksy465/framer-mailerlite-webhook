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