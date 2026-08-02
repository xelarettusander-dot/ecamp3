import { notFound } from 'next/navigation'
import { ModuleWorkspace } from '@/components/ModuleWorkspace'
import { SiteHeader } from '@/components/SiteHeader'
import { getCurrentUser } from '@/lib/auth/current-user'
import { getModuleBySlug, MODULES } from '@/lib/modules/registry'

export function generateStaticParams() {
  return MODULES.map((module) => ({ slug: module.slug }))
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const platformModule = getModuleBySlug(slug)
  if (!platformModule) notFound()

  const user = await getCurrentUser()

  return (
    <div className="min-h-screen">
      <SiteHeader email={user?.email ?? null} />
      <ModuleWorkspace platformModule={platformModule} />
    </div>
  )
}
