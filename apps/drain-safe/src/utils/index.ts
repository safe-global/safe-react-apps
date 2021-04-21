export async function fetchJson(url: string): Promise<unknown> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error('Network response was not ok');
  }
  return resp.json();
}
