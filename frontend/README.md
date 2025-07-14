# Setup

## 1. Clone the repository

```bash
git clone git@github.com:your-org/your-repo.git
cd your-repo
```

## 2. Copy & configure your environment file

```bash
cp .env.example .env
# then open .env in your editor and set:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# other vars…
```

## 3. Install dependencies

```bash
npm install
```

This will pull down all the packages listed in `package.json`.

## 4. Start the development server

```bash
npm run dev
```

By default the app will launch at [http://localhost:3000](http://localhost:3000).

---

### Commands

- **Type-checking & linting:**

  ```bash
  npm run lint
  npm run typecheck
  ```

- **Building for production:**

  ```bash
  npm run build
  ```

- **Previewing the production build locally:**

  ```bash
  npm run start
  ```
