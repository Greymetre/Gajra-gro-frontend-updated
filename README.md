# FieldKonnect Frontend

This is a Next.js 13 admin frontend for the FieldKonnect/GajraGro project. It uses React 18, Redux, Bootstrap, Material UI, and Axios.

## Requirements

- macOS terminal with `zsh`
- Homebrew
- Node.js `18.15.0`
- npm
- Backend API running locally or access to the live API

The project was built around Node 18. Using newer Node versions, such as Node 26, may cause install or runtime issues.

## Install Node 18 Using Homebrew and nvm

If `nvm` is not available, install it with Homebrew:

```bash
brew install nvm
```

Create the nvm directory in your home folder:

```bash
mkdir ~/.nvm
```

Add these lines near the top of `~/.zshrc`:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix nvm)/nvm.sh" ] && source "$(brew --prefix nvm)/nvm.sh"
[ -s "$(brew --prefix nvm)/etc/bash_completion.d/nvm" ] && source "$(brew --prefix nvm)/etc/bash_completion.d/nvm"
```

Reload the terminal config:

```bash
source ~/.zshrc
```

If `nvm` still does not load in the current terminal, run this manually:

```bash
export NVM_DIR="$HOME/.nvm"
source "$(brew --prefix nvm)/nvm.sh"
```

Install and use Node 18:

```bash
nvm install 18.15.0
nvm use 18.15.0
node -v
```

Expected output:

```bash
v18.15.0
```

## Project Setup

Go to the project folder:

```bash
cd /Users/apple/Documents/gajraGro/gajra_next_live
```

Make sure Node 18 is active:

```bash
nvm use 18.15.0
node -v
```

Install dependencies:

```bash
npm install
```

Use `npm install` instead of `npm ci` because the current `package.json` and `package-lock.json` may not be fully in sync.

## API Setup

The frontend API base URL is configured in:

```text
helpers/api_helper.js
```

By default, it points to a local backend:

```js
const API_URL = "http://localhost:4000/api"
```

So before using data pages, make sure the backend project is running on:

```text
http://localhost:4000
```

If you want to use the live API instead, update the same line to:

```js
const API_URL = "https://apis.fieldkonnect.io/api"
```

Image assets use this default URL:

```text
https://s3.ap-south-1.amazonaws.com/gajragro2.fieldkonnect.io/
```

This value is defined in:

```text
utils/constant.ts
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

Login pages:

```text
http://localhost:3000/
http://localhost:3000/login
```

After login, the app redirects to:

```text
http://localhost:3000/dashboard
```

## Available Scripts

```bash
npm run dev
```

Runs the Next.js development server.

```bash
npm run build
```

Builds and exports the project using `next build && next export`.

```bash
npm run start
```

Starts the Next.js production server. Use this after a production build when applicable.

```bash
npm run lint
```

Runs Next.js linting.

## Project Flow

- `pages/_app.tsx` wraps the whole app with Redux and global styles.
- `pages/index.tsx` and `pages/login/index.tsx` contain login screens.
- Login stores `authToken` and `authInfo` in browser `localStorage`.
- Auth helpers are in `helpers/authHelper.tsx`.
- Axios API setup is in `helpers/api_helper.js`.
- API endpoint paths are in `helpers/url_helper.js`.
- Combined backend helper methods are in `helpers/backend_helper.js`.
- Main authenticated layout is in `components/Layout/index.tsx`.
- Non-auth layout is in `components/Layout/NonAuthLayout.tsx`.
- Redux store setup is in `store/index.tsx` and `store/reducers.tsx`.

## Common Issues

### `zsh: command not found: nvm`

Run:

```bash
export NVM_DIR="$HOME/.nvm"
source "$(brew --prefix nvm)/nvm.sh"
```

Then check:

```bash
nvm --version
```

### `npm ci` package lock error

Use:

```bash
npm install
```

### App opens but data does not load

Check that the backend API is running on:

```text
http://localhost:4000
```

or switch `API_URL` in `helpers/api_helper.js` to the live API.

### Java Runtime warning after `source ~/.zshrc`

This warning comes from another Java or Android-related shell setting. It is not required for this Next.js frontend.
