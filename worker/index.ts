export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/db") {
      const { results } = await env.DB.prepare("SELECT * FROM notas").all();
      return Response.json({ notas: results });
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json({
        name: "Cloudflare",
        message: "Hola desde un Cloudflare Worker!",
        time: new Date().toISOString(),
      });
    }

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;