import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold">prevhut</h1>
      <p>Halaman ini placeholder.</p>
    </main>
  )
}
