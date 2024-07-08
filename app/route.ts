export const runtime = "edge"

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
      "Content-Cache": "max-age=3600, stale-while-revalidate=86400, stale-if-error=604800, immutable",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  })
}

export const OPTIONS = (request: Request): Response => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  })
}

const loadData = async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/_data/simple-icons.json",
    {
      method: "GET",
      // cache: "force-cache",
      next: { revalidate: 86400 }, // Cache for 24 hours
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  type Icon = {
    title: string;
    hex: string;
    source: string;
    guidelines: string;
  }

  const data = await response.json() as { icons: Icon[] }

  return data.icons.reduce((acc, icon) => {
    acc[icon.title] = icon.hex
    return acc
  }, {} as Record<string, string>)
}


