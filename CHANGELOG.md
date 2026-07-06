# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.0.1 (2026-07-06)

### Features

- :sparkles: 初始化vitepress文档 ([5603fad](https://github.com/yxb123456cy/PicAliOSS/commit/5603fad19371a58e5c938324a9abd1ba625fcf02))
- :sparkles: 管理界面过滤掉非图片类型的文件;不展示非图片类型的文件 ([7e0e222](https://github.com/yxb123456cy/PicAliOSS/commit/7e0e22212227793447b50c9f9c41cbfca29a67a4))
- :sparkles: 配置页中的region改为select选择,同时优化error显示 ([1244192](https://github.com/yxb123456cy/PicAliOSS/commit/124419251b2f44a653518e8d34d8ef01b164da0e))
- :sparkles: 引入 git-cz工具 ([53c1ac3](https://github.com/yxb123456cy/PicAliOSS/commit/53c1ac3117cfa9e31b9b6b8ff327335995cf053d))
- :sparkles: 引入husky git hook ([ef1b8fe](https://github.com/yxb123456cy/PicAliOSS/commit/ef1b8fe5ed13a615a61f4f7e9ba62f3fffb61e5b))
- :sparkles: vitest单元测试搭建 ([067a575](https://github.com/yxb123456cy/PicAliOSS/commit/067a575e27702dc8d0ef3f215d9dfb91b92dc98e))
- 插件需求代码开发 ([b69481e](https://github.com/yxb123456cy/PicAliOSS/commit/b69481ef420944d9cc174f900d70a8dd62d53c10))
- 集成pinia ([c597c75](https://github.com/yxb123456cy/PicAliOSS/commit/c597c75cf56b57e88accf6a11faaa356f35181fb))
- 集成PrimeVue组件库及其自动导入 ([f02a267](https://github.com/yxb123456cy/PicAliOSS/commit/f02a267dcd012108be0659fa2f8e358147c22263))
- 集成vueRouter ([7d14418](https://github.com/yxb123456cy/PicAliOSS/commit/7d14418e6112166a4942746e72509e165d0819fa))
- 相关NPM包引入以及新建rspress文档项目 ([e67c678](https://github.com/yxb123456cy/PicAliOSS/commit/e67c678d2d7900a20ceda9a807e0ba8cd3cd0d56))
- 引入阿里云OSS Browser.js SDK ([eb5013b](https://github.com/yxb123456cy/PicAliOSS/commit/eb5013b281b4363f4de7ef74773170572ef81c46))
- **env:** :sparkles: 添加.env.example 示例文件 ([b1cb047](https://github.com/yxb123456cy/PicAliOSS/commit/b1cb047fa31951ef0468ff612f4b88c87900e878))
- initial wxt+vue3+ts project ([32a997c](https://github.com/yxb123456cy/PicAliOSS/commit/32a997cb26fb6819f5873bb8d4b819d70754fdef))
- **manifest:** 更新manifest配置 ([c0147da](https://github.com/yxb123456cy/PicAliOSS/commit/c0147dae2b29ecb2b1f4c433a316e1f93b904b2a))
- **ui:** :sparkles: [帮助页面]-"关于" 部分进行UI优化 ([c107375](https://github.com/yxb123456cy/PicAliOSS/commit/c107375ca48203ee818d4d2526bbf1b1b2a0fbbb))
- **ui:** :sparkles: 管理界面搜索框以及图标按钮进行UI优化 ([fdc83f7](https://github.com/yxb123456cy/PicAliOSS/commit/fdc83f767704dd284fdf379e610fb3c3bc00030a))
- **ui:** :sparkles: 项目PrimeVue主题色变更为#ff5000 ([07d4ac9](https://github.com/yxb123456cy/PicAliOSS/commit/07d4ac90c7e83d0eb947b8383ace6145b46bba3a)), closes [#ff5000](https://github.com/yxb123456cy/PicAliOSS/issues/ff5000)

### Bug Fixes

- :bug: 删除冗余内容 ([51e4a08](https://github.com/yxb123456cy/PicAliOSS/commit/51e4a08479e7d29eaf30f8d79553b3ed3f9417ef))
- :bug: 上传界面提示未进行存储配置BUG修复 ([bd87d96](https://github.com/yxb123456cy/PicAliOSS/commit/bd87d96e4e7dc6e838f5bfaef9174be1a6edf652))
- :bug: add auto-imports.d.ts and components.d.ts to .gitignore ([f108c0c](https://github.com/yxb123456cy/PicAliOSS/commit/f108c0c1daeaca074adebb28ee770a3635b61ab5))
- **popup:** :bug: update popup title ([b2ce521](https://github.com/yxb123456cy/PicAliOSS/commit/b2ce521d9a13a9d8e743957cd6644a58e073cf62))

### Build System

- :package: 去除无用配置：manifestOverride ([7430b93](https://github.com/yxb123456cy/PicAliOSS/commit/7430b931dd6600e915075c2314a89b413a7881db))

### Code Refactoring

- :recycle: 去除ArcoDesignVue相关依赖及配置,确认使用PrimeVue进行插件开发 ([7fde242](https://github.com/yxb123456cy/PicAliOSS/commit/7fde2424425330b291efce70dbf2c64e23d13c31))
- :recycle: 删除原rspress项目 ([e4d4e93](https://github.com/yxb123456cy/PicAliOSS/commit/e4d4e9300558d7204f033a41efb0f1ed1c2be76a))
- :recycle: 引入ArcoDesignVue，开始UI全面重构及功能更新 ([2148305](https://github.com/yxb123456cy/PicAliOSS/commit/214830579dc71225d5c5991a86f7d7346e3a6d13))
- :recycle: 自定义设置业务代码目录为src,并进行代码统一迁移 ([273de56](https://github.com/yxb123456cy/PicAliOSS/commit/273de5617c41d5713bff79856cf5248e9ea1f545))

### Docs

- :memo: 完善注释 ([293d6fb](https://github.com/yxb123456cy/PicAliOSS/commit/293d6fbf8ca67876ef376b89bb3add5fbdcbf2c7))
- :memo: add License ([2b3ee2e](https://github.com/yxb123456cy/PicAliOSS/commit/2b3ee2ee4dc763e58c31050fd6a886df23e74c0d))
- :memo: add screenshots ([ff87d6e](https://github.com/yxb123456cy/PicAliOSS/commit/ff87d6e2d1a28c533823870c9a60f32dd6a7f9f2))
- :memo: Rspress文档需求改为Vitepress文档需求 ([867e70e](https://github.com/yxb123456cy/PicAliOSS/commit/867e70eb9f3107f24d4595b274040ff6b7212ff2))
- :memo: update readme.md ([db00746](https://github.com/yxb123456cy/PicAliOSS/commit/db007465452cf594efa7b31c07e7c38ea6bc0140))
- :memo: update README.md ([f491ea8](https://github.com/yxb123456cy/PicAliOSS/commit/f491ea8c9e12a69f702a4d4113cd04ceb1fefedf))
- 添加REQUMENTS.md 产品需求文档 ([fc68f2d](https://github.com/yxb123456cy/PicAliOSS/commit/fc68f2d80b645b82731162e062a315c3129403f1))
- add feature.txt ([aff4f41](https://github.com/yxb123456cy/PicAliOSS/commit/aff4f41a4e862eaf1e7594288a2d568e3711ce2c))
- update README.md ([5ab506a](https://github.com/yxb123456cy/PicAliOSS/commit/5ab506abe9e0d30f3c67b8e442056390131f10b3))

### Styling

- :lipstick: run formatter and lint autofix ([f605930](https://github.com/yxb123456cy/PicAliOSS/commit/f605930d426722517e23c2506d5c8d9dc3cb0af6))

### CI

- **release:** :ferris_wheel: add release.yml ([8cb4956](https://github.com/yxb123456cy/PicAliOSS/commit/8cb49562557342a74cd7f674410c6d7ed76685e4))

### Others

- :hammer: 删除一些不需要的内容 ([313e1fc](https://github.com/yxb123456cy/PicAliOSS/commit/313e1fce769b0973923568a0a5a5953d6acbef77))
- :hammer: Introduce the "standard-version" tool to facilitate version releases and generate changelogs. ([fcdcda9](https://github.com/yxb123456cy/PicAliOSS/commit/fcdcda942b0581cd7f3244f028e470ba2df0db05))
- :hammer: update extention version ([9ebc4f4](https://github.com/yxb123456cy/PicAliOSS/commit/9ebc4f4a3b207749b234bba396a37da37abc458c))
- :hammer: update husky-hooks-pre-commit ([b95ec12](https://github.com/yxb123456cy/PicAliOSS/commit/b95ec12f2399856fd7fde02e8ea3454ef02b68d0))
- 更新插件相关icon配置 ([da6ffc4](https://github.com/yxb123456cy/PicAliOSS/commit/da6ffc41df1540968a2de3a41ecf88c3fe10aff3))
- **icon:** :hammer: 变更插件ICON ([6dbed64](https://github.com/yxb123456cy/PicAliOSS/commit/6dbed6480b1af42108cac3126c6e418ee1662196))
