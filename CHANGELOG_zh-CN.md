# 更新日志

"SCSS to CSS Plus" 扩展的所有重要更改都将记录在此文件中。

## [0.0.2] - 2025-12-12
### 新增
- 支持通过注释忽略特定文件: `// scss-to-css: no` 或 `/* scss-to-css: no */`。

## [0.0.1] - 2025-12-12
### 初始发布
- 保存 SCSS/SASS 时自动编译为 CSS。
- 集成 **PostCSS** 和 **Autoprefixer**。
- 集成 **CSSNano** 进行代码压缩。
- 支持 `scssToCssPlus.browserslist` 配置项，自定义 Autoprefixer 目标浏览器。
- 添加状态栏指示器显示编译状态：
  - 黄色: 编译中...
  - 绿色: 成功
  - 红色: 失败
- **Media Query 合并**: 自动合并和排序分散的 `@media` 查询（移动端优先）。
- 支持生成 Source Map。
- 支持 Partials（自动忽略以 `_` 开头的文件）。

