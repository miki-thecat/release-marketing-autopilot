import { spawn } from "node:child_process";
import { ReleaseError } from "@/lib/release/errors";

export async function runProcess(
  executable: string,
  args: readonly string[],
  errorCode: "ffmpeg_failed" | "corrupt_media",
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      windowsHide: true,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => (stdout += chunk));
    child.stderr.on("data", (chunk: string) => {
      stderr = `${stderr}${chunk}`.slice(-16_000);
    });
    child.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") {
        reject(new ReleaseError("ffmpeg_unavailable", `${executable} was not found`, 500));
      } else {
        reject(new ReleaseError(errorCode, error.message, 500));
      }
    });
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new ReleaseError(errorCode, `${executable} exited with ${code}: ${stderr}`, 500));
    });
  });
}
