import type { ReleaseRecord } from "@/lib/release/types";

export interface StorageProvider {
  create(record: ReleaseRecord): Promise<void>;
  read(id: string): Promise<ReleaseRecord>;
  update(id: string, patch: Partial<ReleaseRecord>): Promise<ReleaseRecord>;
  saveInput(id: string, source: AsyncIterable<Uint8Array>): Promise<number>;
  getInputPath(id: string): string;
  getOutputPath(id: string): string;
  getFramesDirectory(id: string): string;
  outputExists(id: string): Promise<boolean>;
}
