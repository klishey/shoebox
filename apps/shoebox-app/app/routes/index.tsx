import { createFileRoute } from '@tanstack/react-router'

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
