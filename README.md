# 每日fit — AI健康生活规划师

一站式AI饮食+运动规划平台，输入个人数据即可获得个性化的一日三餐方案、分步菜谱教程、运动计划和采购清单。

## 功能特点

- **个性化方案生成**：根据年龄、身高体重、目标（减脂/增肌/维持/均衡）智能生成
- **年龄适配**：5个年龄段自动调整热量、食物偏好和运动强度
- **分步菜谱教程**：每道菜配有食材清单、详细步骤和营养数据
- **运动计划**：热身→有氧→力量→拉伸完整训练方案
- **运动倒计时器**：点击运动项目即可开始计时训练
- **AI对话调整**：接入DeepSeek大模型，自然语言微调方案
- **食材识别推荐**：描述现有食材，AI推荐匹配菜谱
- **采购清单**：自动归类生成购物清单
- **饮食+运动打卡**：记录每日执行情况

## 在线体验

https://yuanzhenhao01.github.io/cooking/

## 技术栈

- HTML / CSS / JavaScript（纯前端，无框架依赖）
- DeepSeek API（大模型对话）
- GitHub Pages（部署）

## 使用方式

1. 打开页面，填写个人信息和偏好
2. （可选）输入 DeepSeek API Key 启用AI个性化
3. 点击「AI生成今日健康方案」
4. 查看三餐方案、运动计划，点击菜品查看教程
5. 通过右侧对话框随时调整方案

## 本地运行

```bash
git clone https://github.com/yuanzhenhao01/cooking.git
cd cooking
# 直接用浏览器打开 index.html 即可
open index.html
```

## 项目结构

```
cooking/
├── index.html      # 主页面
├── style.css       # 样式
├── app.js          # 交互逻辑
├── ai.js           # DeepSeek API 调用模块
├── mockdata.js     # 本地菜品池和方案生成引擎
└── images/         # 资源图片
```
