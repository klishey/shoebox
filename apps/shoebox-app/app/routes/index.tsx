import { createFileRoute } from '@tanstack/react-router'

// path is inferred from file location by TanStack Router codegen
// @ts-expect-error routeTree.gen.ts will be generated on first `vinxi dev`
export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-2xl font-bold">Shoebox — coming soon</p>
    </main>
  )
}
