import { createWriteStream } from "node:fs";
import { access, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { limits, runtimeConfig } from "@/lib/config";
import { ReleaseError } from "@/lib/release/errors";
import type { ReleaseRecord } from "@/lib/release/types";
import { assertReleaseId, containedPath } from "./safe-path";
import type { StorageProvider } from "./storage-provider";

export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly root = runtimeConfig.dataDirectory) {}

  async create(record: ReleaseRecord): Promise<void> {
    const directory = this.releaseDirectory(record.id);
    await mkdir(directory, { recursive: true });
    await this.writeRecord(record.id, record);
  }

  async read(id: string): Promise<ReleaseRecord> {
    try {
      const raw = await readFile(this.statusPath(id), "utf8");
      return JSON.parse(raw) as ReleaseRecord;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        throw new ReleaseError("release_not_found", "Release not found", 404);
      }
      throw error;
    }
  }

  async update(id: string, patch: Partial<ReleaseRecord>): Promise<ReleaseRecord> {
    const current = await this.read(id);
    const next = { ...current, ...patch, id: current.id, updatedAt: new Date().toISOString() };
    await this.writeRecord(id, next);
    return next;
  }

  async saveInput(id: string, source: AsyncIterable<Uint8Array>): Promise<number> {
    await mkdir(this.releaseDirectory(id), { recursive: true });
    let byteCount = 0;
    const limiter = new Transform({
      transform(chunk: Buffer, _encoding, callback) {
        byteCount += chunk.length;
        if (byteCount > limits.maxUploadBytes) {
          callback(new ReleaseError("file_too_large", "Upload exceeds byte limit", 413));
          return;
        }
        callback(null, chunk);
      },
    });

    const inputPath = this.getInputPath(id);
    try {
      await pipeline(Readable.from(source), limiter, createWriteStream(inputPath, { flags: "wx" }));
      return byteCount;
    } catch (error) {
      await rm(inputPath, { force: true });
      throw error;
    }
  }

  getInputPath(id: string): string {
    return containedPath(this.releaseDirectory(id), "input.media");
  }

  getOutputPath(id: string): string {
    return containedPath(this.releaseDirectory(id), "output.mp4");
  }

  getFramesDirectory(id: string): string {
    return containedPath(this.releaseDirectory(id), "frames");
  }

  async outputExists(id: string): Promise<boolean> {
    try {
      await access(this.getOutputPath(id));
      return true;
    } catch {
      return false;
    }
  }

  private releaseDirectory(id: string): string {
    return containedPath(this.root, assertReleaseId(id));
  }

  private statusPath(id: string): string {
    return containedPath(this.releaseDirectory(id), "status.json");
  }

  private async writeRecord(id: string, record: ReleaseRecord): Promise<void> {
    const target = this.statusPath(id);
    const temporary = `${target}.${process.pid}.tmp`;
    await writeFile(temporary, JSON.stringify(record, null, 2), "utf8");
    await rename(temporary, target);
  }
}

export const storage = new LocalStorageProvider();
