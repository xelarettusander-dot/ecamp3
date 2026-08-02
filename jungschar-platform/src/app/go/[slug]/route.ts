import { NextResponse } from 'next/server'
import { getModuleBySlug } from '@/lib/modules/registry'

async function isReachable(url: string): Promise<boolean> {
  try {
    const parsed = new URL(url)
    // Only probe loopback/local vendor URLs — public hosts are assumed live.
    const local =
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === 'localhost' ||
      parsed.hostname.endsWith('.local')
    if (!local) return true

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 1500)
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
    })
    clearTimeout(timer)
    return response.status > 0 && response.status < 500
  } catch {
    return false
  }
}

/**
 * Hard navigation into a module app (no iframe).
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  const platformModule = getModuleBySlug(slug)

  if (!platformModule?.appUrl) {
    return NextResponse.redirect(new URL(`/modules/${slug}?embed=1`, request.url))
  }

  const ok = await isReachable(platformModule.appUrl)
  if (!ok) {
    return NextResponse.redirect(
      new URL(`/modules/${slug}?embed=1&offline=1`, request.url)
    )
  }

  return NextResponse.redirect(platformModule.appUrl, { status: 302 })
}
