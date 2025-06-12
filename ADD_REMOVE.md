# How to Add Menu Items and Use the Dashboard

## Adding Menu Items to Supabase

1. **Go to Supabase Dashboard**
   - Open your project at [https://app.supabase.com/](https://app.supabase.com/)

2. **Navigate to the Table Editor**
   - In the left sidebar, click on `Table Editor`.
   - Select the `menu_items` table.

3. **Add Menu Items Manually**
   - Click the `+ Insert Row` button.
   - Fill in the following fields:
     - `category`: (e.g., "AWEVOS Benedict")
     - `name`: (e.g., "Benedict del Génesis")
     - `co2_saved`: (e.g., 1.04)
     - `water_saved`: (e.g., 835)
     - `land_saved`: (e.g., 0.68)
   - Leave `id`, `created_at`, and `updated_at` blank (they will be set automatically).
   - Click `Save`.

4. **Bulk Import via CSV**
   - Prepare a CSV file with the following headers:
     ```
     category,name,co2_saved,water_saved,land_saved
     ```
   - Go to the `menu_items` table in Supabase.
   - Click `Import Data` and upload your CSV file.
   - Make sure there are no duplicate IDs or missing columns.

---

## Using the Dashboard

1. **Access the Dashboard**
   - Open the web app in your browser (e.g., `http://localhost:5173` or your deployed URL).

2. **View Menu Items**
   - The dashboard displays all menu items from the database.
   - You can see each item's category, name, and sustainability metrics (CO₂ saved, water saved, land saved).

3. **Sustainability Metrics**
   - The dashboard shows total CO₂, water, and land saved, calculated from all menu items.
   - These metrics update automatically as you add or edit menu items in Supabase.

4. **Admin Features**
   - (If enabled) You can add, edit, or delete menu items directly from the dashboard.
   - Changes are reflected in real time.

---

**Tip:**
- Always double-check your data for accuracy.
- For any issues, contact the development team or check the project README for troubleshooting. 