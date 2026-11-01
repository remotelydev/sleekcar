import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { getStore } from "@netlify/blobs";

/**
 * Small key/value store for the owner panel: upload chunks, job state, rate limits and the
 * TikTok token. On Netlify it uses Netlify Blobs. Outside Netlify (local `next dev`) it falls
 * back to a folder in the OS temp dir, but never in production, so a missing Blobs context
 * fails loudly instead of silently writing to an ephemeral disk.
 */
export type PanelStore = {
  getJSON<T>(key: string): Promise<T | null>;
  setJSON(key: string, value: unknown): Promise<void>;
  getBytes(key: string): Promise<Uint8Array<ArrayBuffer> | null>;
  setBytes(key: string, value: Uint8Array): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
};

const STORE_NAME = "owner-panel";

function netlifyStore(): PanelStore | null {
  try {
    const store = getStore({ name: STORE_NAME, consistency: "strong" });

    return {
      async getJSON<T>(key: string) {
        return ((await store.get(key, { type: "json" })) as T | null) ?? null;
      },
      async setJSON(key, value) {
        await store.setJSON(key, value);
      },
      async getBytes(key) {
        const value = await store.get(key, { type: "arrayBuffer" });
        return value ? new Uint8Array(value) : null;
      },
      async setBytes(key, value) {
        await store.set(key, value.slice().buffer);
      },
      async delete(key) {
        await store.delete(key);
      },
      async list(prefix) {
        const { blobs } = await store.list({ prefix });
        return blobs.map((blob) => blob.key);
      }
    };
  } catch (error) {
    if (process.env.NODE_ENV === "production" && process.env.PANEL_STORAGE !== "fs") {
      throw error;
    }

    return null;
  }
}

function fileStore(): PanelStore {
  const root = path.join(os.tmpdir(), "sleekcar-owner-panel");
  const filePath = (key: string) =>
    path.join(root, ...key.split("/").map((part) => encodeURIComponent(part)));

  async function read(key: string) {
    try {
      return await fs.readFile(filePath(key));
    } catch {
      return null;
    }
  }

  async function write(key: string, data: Uint8Array | string) {
    const target = filePath(key);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, data);
  }

  return {
    async getJSON<T>(key: string) {
      const data = await read(key);
      return data ? (JSON.parse(data.toString("utf8")) as T) : null;
    },
    setJSON: (key, value) => write(key, JSON.stringify(value)),
    async getBytes(key) {
      const data = await read(key);
      return data ? new Uint8Array(data) : null;
    },
    setBytes: (key, value) => write(key, value),
    async delete(key) {
      await fs.rm(filePath(key), { force: true });
    },
    async list(prefix) {
      const keys: string[] = [];

      async function walk(dir: string, parts: string[]) {
        let entries: import("fs").Dirent[] = [];
        try {
          entries = await fs.readdir(dir, { withFileTypes: true });
        } catch {
          return;
        }
        for (const entry of entries) {
          const next = [...parts, decodeURIComponent(entry.name)];
          if (entry.isDirectory()) {
            await walk(path.join(dir, entry.name), next);
          } else {
            keys.push(next.join("/"));
          }
        }
      }

      await walk(root, []);
      return keys.filter((key) => key.startsWith(prefix));
    }
  };
}

// Netlify injects the Blobs credentials per invocation, so the store is created per call.
export function panelStore(): PanelStore {
  return netlifyStore() ?? fileStore();
}
