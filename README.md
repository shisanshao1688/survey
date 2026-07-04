# 机电一体化技术专业调研问卷 — 免费在线版

## 两种使用方式

### 方式A：零成本快速版（文件直接发）

直接将 `index.html` 文件通过微信/QQ/邮件发给填写者，对方**双击打开就能填**。

- 优点：零配置，即刻可用
- 缺点：数据保存在各填写者的浏览器本地，需手动汇总（通过页面上的导出提示）

---

### 方式B：在线链接版（推荐）⭐

将问卷部署到 GitHub Pages，生成一个永久链接，发送链接即可。数据自动汇集到 Google Sheets。

**全程免费：GitHub账号 + Google账号 均免费。**

---

## 方式B 部署步骤（约10分钟）

### 第1步：创建 Google Sheets 后端

1. 打开 [Google Sheets](https://sheets.google.com)，新建一个空白表格，命名为 **「调研问卷数据」**
2. 菜单 → **扩展程序 → Apps Script**
3. 将 `apps-script.gs` 文件内容**全部复制粘贴**进去（替换默认代码）
4. 点击 **「部署」→「新建部署」**，类型选择 **「Web 应用」**
5. 访问权限设为 **「任何人」**，点击「部署」
6. **复制生成的 URL**（类似 `https://script.google.com/macros/s/xxxxx/exec`）

### 第2步：配置前端

1. 用记事本打开 `index.html`
2. 找到第 1 行附近的 `const SCRIPT_URL = '';`
3. 把上一步复制的 URL 填入：`const SCRIPT_URL = 'https://script.google.com/macros/s/xxxxx/exec';`
4. 保存文件

### 第3步：部署到 GitHub Pages

1. 注册 [GitHub](https://github.com) 账号（免费）
2. 点击右上角 **「+」→「New repository」**
3. Repository name 填写：`survey`（或任意名称）
4. 勾选 **「Add a README file」**，点击 **「Create repository」**
5. 进入仓库后，点击 **「Add file」→「Upload files」**
6. 把修改好的 `index.html` 拖入上传区域，点击 **「Commit changes」**
7. 点击 **「Settings」→ 左侧「Pages」**
8. Branch 选择 `main`，点击 **「Save」**
9. 等待约 1 分钟后，页面顶部会出现一个 URL：
   `https://你的用户名.github.io/survey/`

### 第4步：分享链接

把 GitHub Pages 生成的链接发给填写者，对方在手机/电脑上打开即可在线填写。

提交的数据会自动写入你的 Google Sheets，打开表格即可查看。

---

## 功能特点

| 功能 | 说明 |
|------|------|
| 三套问卷 | 企业版（6步）、毕业生版（5步）、在校生版（5步） |
| 移动端适配 | 手机/电脑均可流畅填写 |
| 分步填写 | 进度条可视化，支持前后翻页，数据不丢失 |
| 题型丰富 | 单选、多选、文本输入、评价矩阵表 |
| 自动收集 | 提交后数据实时写入 Google Sheets |
| 可转发 | 一人部署，分享链接全员可用 |
| 在线/离线 | 无后端也能用，数据存本地浏览器 |

## Google Sheets 数据格式

提交后，Google Sheets 会自动按问卷类型分三个 Sheet：
- 「企业版问卷」— 含60+列数据字段
- 「毕业生版问卷」— 含40+列数据字段
- 「在校生版问卷」— 含50+列数据字段

每份提交 = 一行，首行为中文表头，方便直接筛选和分析。

## 示意图

```
填写者打开链接
    │
    ▼
index.html (GitHub Pages)
    │  选择问卷类型
    │  分步填写
    │  点击提交
    ▼
Google Apps Script (免费后端)
    │  接收数据
    ▼
Google Sheets (数据表格)
    │  自动分行记录
    ▼
你打开 Google Sheets 查看/导出Excel
```

## 常见问题

**Q: 链接打开是空白？**
A: 确认 index.html 是仓库根目录的唯一文件，GitHub Pages 会自动识别。

**Q: 提交后 Google Sheets 没有数据？**
A: 
1. 检查 Apps Script 部署权限是否为「任何人」
2. 修改代码后需要重新部署（新建版本）才能生效
3. 打开 Google Sheets 查看是否有新的 Sheet 生成

**Q: 可以自定义问卷内容吗？**
A: 可以。修改 index.html 中对应问卷步骤的 HTML 内容，或者修改 JS 中的 `buildEnterpriseStep` / `buildGraduateStep` / `buildStudentStep` 函数。

**Q: 完全不需要 Google Sheets 可以吗？**
A: 可以。不填 SCRIPT_URL，问卷提交后数据保存在浏览器 localStorage 中，可通过浏览器开发者工具查看。
