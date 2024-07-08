export const config = {
  runtime: 'edge',
};

export const GET = async (request: Request): Promise<Response> => {
  const url = new URL(request.url)
  const name = url.searchParams.get("name")

  if (!name) {
    return new Response("Missing 'name' parameter", { status: 400 })
  }

  const data = await loadData()

  const hex = data[name]

  if (!hex) {
    return new Response("Hex not found", { status: 404 })
  }

  return new Response(hex, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Cache": "max-age=3600, stale-while-revalidate=86400, stale-if-error=604800",
    },
  })
}

const loadData = async () => {
  console.time("Fetching data")

  const response = await fetch(
    "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/_data/simple-icons.json",
    {
      method: "GET",
      cache: "force-cache",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  console.timeEnd("Fetching data")

  const data = await response.json() as { icons: Icon[] }

  return data.icons.reduce((acc, icon) => {
    acc[icon.title] = icon.hex
    return acc
  }, {} as Record<string, string>)
}

type Icon = {
  title: string;
  hex: string;
  source: string;
  guidelines: string;
}
