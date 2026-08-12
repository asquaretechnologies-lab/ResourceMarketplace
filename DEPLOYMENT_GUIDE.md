# LocalBooking Platform - Vercel & Supabase Deployment Guide

This guide provides step-by-step instructions to host the **LocalBooking Platform**:
1. **Frontend (React + Vite)** -> Deployed to **Vercel**
2. **Database (PostgreSQL)** -> Hosted on **Supabase**
3. **Backend (.NET 9 Web API)** -> Deployed to **Render / Railway / Azure** connected to Supabase

---

## Step 1: Set Up Supabase Database

1. **Create a Supabase Account & Project**:
   - Go to [Supabase](https://supabase.com) and sign in.
   - Click **"New Project"**.
   - Select your organization, set project name to `localbooking-db`, set your database password, and select a region closest to your users (e.g. `ap-south-1` Mumbai).

2. **Execute Database Migration & Seed Data**:
   - In your Supabase Dashboard, go to **SQL Editor** on the left menu.
   - Click **"New query"**.
   - Copy the contents of [`supabase/schema.sql`](file:///d:/Aravind%20RS/ResourceBooking/supabase/schema.sql) and paste into the editor, then click **"Run"**.
   - Next, copy the contents of [`supabase/seed.sql`](file:///d:/Aravind%20RS/ResourceBooking/supabase/seed.sql) into a new query tab and click **"Run"**.
   - Navigate to **Table Editor** to verify that tables (`facilities`, `users`, `parking_areas`, `resources`, `bookings`) are created and populated.

3. **Get Your Database Connection String**:
   - Go to **Project Settings** -> **Database**.
   - Under **Connection string**, select **URI** or **Connection parameters**.
   - Copy your PostgreSQL connection details:
     ```text
     Host: db.[YOUR_PROJECT_REF].supabase.co
     Port: 5432 (or 6543 for Transaction Pooler)
     Database: postgres
     User: postgres (or postgres.[YOUR_PROJECT_REF])
     Password: [YOUR_DATABASE_PASSWORD]
     ```

---

## Step 2: Deploy Backend (.NET 9 Web API)

1. **Update Connection String**:
   - Open [`src/LocalBooking.API/appsettings.Production.json`](file:///d:/Aravind%20RS/ResourceBooking/src/LocalBooking.API/appsettings.Production.json) and replace `YOUR_SUPABASE_PROJECT_REF` and `YOUR_SUPABASE_DB_PASSWORD` with your credentials:
     ```json
     {
       "ConnectionStrings": {
         "DefaultConnection": "Host=db.YOUR_SUPABASE_PROJECT_REF.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_SUPABASE_DB_PASSWORD;SSL Mode=Require;Trust Server Certificate=true;"
       }
     }
     ```

2. **Deploy to Render using Docker**:
   - *Note*: Render does not have the .NET SDK pre-installed natively, so we deploy using **Docker**.
   1. Push your updated code (including the newly generated [`Dockerfile`](file:///d:/Aravind%20RS/ResourceBooking/Dockerfile)) to GitHub.
   2. Log in to [Render](https://render.com) and click **"New +"** -> **"Web Service"**.
   3. Connect your `ResourceBooking` GitHub repository.
   4. Set **Language / Runtime**: Select **`Docker`**.
   5. Set **Root Directory**: Leave blank (or `./`).
   6. Set **Dockerfile Path**: `./Dockerfile`.
   7. Add **Environment Variables**:
      - `ASPNETCORE_ENVIRONMENT` = `Production`
      - `ConnectionStrings__DefaultConnection` = `Host=db.zttfzoyunpcwnoppxttq.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=T#1nkD1ffer@nt;SSL Mode=Require;Trust Server Certificate=true;`
   8. Click **Create Web Service**. Render will build the Docker container and deploy your .NET API! Note down your API service URL (e.g. `https://localbooking-api.onrender.com`).

---

## Step 3: Deploy Frontend (React + Vite) to Vercel

1. **Push Code to GitHub**:
   - Commit all changes and push your repository to GitHub.

2. **Import Project into Vercel**:
   - Log in to [Vercel](https://vercel.com).
   - Click **"Add New..."** -> **"Project"**.
   - Import your `ResourceBooking` GitHub repository.

3. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `web/localbooking-web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables in Vercel**:
   - Under **Environment Variables**, add:
     - `VITE_API_URL` = `https://localbooking-api.onrender.com/api` (your backend service URL)
     - `VITE_SUPABASE_URL` = `https://YOUR_PROJECT_REF.supabase.co` (optional)
     - `VITE_SUPABASE_ANON_KEY` = `YOUR_SUPABASE_ANON_KEY` (optional)

5. **Deploy**:
   - Click **"Deploy"**. Vercel will build and deploy your React app.
   - Routing works out of the box with the included [`vercel.json`](file:///d:/Aravind%20RS/ResourceBooking/web/localbooking-web/vercel.json) configuration!

---

## Step 4: Verification

1. Open your Vercel deployment URL (e.g., `https://localbooking-web.vercel.app`).
2. Search for parking near **Aluva Railway Station** or sports turfs near **Kakkanad**.
3. Verify that facility data loads and booking flow operates seamlessly.
