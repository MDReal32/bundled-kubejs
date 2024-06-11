import { dirname, resolve } from "node:path";
import { moveCursor } from "node:readline";

import _ from "lodash";
import { IFs } from "memfs";

import { Action } from "../types/action";
import { DownloadMetadata } from "../types/download-metadata";
import { Logger } from "./logger/logger";

export class Downloader {
  private downloadedFilesList = new Map<string, string>();
  private downloadMetadataMap = new Map<string, DownloadMetadata>();
  private downloadOrder: string[] = [];
  private actions: Action[] = [];
  private readonly logger = new Logger("Downloader");

  constructor(private readonly __fs: IFs) {}

  addDownloadedFile(file: string, destination: string) {
    this.downloadedFilesList.set(file, resolve(destination));
  }

  async download(url: string, destination: string, idx?: number) {
    const response = await fetch(url);
    const size = Number(response.headers.get("content-length"));
    const filePath = resolve(destination, url.split("/").pop()!);
    const fileSize = this.__fs.existsSync(filePath) ? this.__fs.statSync(filePath).size : -1;
    if (fileSize === size) {
      this.actions.push({ url, skip: true });
      return this.log();
    }

    this.__fs.mkdirSync(dirname(filePath), { recursive: true });
    const stream = this.__fs.createWriteStream(filePath);
    const reader = response.body!.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        const currentMetadata = this.downloadMetadataMap.get(url);
        if (currentMetadata) {
          currentMetadata.done = true;
          this.downloadMetadataMap.set(url, currentMetadata);
        }
        this.actions.push({ url, done: true });
        this.log();
        break;
      }

      const currentMetadata = this.downloadMetadataMap.get(url);
      if (currentMetadata) {
        currentMetadata.current += value.length;
        this.downloadMetadataMap.set(url, currentMetadata);
      } else {
        this.downloadMetadataMap.set(url, {
          total: size,
          current: value.length,
          done: false
        });
      }

      !_.isNil(idx) && (this.downloadOrder[idx] = url);
      stream.write(value);

      this.log();
    }
  }

  async downloadList(parallel = 5) {
    this.logger.info(`Downloading file list with parallelism of ${parallel}`);
    const queue = Array.from(this.downloadedFilesList);
    const cache = new Set<string>();

    const next = async (idx: number): Promise<void> => {
      if (queue.length === 0) return;
      const item = queue.shift();
      if (!item) return;
      const [url, destination] = item;
      if (cache.has(url)) return next(idx);
      await this.download(url, destination, idx);
      cache.add(url);
      return next(idx);
    };
    await Promise.all(Array.from({ length: parallel }).map((_, idx) => next(idx)));
    this.log(true);
  }

  private log(preventMouseJump: boolean = false) {
    const maxNameLength = Math.max(
      ...this.downloadOrder.map(name => name.split("/").pop()!.length)
    );

    const maxColumns = (process.stdout.columns || 100) - this.logger.templateLength;

    const metadata = Array.from(this.downloadOrder)
      .map(url => {
        const metadata = this.downloadMetadataMap.get(url);

        if (!metadata) return;
        const name = url.split("/").pop()!;
        const message = `${name}: ${" ".repeat(maxNameLength - name.length)}`;

        if (metadata.done) {
          return;
        }

        const percentage = Math.round((metadata.current / metadata.total) * 100);
        const barMaxWidth = maxColumns - message.length - 10;
        const barWidth = Math.round((barMaxWidth / 100) * percentage);
        const bar = "█".repeat(barWidth);
        const emptyBar = " ".repeat(barMaxWidth - barWidth);
        return `${message} [${bar}${emptyBar}] ${percentage}%`;
      })
      .filter(Boolean);

    metadata.forEach(() => console.log("\x1B[K"));
    moveCursor(process.stdout, 0, -metadata.length);

    this.actions.forEach(({ url, skip, done }, idx) => {
      const prefix = skip ? "Skipped" : done ? "Done" : null;
      const message = `${prefix} ${url}`;
      this.logger.info(`${message}${" ".repeat(maxColumns - message.length)}`);
      this.actions.splice(idx, 1);
    });

    metadata.length && this.logger.info(metadata.join("\n"));
    !preventMouseJump && metadata.length && moveCursor(process.stdout, 0, -metadata.length);
  }
}
