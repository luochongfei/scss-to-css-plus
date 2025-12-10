# SCSS 转 CSS 增强版 (SCSS to CSS Plus)

保存 SCSS 文件时，自动编译为 CSS，并使用 PostCSS (Autoprefixer) 和 CSSNano 进行优化。
![](demo.webp)

## 为什么叫增强版
不仅仅是将 scss 转为 css, 还在编译后进行了精简优化，合并相同的样式，合并相同的媒体查询

## 主要功能

- **自动编译**: 保存 `.scss` 文件时自动生成 `.css`。
- **Autoprefixer**: 自动添加浏览器厂商前缀（基于 Can I Use 数据）。
- **Media Query 合并**: 自动合并和排序分散的 `@media` 查询（移动端优先）。
- **压缩优化**: 使用 CSSNano 压缩 CSS 代码，减小文件体积。
- **Source Maps**: 生成 Source Map 文件，方便调试。
- **Partials 支持**: 自动忽略以 `_` 开头的文件（Partial 文件）。

## 配置项

您可以在 `settings.json` 中配置以下选项：

- `scssToCssPlus.autoCompile`: 是否启用自动编译 (默认: `true`)。
- `scssToCssPlus.outDir`: CSS 输出目录 (默认: `null`，即同级目录)。
- `scssToCssPlus.generateSourceMap`: 是否生成 Source Map (默认: `true`)。
- `scssToCssPlus.minify`: 是否压缩输出 (默认: `true`)。

## 使用方法

只需打开并保存 `.scss` 文件即可！或者使用命令面板执行 `SCSS to CSS Plus: 编译 SCSS 为 CSS`。

