export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include", // important for cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}
