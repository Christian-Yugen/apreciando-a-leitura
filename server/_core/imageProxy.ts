import type { Express, Request, Response as ExpressResponse } from "express";
import { lookup } from "node:dns/promises";
import net from "node:net";

const ALLOWED_IMAGE_HOSTS = new Set([
  "blogger.googleusercontent.com",
  "lh3.googleusercontent.com",
  "images-na.ssl-images-amazon.com",
  "m.media-amazon.com",
]);

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 3;

function isPrivateAddress(address: string): boolean {
  if (net.isIPv4(address)) {
    const [a, b] = address.split(".").map(Number);
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      a >= 224
    );
  }

  if (net.isIPv6(address)) {
    const normalized = address.toLowerCase();
    return (
      normalized === "::" ||
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe8") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb") ||
      normalized.startsWith("::ffff:127.") ||
      normalized.startsWith("::ffff:10.") ||
      normalized.startsWith("::ffff:192.168.")
    );
  }

  return true;
}

async function validateImageUrl(value: string): Promise<URL> {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("INVALID_URL");
  }

  if (url.protocol !== "https:") throw new Error("INVALID_PROTOCOL");
  if (url.username || url.password) throw new Error("INVALID_URL");
  if (!ALLOWED_IMAGE_HOSTS.has(url.hostname.toLowerCase())) {
    throw new Error("HOST_NOT_ALLOWED");
  }

  const addresses = await lookup(url.hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("PRIVATE_ADDRESS");
  }

  return url;
}

async function fetchAllowedImage(initialUrl: URL, signal: AbortSignal): Promise<globalThis.Response> {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      signal,
      headers: {
        Accept: "image/avif,image/webp,image/png,image/jpeg,image/gif",
        "User-Agent": "ApreciandoALeitura-ImageProxy/1.0",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirectCount === MAX_REDIRECTS) {
        throw new Error("TOO_MANY_REDIRECTS");
      }

      currentUrl = await validateImageUrl(new URL(location, currentUrl).toString());
      continue;
    }

    return response;
  }

  throw new Error("TOO_MANY_REDIRECTS");
}

async function imageProxyHandler(req: Request, res: ExpressResponse): Promise<void> {
  const rawUrl = req.query.url;
  if (typeof rawUrl !== "string" || rawUrl.length > 4096) {
    res.status(400).json({ error: "URL de imagem inválida." });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const imageUrl = await validateImageUrl(rawUrl);
    const upstream = await fetchAllowedImage(imageUrl, controller.signal);

    if (!upstream.ok) {
      res.status(502).json({ error: `A origem respondeu com status ${upstream.status}.` });
      return;
    }

    const contentType = upstream.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
    if (!contentType || !ALLOWED_IMAGE_TYPES.has(contentType)) {
      res.status(415).json({ error: "A origem não retornou uma imagem compatível." });
      return;
    }

    const declaredSize = Number(upstream.headers.get("content-length"));
    if (Number.isFinite(declaredSize) && declaredSize > MAX_IMAGE_BYTES) {
      res.status(413).json({ error: "A imagem excede o limite de 8 MB." });
      return;
    }

    if (!upstream.body) {
      res.status(502).json({ error: "A origem retornou uma resposta vazia." });
      return;
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_IMAGE_BYTES) {
        await reader.cancel();
        controller.abort();
        res.status(413).json({ error: "A imagem excede o limite de 8 MB." });
        return;
      }
      chunks.push(value);
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", totalBytes.toString());
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.status(200).send(Buffer.concat(chunks));
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (message === "HOST_NOT_ALLOWED" || message === "PRIVATE_ADDRESS") {
      res.status(403).json({ error: "Host de imagem não autorizado." });
    } else if (controller.signal.aborted) {
      res.status(504).json({ error: "Tempo limite excedido ao carregar a imagem." });
    } else if (["INVALID_URL", "INVALID_PROTOCOL"].includes(message)) {
      res.status(400).json({ error: "URL de imagem inválida." });
    } else if (message === "TOO_MANY_REDIRECTS") {
      res.status(502).json({ error: "A origem excedeu o limite de redirecionamentos." });
    } else {
      res.status(502).json({ error: "Não foi possível carregar a imagem." });
    }
  } finally {
    clearTimeout(timeout);
  }
}

export function registerImageProxy(app: Express): void {
  app.get("/api/image-proxy", (req, res) => {
    void imageProxyHandler(req, res);
  });
}
