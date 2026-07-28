// DeepSeek API 调用模块
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

// 从 localStorage 读取 API Key
function getApiKey() {
    return localStorage.getItem("deepseek_api_key") || "";
}

function setApiKey(key) {
    localStorage.setItem("deepseek_api_key", key);
}

// 对话历史
let chatHistory = [];

// 系统提示词
const SYSTEM_PROMPT = `你是"每日fit"的AI健康规划助手。你需要根据用户的身体数据和目标，生成个性化的饮食和运动方案。

你的回复必须严格按照JSON格式返回，不要包含任何其他文字。JSON结构如下：
{
  "type": "plan",
  "calories": 总热量数字,
  "protein": 蛋白质克数,
  "carbs": 碳水克数,
  "fat": 脂肪克数,
  "ageNote": "针对该年龄段的简短建议",
  "meals": [
    {
      "name": "早餐/午餐/晚餐",
      "emoji": "对应emoji",
      "calories": 该餐热量,
      "dishes": [
        {
          "id": "唯一id",
          "name": "菜名",
          "emoji": "食物emoji",
          "calories": 热量,
          "protein": 蛋白质克数,
          "carbs": 碳水克数,
          "fat": 脂肪克数,
          "time": "制作时间",
          "difficulty": "入门/简单/中等",
          "ingredients": ["食材1 用量", "食材2 用量"],
          "steps": ["步骤1", "步骤2"],
          "tips": ["小贴士1"]
        }
      ]
    }
  ],
  "exercise": {
    "focus": "训练重点",
    "totalTime": "总时长",
    "note": "运动建议说明",
    "totalCalories": 运动消耗热量,
    "sections": [
      {
        "title": "热身/有氧训练/力量训练/拉伸放松",
        "emoji": "对应emoji",
        "items": [
          {
            "id": "唯一id",
            "name": "运动名称",
            "emoji": "运动emoji",
            "duration": "时长或组数",
            "intensity": "低/中/高",
            "calories": 消耗热量,
            "desc": "动作描述和要点"
          }
        ]
      }
    ]
  },
  "shoppingList": {
    "分类名": ["食材1", "食材2"]
  }
}

注意事项：
- 根据用户年龄调整食物选择（老年人清淡易消化，年轻人可丰富些）
- 根据目标调整热量（减脂1200-1500，维持1800-2000，增肌2200-2500）
- 运动计划要和饮食目标匹配
- 食材要常见易买，步骤要详细适合小白
- 每道菜必须有完整的ingredients、steps、tips`;

// 对话调整的系统提示词
const CHAT_SYSTEM_PROMPT = `你是"每日fit"的AI健康规划助手。用户已经有了一份饮食+运动方案，现在想通过对话来微调。

对于用户的调整请求，你需要判断类型并返回JSON：

1. 如果是调整饮食的请求（换菜、改口味、换食材等），返回完整的新方案JSON（格式同之前，包含meals和exercise）。

2. 如果是调整运动的请求（换运动、加训练、降低强度、换室内运动等），同样返回完整的新方案JSON。运动相关的修改指令包括但不限于：
   - "加一个腿部训练/核心训练/手臂训练"
   - "运动强度太大了/减轻一些/换简单的"
   - "换成室内能做的运动/不需要器械的"
   - "有氧时间加长/减少力量训练"
   - "加一组拉伸/增加热身时间"

3. 如果是普通聊天/咨询（问营养知识、问动作要领、问做法等），返回：
{
  "type": "chat",
  "message": "你的回答内容"
}

4. 如果用户发送了食材图片描述，根据识别的食材推荐菜谱，返回完整方案JSON。

注意：
- 保持之前方案的基本结构，只修改用户要求变更的部分
- 如果用户只要求改运动，饮食部分保持不变；反之亦然
- 运动计划必须包含热身、有氧、力量、拉伸四个阶段`;

// 调用 DeepSeek API
async function callDeepSeek(messages) {
    var apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("未设置API Key");
    }
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apiKey
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: messages,
                temperature: 0.7,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            throw new Error("API请求失败: " + response.status);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("DeepSeek API 调用出错:", error);
        throw error;
    }
}

// 生成初始方案
async function generateAIPlan(userInfo) {
    // 获取用户历史数据作为AI参考
    var aiContext = UserData.getAIContext();

    const userMessage = `请为以下用户生成今日饮食+运动方案：
- 年龄：${userInfo.age}岁
- 身高：${userInfo.height}cm
- 体重：${userInfo.weight}kg
- 性别：${userInfo.gender === 'male' ? '男' : '女'}
- 目标：${userInfo.goal}
- 口味偏好：${userInfo.tastes.join('、')}
- 忌口/过敏：${userInfo.allergy || '无'}
- 每日预算：${userInfo.budget}元
- 每餐菜品数：早餐${userInfo.dishCounts.breakfast}道、午餐${userInfo.dishCounts.lunch}道、晚餐${userInfo.dishCounts.dinner}道
- 现有食材：${userInfo.ingredients || '无特定食材，自由搭配'}

${aiContext}
请根据以上信息（包括用户历史数据）生成完整的JSON方案。如果用户执行率低，推荐更简单的菜和更轻松的运动。`;

    chatHistory = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
    ];

    const result = await callDeepSeek(chatHistory);
    chatHistory.push({ role: "assistant", content: result });

    // 解析JSON
    return parseAIResponse(result);
}

// 对话调整方案
async function chatWithAI(userMessage, currentPlanJSON) {
    // 如果还没有对话历史，初始化
    if (chatHistory.length === 0) {
        chatHistory = [
            { role: "system", content: CHAT_SYSTEM_PROMPT }
        ];
    }
    // 确保系统提示是对话模式
    chatHistory[0] = { role: "system", content: CHAT_SYSTEM_PROMPT };

    chatHistory.push({ role: "user", content: userMessage });

    // 限制历史长度，避免token超限
    if (chatHistory.length > 10) {
        chatHistory = [chatHistory[0]].concat(chatHistory.slice(-8));
    }

    const result = await callDeepSeek(chatHistory);
    chatHistory.push({ role: "assistant", content: result });

    return parseAIResponse(result);
}

// 图片识别食材（通过文字描述模拟，DeepSeek暂不支持直接图片输入）
async function identifyIngredients(description) {
    const message = `用户拍照识别到以下食材：${description}。
请根据这些食材，生成合适的饮食方案（优先使用这些食材）。同时搭配适当的运动计划。
返回完整JSON方案。`;

    chatHistory.push({ role: "user", content: message });
    const result = await callDeepSeek(chatHistory);
    chatHistory.push({ role: "assistant", content: result });

    return parseAIResponse(result);
}

// 解析AI返回的JSON
function parseAIResponse(text) {
    try {
        // 尝试直接解析
        return JSON.parse(text);
    } catch (e) {
        // 尝试从markdown代码块中提取
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[1].trim());
            } catch (e2) {}
        }
        // 尝试找到第一个 { 和最后一个 }
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
            try {
                return JSON.parse(text.substring(start, end + 1));
            } catch (e3) {}
        }
        // 如果都解析不了，当作纯文字回复
        return { type: "chat", message: text };
    }
}
