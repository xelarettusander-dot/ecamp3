import { NextResponse } from 'next/server'
import { APP_HOSTNAME, PROTECTED_HOSTNAMES } from '@/lib/modules/registry'

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: 'jungschar-platform',
    hostname: APP_HOSTNAME,
    protectedHostnames: PROTECTED_HOSTNAMES,
    timestamp: new Date().toISOString(),
  })
}
