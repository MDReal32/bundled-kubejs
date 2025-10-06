import { WriteStream, createWriteStream, readFileSync, readdirSync } from "node:fs";
import { join, normalize, resolve } from "node:path";

import archiver from "archiver";

import { Logger } from "../utils";

export class Archiver {
  private readonly logger = new Logger("KubeJS Core/Archiver");
  private readonly __archive: archiver.Archiver;
  private readonly __output: WriteStream;

  constructor(zipArchiveFile: string) {
    this.__output = createWriteStream(zipArchiveFile);
    this.__archive = archiver("zip", { zlib: { level: 9 } });
    this.__archive.pipe(this.__output);
  }

  addFile(path: string, content: string) {
    this.logger.info(normalize(path));
    this.__archive.append(content, { name: path });
  }

  file(path: string, name: string) {
    this.logger.info(normalize(name));
    const fileContent = readFileSync(path, "utf-8");
    this.addFile(name, fileContent);

    return this;
  }

  directory(path: string, name: string) {
    this.logger.info(normalize(name));

    const files = readdirSync(path, { withFileTypes: true });
    for (const file of files) {
      const filePath = resolve(path, file.name);
      const fileName = join(name, file.name);
      if (file.isDirectory()) {
        this.directory(filePath, fileName);
      } else {
        this.logger.info(normalize(fileName));
        this.file(filePath, fileName);
      }
    }

    return this;
  }

  archive() {
    this.logger.info("Starting archive process...");
    return new Promise<void>(async (resolve, reject) => {
      this.__archive.on("warning", err => {
        if (err.code === "ENOENT") {
          this.logger.warn("We got a warning:", err);
        } else {
          reject(err);
        }
      });

      this.__archive.on("error", err => {
        this.logger.error("We got an error:", err);
        reject(err);
      });

      this.__archive.finalize().then(() => {
        this.logger.info(`Archive finalized: ${this.__archive.pointer()} total bytes`);
        resolve();
      });
    });
  }
}
