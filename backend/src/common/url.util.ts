export function normalizeDataServiceUrl(rawUrl?: string): string {
  let url = (rawUrl || "http://localhost:8000").trim();
  if (!url) {
    url = "http://localhost:8000";
  }

  // Prepend protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    if (url.startsWith("localhost") || url.startsWith("127.0.0.1")) {
      url = `http://${url}`;
    } else {
      url = `https://${url}`;
    }
  }

  // Strip trailing slashes and redundant /api path if provided by user
  return url.replace(/\/+$/, "").replace(/\/api\/?$/, "");
}
