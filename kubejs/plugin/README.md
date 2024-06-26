# Introduce
A long time ago when first time I met `KubeJS` mod I was so excited about it. I first looked to mod but couldn't use it cause time and knowledge. But now when I improved my self as JavaScript developer I decided to make a modpack with `KubeJS` mod. But regular usage of `KubeJS` mod is not enough for me. For that I decided to use `vite` as `bundler` for `KubeJS` scripts. It's small and scratch project. Please give a feedback if you have any idea.

# Pre-requirements
 - [NodeJS](https://nodejs.org/en/) - I recommend to use LTS version.
 - [Yarn](https://yarnpkg.com/) - I recommend to use yarn 2.
 - [KubeJS](https://www.curseforge.com/minecraft/mc-mods/kubejs) - I recommend to use latest version.
 - [ProbeJS](https://www.curseforge.com/minecraft/mc-mods/probejs) - required for full typescript support.

# Usage
Create new minecraft project in one of these platforms such as curseforge, modrinth, etc...  
Then setup new node project on instance directory.
```shell
cd /path/to/instance
npm init -y
# or
yarn init -y # for yarn 1
yarn init -y -2 # for yarn 2
```

Add `@kubejs/plugin` to your project.
```shell
npm install @kubejs/plugin
# or
yarn add @kubejs/plugin
```

Add these scripts to your `package.json` file.
```json
{
  "scripts": {
    "build": "kubejs build",
    "watch": "kubejs build --watch"
  }
}
```

Add this configuration to your tsconfig.json file.
```json
{
  "compilerOptions": {
    "types": ["@kubejs/plugin/probe.d.ts"]
  }
}
```

Now you can run `npm run build` or `yarn build` to build your scripts for production.  
Or you can run `npm run watch` or `yarn watch` to start development statement.

You can add additional buildable config in `vite.config.ts`.
But in my opinion I made everything which I can.
After that you can start writing your scripts in `src` directory, and it will automatically will be built into kubejs/*_scripts directories depends on entry file.
You can find more information about `KubeJS` mod in [here](https://kubejs.latvian.dev/).

# File Structure
Here have 3 entry points for `vite` build.
 - `src/client.ts` - This file will be built into `kubejs/client_scripts` directory, and it will be loaded on client side.
 - `src/server.ts` - This file will be built into `kubejs/server_scripts` directory, and it will be loaded on server side.
 - `src/startup.ts` - This file will be built into `kubejs/startup_scripts` directory, and it will be loaded on startup.

# License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

# Contributing
If you have any idea, or you want to contribute to this project please open an issue or pull request. I will be happy to see your ideas and contributions.

# Contact
You can contact with me via [Discord](https://discordapp.com/users/673855981473628201) or [LinkedIn](https://www.linkedin.com/in/mdrealiyev)

# TODO
 - [ ] Add framework support (React, Vue, etc...) for UI based development
 - [ ] Add more examples
 - [ ] Add more documentation
 - [ ] Add more tests
