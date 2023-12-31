# KubeJS Project Generator

This is a project generator for KubeJS/Plugin. It will generate a project with the following structure:

# Pre-requirements
 - [NodeJS](https://nodejs.org/en/) - I recommend to use LTS version.
 - [NPX](https://www.npmjs.com/package/npx) - Tool for running npm packages without installing them.

# Usage
Run command below anywhere you want.
```shell
npx @kubejs/generator
```

After answering some questions, it will generate a project for you and will open a save dialog. 
Save it somewhere you want and import it in CurseForge App.
Before opening it in IDE you must run game once and run `/probejs dump` command in game console.

# Structure of generated project
```
├── <name-defined-by-you>
│   ├── src
│   │   ├── client.ts (Entry point for client scripts)
│   │   ├── server.ts (Entry point for server scripts)
│   │   ├── startup.ts (Entry point for startup scripts)
│   │   ├── vite.d.ts (Typings for KubeJS)
│   ├── .gitignore
│   ├── .yarnrc.yml
│   ├── package.json
│   ├── yarn.lock
```

# Future plans
 - [ ] Add support for other platforms such as Modrinth, etc...
 - [ ] Add support for other package managers such as PNPM, etc...
 - [ ] Add different templates for different platforms. (Open to suggestions in issues)
