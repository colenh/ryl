export async function verifyTurnstile(token: string): Promise<boolean> {
  try {
    const res = await fetch("/api/verify-turnstile", {
      body: JSON.stringify({ token }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    return res.ok;
  } catch {
    return false;
  }
}
