# Lifetime Fitness Gym production deployment

This application uses Next.js, Vercel, Neon PostgreSQL, and Prisma. Keep local,
E2E, and production environments separate throughout the deployment.

## 1. Create the project repositories

1. Create or select the GitHub repository for the Lifetime Fitness Gym client.
2. Confirm that `.env`, `.env.local`, and other secret-containing environment
   files are ignored and are not tracked.
3. Do not commit production credentials, database URLs, or session secrets.

## 2. Create a new production database

1. Create a new Neon production project/database for Lifetime Fitness Gym.
2. Obtain its production `DATABASE_URL`.
3. Confirm that it is not the old GymFlow database, a local database, or the
   dedicated Playwright E2E database.
4. Configure backups, access controls, and the required production retention
   policy before onboarding users.

## 3. Generate production secrets

Generate a new production session secret locally:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the generated value only in the Vercel Production Environment Variables.
Do not commit it, put it in `.env.example`, or reuse a local or E2E secret.

## 4. Create and configure the Vercel project

1. Create a new Vercel project connected to the Lifetime Fitness Gym GitHub
   repository.
2. Configure the production environment variables:

   ```text
   DATABASE_URL=<the new Lifetime Fitness Gym production database URL>
   SESSION_SECRET=<a new production-only random secret>
   ```

3. Do not configure production with `E2E_DATABASE_URL`, E2E credentials, or
   the local `.env` values.
4. Leave `NODE_ENV` managed by Vercel as `production`.

## 5. Deploy and apply migrations

Deploy the application through Vercel, then apply the committed Prisma
migrations to the confirmed production database:

```powershell
npx prisma migrate deploy
```

Never run these commands against production:

```text
npx prisma migrate dev
npx prisma db push
npx prisma migrate reset
```

Never run the demo seed against production. `prisma/seed.ts` intentionally
refuses to run when `NODE_ENV=production`.

## 6. Create the initial Owner account

Do not create a public owner-creation endpoint and do not place credentials in
source code. Use the approved secure server-side onboarding procedure for the
deployment. If no such procedure has been approved yet, create the first
Owner through a controlled administrative process using a temporary,
unique password, then require the client to change it.

After the initial Owner exists:

1. Sign in as the Owner.
2. Configure the Lifetime Fitness Gym name, logo, currency, timezone, and
   other organization settings.
3. Create Staff accounts from the protected Settings interface.
4. Deliver credentials to staff through a secure channel, never through source
   control or public documentation.

## 7. Configure the domain

1. Add the production domain in Vercel.
2. Configure the required DNS records.
3. Confirm HTTPS is active.
4. Verify that production authentication cookies are marked `HttpOnly`,
   `Secure`, `SameSite=Lax`, and scoped to `/`.

## 8. Production smoke test

Verify all of the following after deployment:

- Login and logout work.
- Invalid credentials do not reveal whether an account exists.
- An inactive user cannot access the dashboard.
- Owner-only Settings and staff-management actions reject Staff users.
- Staff users retain only their intended permissions.
- Organization-scoped records cannot be accessed across organizations.
- Members, plans, subscriptions, payments, attendance, expenses, and reports
  load correctly.
- The Lifetime Fitness Gym logo appears on login, navigation, and loading
  surfaces.
- The Lifetime Fitness Gym favicon and page metadata appear correctly.
- No demo organization or demo credentials exist in the production database.

## 9. Backups and ownership transfer

1. Verify the Neon backup and restore process.
2. Record the production database, Vercel project, domain, and monitoring
   ownership.
3. Transfer ownership to the client through the approved organization process.
4. Remove temporary deployment access and rotate any temporary credentials.

## Environment reference

### Local development

```text
DATABASE_URL=<local development database URL>
SESSION_SECRET=<local-only random secret>
```

Never point local development at the production database.

### Playwright E2E and CI

```text
E2E_DATABASE_URL=<dedicated disposable E2E database URL>
E2E_SESSION_SECRET=<E2E-only secret>
E2E_OWNER_EMAIL=<E2E owner email>
E2E_OWNER_PASSWORD=<E2E owner password>
E2E_STAFF_EMAIL=<E2E staff email>
E2E_STAFF_PASSWORD=<E2E staff password>
```

The CI workflow provisions an isolated PostgreSQL service and applies
migrations to that database only. Never use production credentials for E2E.

### Production

```text
DATABASE_URL=<Lifetime Fitness Gym production database URL>
SESSION_SECRET=<new production-only random secret>
```

Production values must be entered through Vercel Environment Variables and
must not be committed to the repository.
