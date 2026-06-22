# Wealth Manager — Frontend (مدیریت سرمایه)

رابط کاربری وب سیستم مدیریت سرمایه. این ریپو **فقط مصرف‌کننده‌ی API بک‌اند** است:
سود/زیان، FIFO، ارزش خالص، XIRR/TWR و تبدیل ارز همه در بک‌اند محاسبه شده‌اند و فرانت
این اعداد را فقط **نمایش** می‌دهد. تنها محاسبه‌ی مجاز، فرمت عدد و تبدیل نمایشی تاریخ به
شمسی است.

**Stack:** React 18 · TypeScript · Vite · MUI v6 (RTL) · TanStack Query · React Hook Form + Zod · Recharts · decimal.js · dayjs (+ Jalali).

قواعد قطعی در `CLAUDE.frontend.md` و قرارداد API (مرجع خواندنی) در `API_CONTRACT.md`.
منبع حقیقت اجرایی قرارداد، فایل `openapi.json` بک‌اند است که در ریشه‌ی این ریپو vendor شده.

> **وضعیت:** زیرفاز **۶a** (اسکلت، لایه‌ی API تایپ‌دار، احراز هویت، پوسته‌ی RTL، سوییچ ارز) پیاده شده است.
> زیرفازهای بعد: ۶b داده‌ی پایه (حساب/دارایی/قیمت/تراکنش/موجودی)، ۶c بدهی و اهداف، ۶d داشبورد و گزارش‌ها.

---

## پیش‌نیازها

- Node.js 20+ و npm 10+
- بک‌اند در حال اجرا (پیش‌فرض روی `http://localhost:8000`) — راه‌اندازی در README ریپوی بک‌اند.

## راه‌اندازی سریع

```bash
# ۱) نصب وابستگی‌ها
npm install

# ۲) پیکربندی (اختیاری؛ پیش‌فرض‌ها برای توسعه‌ی محلی کار می‌کنند)
cp .env.example .env.local

# ۳) تولید کلاینت و schemaهای اعتبارسنجی از روی قرارداد بک‌اند
npm run gen:api

# ۴) اجرای حالت توسعه
npm run dev          # روی http://localhost:5173
```

در حالت توسعه، درخواست‌های `/api` به‌صورت proxy به بک‌اند فرستاده می‌شوند
(آدرس از `VITE_API_PROXY_TARGET` در `vite.config.ts`، پیش‌فرض `http://localhost:8000`).

## پیکربندی محیط

| متغیر | پیش‌فرض | توضیح |
|---|---|---|
| `VITE_API_BASE_URL` | خالی (same-origin) | پایه‌ی آدرس API؛ در dev خالی بماند تا proxy عمل کند |
| `VITE_API_PROXY_TARGET` | `http://localhost:8000` | مقصد proxy حالت توسعه |

## لایه‌ی API و تایپ‌ها (مهم)

تایپ‌ها و اعتبارسنجی **دستی نوشته نمی‌شوند**؛ از `openapi.json` تولید می‌شوند:

```bash
npm run gen:api
```

این اسکریپت دو خروجی می‌سازد:

1. `openapi-typescript` → `src/api/generated/schema.ts` (تایپ‌های کلاینت برای `openapi-fetch`).
2. `orval` در حالت `zod` → `src/api/generated/zod.ts` (schemaهای اعتبارسنجی فرم، بیت‌به‌بیت مطابق بک‌اند تا کاربر خطای ۴۲۲ غیرمنتظره نگیرد).

### به‌روزرسانی قرارداد پس از تغییر بک‌اند

```bash
# در ریپوی بک‌اند: python scripts/export_openapi.py
cp ../capital_management/openapi.json ./openapi.json
npm run gen:api
npm run typecheck      # خطاهای TypeScript، نقاط ناهماهنگی با قرارداد جدید را نشان می‌دهند
```

## اسکریپت‌ها

| دستور | کار |
|---|---|
| `npm run dev` | سرور توسعه (Vite) |
| `npm run build` | typecheck (`tsc -b`) + بیلد production |
| `npm run preview` | پیش‌نمایش بیلد |
| `npm run typecheck` | بررسی نوع بدون خروجی |
| `npm run lint` | ESLint |
| `npm run gen:api` | تولید تایپ‌ها و zod از `openapi.json` |

## قواعد کلیدی

- **هیچ منطق مالی در فرانت بازتولید نمی‌شود.** هر عدد از API می‌آید.
- **سوییچ ارز سراسری فقط نمایشی است:** جایی که قرارداد `?currency` دارد (`reports/net-worth`,
  `reports/allocation`) آن را پاس می‌دهد؛ جای دیگر فقط فیلدِ ازقبل‌محاسبه‌شده‌ی همان ارز
  (`value_irr` / `value_usd`) را انتخاب می‌کند. **هرگز تبدیل یا جمعِ سمت کلاینت انجام نمی‌شود.**
- **پول:** مقادیر پولی رشته‌ی Decimal‌اند؛ برای فرمت نمایشی از `decimal.js` استفاده می‌شود، نه `Number`/`parseFloat`.
- **تاریخ:** نمایش و انتخاب **شمسی**؛ اما پیش از ارسال به API به ISO/میلادی تبدیل می‌شود (`src/lib/jalali.ts`).
- **RTL/فارسی:** چیدمان کامل RTL با MUI + فونت Vazirmatn.
- **احراز هویت:** JWT در هر درخواست تزریق می‌شود؛ روی ۴۰۱ توکن پاک و به `/login` هدایت می‌شود.

## ساختار پروژه

```
src/
  api/
    generated/   # خروجی gen:api (دست‌نخورده): schema.ts, zod.ts
    client.ts    # کلاینت openapi-fetch + interceptor احراز هویت و ۴۰۱
    queryClient.ts
    tokenStore.ts
  context/       # AuthContext، CurrencyContext (سوییچ ارز نمایشی)
  hooks/         # hookهای React Query
  features/      # auth, dashboard, ... (هر بخش)
  components/    # layout (پوسته‌ی RTL، سوییچ ارز) و common (loading/error/empty)
  lib/           # format (decimal.js)، jalali، theme/rtlCache
  routes/        # router و guardها
```

## بیلد و کیفیت

```bash
npm run typecheck && npm run lint && npm run build
```
هر سه باید سبز باشند. خروجی بیلد در `dist/`.
