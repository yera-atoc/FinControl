# FinCtrl

Личный трекер финансов, клиентов и задач. Next.js 14 (App Router) + Supabase (Auth + Postgres + RLS) + Tailwind CSS.

## Что внутри

- **Обзор** — баланс за неделю/месяц/год, динамика за 6 месяцев, расходы по категориям, доход по клиентам
- **Операции** — доход/расход с датой (можно задним числом), категорией или клиентом
- **Клиенты** — новые / завершённые, с полем «Результат» и «Сколько заплатили»
- **Задачи** — с уведомлением о просроченных, задачах на завтра и на неделю
- Полноценный логин (email + пароль) и данные, привязанные к пользователю через Row Level Security — то есть проект уже готов к тому, чтобы им пользовалось много разных людей одновременно

## 1. Создать проект в Supabase

1. Зайти на supabase.com → New Project
2. Дождаться создания проекта
3. Открыть SQL Editor → вставить содержимое файла `supabase/schema.sql` → Run
4. Открыть Project Settings → API → скопировать **Project URL** и **anon / publishable key**

## 2. Настроить проект локально

```bash
npm install
cp .env.example .env.local
```

Вписать в `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-ключ
```

```bash
npm run dev
```

Открыть http://localhost:3000 — попадёте на страницу входа, зарегистрируйтесь (письмо с подтверждением придёт на почту, если в Supabase не отключена email-верификация).

## 3. Деплой на Vercel

1. Залить проект в GitHub (создать репозиторий `finctrl`, `git init && git add . && git commit -m "init" && git remote add origin ... && git push`)
2. На vercel.com → Add New Project → выбрать репозиторий
3. В Environment Variables добавить те же `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

После первого деплоя в Supabase → Authentication → URL Configuration стоит прописать реальный домен Vercel (Site URL и Redirect URLs `https://ваш-домен/auth/callback`), иначе письма подтверждения будут вести на localhost.

## Структура

```
app/
  login/            — вход и регистрация
  auth/callback/     — подтверждение email
  dashboard/         — защищённые страницы (обзор, операции, клиенты, задачи)
actions/             — server actions: вся запись в базу идёт через них
lib/supabase/        — клиенты Supabase (browser/server/middleware)
supabase/schema.sql  — таблицы + Row Level Security
```

## Дальше, для продажи другим предпринимателям

- Уведомления пока показываются только внутри приложения — можно подключить Telegram-бота (Supabase Edge Function по расписанию + Telegram Bot API) или email-рассылку
- Сейчас один пользователь = свои данные, изоляция уже работает через RLS, так что можно сразу пускать разных людей
- Для монетизации можно добавить Stripe/Kaspi-подписку и ограничение по тарифу (например, лимит клиентов на бесплатном плане)
