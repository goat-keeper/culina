# Culina — Universal Recipe App 🍳

Culina is a premium, modern recipe sharing application built with **React Native**, **Expo Router (v57)**, and **Supabase**. The app features a warm, visually striking cream-and-orange theme, modular components, and native-feeling animations and transitions.

---

## 🚀 Key Features

### 1. Onboarding & Identity (`/(auth)`)
- Custom user profile creation page featuring camera/photo library integration.
- Full Name and Username setup with automatic unique username availability check.
- Custom state management using a lightweight Zustand store.

### 2. Main Feed (`/(tabs)/index.tsx`)
- Scrollable horizontal category list matching database constraints (Chicken, Beef, Fish, Vegetable, Dessert, Snack, Drink, Soup, Salad).
- Feed of recipe cards with dynamic data, including recipe title, category, difficulty, step count, and author name/avatar.
- Clickable touch action redirecting seamlessly to the detailed recipe page.
- Integrated pull-to-refresh and empty states.

### 3. Create Recipe Screen (`/(tabs)/create.tsx`)
- High-quality cover photo picker (supports gallery selection and camera capture).
- Rich details form (Title, Description, Category, and Difficulty selectors).
- **Interactive Step Editor**: Add, edit, or delete instruction steps. Each step supports instruction text, an optional timer (minutes), and helpful chef tips.
- Direct upload to Supabase's `recipe` storage bucket and row insertion validation.

### 4. Recipe Detail Page (`/recipe/[id].tsx`)
- Immersive visual banner overlay showing title, description, and category.
- **Computed Prep Time**: Automatically sums the individual timers across all steps.
- Author metadata display showing the recipe contributor.
- Modular instruction cards rendering detailed procedures, step durations, and highlights.

### 5. Profile & Edit Profile (`/(tabs)/profile.tsx` & `/profiles/index.tsx`)
- View contributed recipes in a custom user list with dynamic stats.
- Edit profile details including avatar image (gallery/camera) and handle with duplicate validation.

---

## 🛠️ Technology Stack

- **Framework**: [Expo](https://expo.dev) (v57.0.0 SDK)
- **Navigation**: Expo Router (file-based routing)
- **Database & Auth**: [Supabase](https://supabase.com)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: Expo Vector Icons (Ionicons)
- **Styling**: Vanilla CSS-in-JS (StyleSheet)
- **Image handling**: `expo-image-picker` & `expo-image`

---

## 📂 Project Directory Structure

```
c:\Users\Admin\Desktop\project\recipeapp\
├── design/                   # Reference UI design screens
├── src/
│   ├── app/                  # File-based navigation routes
│   │   ├── (auth)/           # Authentication and onboarding screens
│   │   ├── (tabs)/           # Tab navigation pages (Home, Create, Profile)
│   │   ├── profiles/         # Profile details & editing screen
│   │   ├── recipe/           # Dynamic recipe detail screen
│   │   └── _layout.tsx       # Root layout router setup
│   ├── components/           # Reusable UI component layer
│   │   ├── create/           # Form inputs & step editors
│   │   ├── main/             # Category selectors & main card feeds
│   │   └── profile/          # Profile headers & avatar editors
│   ├── hooks/                # Custom React Hooks for query actions
│   │   ├── useRecipeDetail.ts
│   │   ├── useRecipes.ts
│   │   └── useProfileRecipes.ts
│   ├── lib/                  # Library bindings & helpers (Supabase)
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── storage.ts
│   └── stores/               # Zustand global store configuration
│       └── useAuthStore.ts
```

---

## 🗄️ Database Schema & Storage Configuration

### SQL Schema

```sql
create table public.recipes (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    title text not null,

    description text,

    image_url text not null,

    category text not null
        check (
            category in (
                'Chicken',
                'Beef',
                'Fish',
                'Vegetable',
                'Dessert',
                'Snack',
                'Drink',
                'Soup',
                'Salad'
            )
        ),

    difficulty text not null
        check (
            difficulty in (
                'Easy',
                'Medium',
                'Hard'
            )
        ),

    steps jsonb not null default '[]'::jsonb,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()
);
```

### Storage Buckets
Ensure the following public storage buckets are created in your Supabase dashboard:
1. `profiles`: For user profile/avatar pictures.
2. `recipe`: For recipe cover photos.

---

## ⚙️ Getting Started

### 1. Install Dependencies
Run the following command at the project root to fetch node dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file at the root containing your Supabase details:
```env
EXPO_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

### 3. Run the Development Server
Launch the Expo package packager:
```bash
npx expo start
```
You can press `a` to run on Android, `i` to run on iOS simulators, or scan the QR code to open on physical devices using the **Expo Go** application.

---

## 🎨 Design Theme & Styling Guidelines
The application uses a curated premium palette:
- **Background Cream**: `#FDF6EC`
- **Main Orange**: `#F97B22`
- **Gradient Transition Accent**: `#F5A623`
- **Primary Text**: `#2B1A12`
- **Secondary Gray**: `#8A7466`
- **Border / Outline Tone**: `#EED9C7`
- **Card Background**: `#FFF9F2`
