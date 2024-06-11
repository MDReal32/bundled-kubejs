import { WriteStream, createWriteStream, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

import archiver from "archiver";

export class Archiver {
  private readonly __archive: archiver.Archiver;
  private readonly __output: WriteStream;

  constructor(zipArchiveFile: string) {
    this.__output = createWriteStream(zipArchiveFile);
    this.__archive = archiver("zip", {
      zlib: { level: 9 } // Compression level (0-9)
    });
    this.__archive.pipe(this.__output);
  }

  addFile(path: string, content: string) {
    this.__archive.append(content, { name: path });
  }

  file(path: string, name: string) {
    return this.__archive.file(path, { name });
  }

  directory(path: string, name: string) {
    readdirSync(path).forEach(file => {
      const filePath = resolve(path, file);
      const fileName = join(name, file);
      const stats = statSync(filePath);
      if (stats.isDirectory()) {
        this.directory(filePath, fileName);
      } else {
        this.file(filePath, fileName);
      }
    });

    return this.__archive;
  }

  archive() {
    return new Promise<void>(async (resolve, reject) => {
      this.__archive.on("warning", err => {
        if (err.code === "ENOENT") {
          console.warn("Warning:", err);
        } else {
          reject(err);
        }
      });

      this.__archive.on("error", err => {
        reject(err);
      });

      this.__archive.finalize().then(resolve);
    });
  }
}
