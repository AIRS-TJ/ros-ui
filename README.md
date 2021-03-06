# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.

工程配置：https://juejin.cn/post/6972094589251354632

```bash
roscore

cd /rosmap/
rosrun map_server map_server map.yaml

roslaunch rosbridge_server rosbridge_websocket.launch
```

发送坐标数据
```json
 {
     "stationId": 1,
     "position":{"x":1.5026010609365723,"y":1.7231939796151974,"z":0},
     "orientation":{"x":0,"y":0,"z":0.7554539516382925,"w":0.6552017452312595}
}
```