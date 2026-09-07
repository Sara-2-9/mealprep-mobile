const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function getHostname(uri?: string | null) {
  if (!uri) return null;
  try {
    return new URL(uri.includes("://") ? uri : `http://${uri}`).hostname;
  } catch {
    return null;
  }
}

export function resolveApiBaseUrl(configuredUrl: string, developmentHost?: string | null) {
  try {
    const apiUrl = new URL(configuredUrl);
    if (!LOCAL_HOSTS.has(apiUrl.hostname)) return configuredUrl;

    const metroHostname = getHostname(developmentHost);
    if (!metroHostname || LOCAL_HOSTS.has(metroHostname) || metroHostname.endsWith(".exp.direct")) {
      return configuredUrl;
    }

    apiUrl.hostname = metroHostname;
    return apiUrl.toString().replace(/\/$/, "");
  } catch {
    return configuredUrl;
  }
}
