# Introduce

A long time ago when first time I met `KubeJS` mod I was so excited about it. I first looked to mod but couldn't use it cause time and knowledge. But now when I improved my self as JavaScript developer I decided to make a modpack with `KubeJS` mod. But regular usage of `KubeJS` mod is not enough for me. For that I decided to use `vite` as `bundler` for `KubeJS` scripts. It's small and scratch project. Please give a feedback if you have any idea.

# Usage
Clone this repo and run `yarn install` to install dependencies. After that run `yarn watch` to start development builds. You can add additional buildable config in `vite.config.ts` buy in my opinion I made everything which I can. After that you can start writing your scripts in `src` directory and it will automatically will be built into kubejs/*_scripts directories depends on file. You can find more information about `KubeJS` mod in [here](https://kubejs.latvian.dev/).

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
