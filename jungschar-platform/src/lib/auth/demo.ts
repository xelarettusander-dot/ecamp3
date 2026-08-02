export const DEMO_COOKIE = 'jg_demo_session'

/** Fixed test account (local demo + seeded in Supabase Auth). */
export const TEST_ACCOUNT = {
  email: 'test@example.com',
  password: 'test12',
  displayName: 'Test User',
} as const

export function isDemoAuthEnabled(): boolean {
  const flag = process.env.DEMO_AUTH_ENABLED?.trim().toLowerCase()
  if (flag === 'false' || flag === '0') return false
  if (flag === 'true' || flag === '1') return true

  // Default on when Supabase is not fully configured yet.
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  return !key || key === 'replace-me' || key === 'placeholder' || key === 'placeholder-anon-key'
}

export function isTestAccount(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === TEST_ACCOUNT.email &&
    password === TEST_ACCOUNT.password
  )
}

export function demoSessionValue(): string {
  return JSON.stringify({
    email: TEST_ACCOUNT.email,
    displayName: TEST_ACCOUNT.displayName,
    kind: 'demo',
  })
}

export function parseDemoSession(
  raw: string | undefined
): { email: string; displayName: string } | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as {
      email?: string
      displayName?: string
      kind?: string
    }
    if (parsed.kind !== 'demo' || parsed.email !== TEST_ACCOUNT.email) return null
    return {
      email: TEST_ACCOUNT.email,
      displayName: parsed.displayName || TEST_ACCOUNT.displayName,
    }
  } catch {
    return null
  }
}
