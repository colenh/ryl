interface Env {
  TURNSTILE_SECRET_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/verify-turnstile") {
      let token: string | undefined;
      try {
        const body = (await request.json()) as { token?: string };
        ({ token } = body);
      } catch {
        return Response.json({ success: false }, { status: 400 });
      }
      if (!token) {
        return Response.json({ success: false }, { status: 400 });
      }

      const res = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          body: JSON.stringify({
            response: token,
            secret: env.TURNSTILE_SECRET_KEY,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        }
      );
      const data = (await res.json()) as { success: boolean };
      return Response.json(
        { success: data.success },
        { status: data.success ? 200 : 400 }
      );
    }

    return new Response(null, { status: 404 });
  },
};
