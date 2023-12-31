import { Injectable } from "@nestjs/common";

import { CfService } from "../cf/cf.service";

@Injectable()
export class ModsService {
  constructor(private readonly cfService: CfService) {}

  getMod(modid: string) {
    return this.cfService.fetch(`mods/${modid}`);
  }

  getFiles(modid: string, query = {}) {
    const searchParams = new URLSearchParams(query).toString();
    return this.cfService.fetch(`mods/${modid}/files?${searchParams.toString()}`);
  }
}
