# @xfe-team/babel-preset-xfe

> babel preset 定制集成, 目前主要针对日常 react 项目, 支持 IE9+, 其中源码 src/index.ts 进行全面注释说明

## 安装

```bash
npm install @xfe-team/babel-preset-xfe --registry=https://registry.npmjs.org/
```

## 意图

目前有非常多的 babel-preset, 而当前 babel-preset 主要为了以下目的而创建

1. 可控与稳定, 团队找那个所有的 babel plugin 必须通过测试和审核才会被加入当前 babel preset 中. 如果使用第三方 preset 我们可能因对第三方 preset 不理解而发生底层编译异常且无法第一时间响应修复.
2. 及时响应更新, 根据团队中成员反馈会及时评估并更新最新 babel plugin, 这样有效提高大家工作效率.
3. 减少或避免业务开发中对 babel 的复杂配置.

## 参考
* [babel-preset-umi](https://www.npmjs.com/search?q=babel-preset-umi) - 全面对新功能支持
* [babel-preset-react-app](https://www.npmjs.com/search?q=babel-preset-react-app) - create-react-app 官方 preset, 虽部分配置符合国内情况, 但经社区考验, 修复大量已知或个人未考量的问题

## ChangeLog

## 0.0.4 (2019-10-14)

* feat: init commit

## 作者
She Ailun

