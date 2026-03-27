# Required Tools & Installations

Please run the following commands in your terminal (inside the `prime` folder) to install the dependencies we need for Phase 1. 

**Note**: Because you are using the very latest Next.js 16 and React 19, if you encounter any "peer dependency" errors during installation, you can append `--legacy-peer-deps` to the `npm install` commands.

### 1. Install Supabase Clients
Since we are using Supabase exclusively for both authentication and database access, we install the official libraries (no Prisma needed).
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Initialize shadcn/ui (Premium UI Components)
```bash
npx shadcn@latest init
```
*When prompted by the initializer:*
- Choose default style (`New York` or `Default`)
- Choose your preferred base color (e.g., `Zinc` or `Slate`)
- Accept default paths for global CSS and tailwind.config

### 3. Add the necessary UI components & Icons
```bash
npm install lucide-react
npx shadcn@latest add button card input label form toast avatar
```

---

Once you have run these commands:
1. Create a project in [Supabase](https://supabase.com/).
2. Get your Supabase **Project URL** and **Anon Key** (Project Settings -> API).
3. Create a `.env.local` file in your `prime` folder and add them like this:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Let me know when you've done this, and I'll generate the SQL commands you need to run in your Supabase SQL Editor!
