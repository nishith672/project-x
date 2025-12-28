# Portfolio Website

A modern, responsive portfolio website with 3D animations and a functional contact form.

## 🌐 Live Demo

- **Frontend**: https://nishith672.github.io/project-x/
- **Backend API**: Deploy to Vercel (see instructions below)

## 🚀 Deployment

### Frontend (GitHub Pages)
Already deployed at: https://nishith672.github.io/project-x/

To update:
```bash
npm run build
cd dist
git add -A
git commit -m "Update website"
git push -f https://github.com/nishith672/project-x.git gh-pages
cd ..
```

### Backend (Vercel)

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your repository: `nishith672/project-x`
   - Vercel will auto-detect the configuration
   - Click "Deploy"

3. **Configure Environment Variables** in Vercel Dashboard:
   - `EMAIL_HOST` - Your email SMTP host (e.g., smtp.gmail.com)
   - `EMAIL_PORT` - SMTP port (e.g., 587)
   - `EMAIL_USER` - Your email address
   - `EMAIL_PASS` - Your email password or app-specific password

4. **Update Frontend API URL** (if needed):
   - If Vercel gives you a different domain, update the fetch URL in `src/main.js`
   - The current setup uses relative URLs which work automatically

## 📧 Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password as `EMAIL_PASS`

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server (frontend + backend)
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
├── api/              # Vercel serverless functions
│   └── contact.js    # Contact form API endpoint
├── src/              # Frontend source files
├── public/           # Static assets
├── dist/             # Built files (auto-generated)
├── server.js         # Local development server
├── vercel.json       # Vercel configuration
└── vite.config.js    # Vite configuration
```

## 🔧 Technologies

- **Frontend**: HTML, CSS, JavaScript, Three.js
- **Build Tool**: Vite
- **Backend**: Node.js, Express (local), Vercel Serverless (production)
- **Email**: Nodemailer
- **Hosting**: GitHub Pages (frontend), Vercel (backend)
