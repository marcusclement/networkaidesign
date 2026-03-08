# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Sending Apply Now form responses to your email (free)

The Membership "Apply Now" form uses [Web3Forms](https://web3forms.com) (free tier: 250 submissions/month, resume attachments supported).

1. Go to [web3forms.com](https://web3forms.com) and create an account.
2. Create a new form and **verify the email** where you want to receive applications.
3. Copy your **Access Key** and add it to a `.env` file in the project root:
   ```bash
   cp .env.example .env
   # Edit .env and set: VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
   ```
4. Restart the dev server (`npm run dev`). For production (e.g. Vercel), add `VITE_WEB3FORMS_ACCESS_KEY` in **Project Settings → Environment Variables** (enable for Production). **Important:** Vite bakes env vars at build time, so trigger a **new deploy** after adding the variable (or the built app won’t have the key). In Vercel, redeploy from the Deployments tab.

Submissions (including resume files) will be sent to your verified email. In Web3Forms dashboard, ensure the form’s email is **verified** (check your inbox for their verification link).

**Form shows success but no email / no submission in dashboard?** Web3Forms blocks some free hosting domains (including `*.vercel.app`). They may still return “success” to the browser but not deliver. Fix: [Contact Web3Forms](https://web3forms.com/contact) and ask them to approve your deployment URL (e.g. `yourproject.vercel.app`) or your custom domain. Alternatively, add a custom domain in Vercel and ask Web3Forms to whitelist that domain.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
