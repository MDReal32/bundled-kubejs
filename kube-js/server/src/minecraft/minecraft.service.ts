import { Injectable } from "@nestjs/common";

import { CfService } from "../cf/cf.service";

@Injectable()
export class MinecraftService {
  constructor(private readonly cfService: CfService) {}

  getModLoader(query = {}) {
    const searchParams = new URLSearchParams(query).toString();
    return this.cfService.fetch(`minecraft/modloader?${searchParams.toString()}`);
  }
}
