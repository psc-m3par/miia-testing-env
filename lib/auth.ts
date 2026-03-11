export function getUserIdFromRequest(req: Request): string | null {
  const url = new URL(req.url);
  return url.searchParams.get('userId');
}
