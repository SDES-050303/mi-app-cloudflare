export default {
  fetch(request) {
    const url = new URL(request.url);

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
