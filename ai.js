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
- 每道菜必须有完整的ingredients、steps、tips
- 运动计划必须专业详细，参考专业健身教练（如抖音谭成义）的教学风格：
  * 每个动作要有明确的目标肌群说明
  * 动作描述要包含起始姿势、发力方式、呼吸节奏、常见错误
  * 根据用户选择的训练部位重点安排对应动作
  * 组数和次数要根据强度等级调整（低：2-3组×10次，中：3-4组×12次，高：4-5组×15次）
  * 无器械动作优先，有器械时根据用户器械条件推荐`;

// 对话调整的系统提示词
const CHAT_SYSTEM_PROMPT = `你是"每日fit"的AI健康规划助手。用户已经有了一份饮食+运动方案，现在想通过对话来微调。

对于用户的调整请求，你需要判断类型并返回JSON：

1. 如果是调整饮食的请求（换菜、改口味、换食材等），返回：
{
  "type": "plan",
  "reply": "简短说明你做了什么调整（如：好的，已把午餐换成清淡口味的清蒸鲈鱼和蔬菜汤）",
  "calories": ...,
  ... (完整方案字段)
}

2. 如果是调整运动的请求（换运动、加训练、降低强度、换室内运动等），同样返回带reply字段的完整方案JSON。运动相关的修改指令包括但不限于：
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

4. 如果用户发送了食材图片描述，根据识别的食材推荐菜谱，返回带reply字段的完整方案JSON。

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

    var modeInstruction = "";
    if (userInfo.mode === "diet") {
        modeInstruction = `
【重要】当前为仅饮食模式，只需要返回饮食相关字段，不需要返回exercise字段。JSON中只包含：type, calories, protein, carbs, fat, ageNote, meals, shoppingList。这样可以更快返回结果。`;
    } else if (userInfo.mode === "exercise") {
        modeInstruction = `
【重要】当前为仅运动模式，只需要返回运动相关字段，不需要返回meals和shoppingList字段。JSON中只包含：type, exercise。每个动作的desc要详细专业。这样可以更快返回结果。`;
    }

    const userMessage = `请为以下用户生成${userInfo.mode === 'diet' ? '饮食' : userInfo.mode === 'exercise' ? '运动' : '饮食+运动'}方案：
- 年龄：${userInfo.age}岁
- 身高：${userInfo.height}cm
- 体重：${userInfo.weight}kg
- 性别：${userInfo.gender === 'male' ? '男' : '女'}
- 饮食目标：${userInfo.goal}
- 口味偏好：${userInfo.tastes.join('、')}
- 忌口/过敏：${userInfo.allergy || '无'}
- 特殊时期：${userInfo.special === 'none' ? '无' : userInfo.special === 'period' ? '经期' : userInfo.special === 'pregnant' ? '孕期' : userInfo.special === 'postpartum' ? '产后恢复' : userInfo.special === 'surgery' ? '术后恢复' : '无'}
- 每日预算：${userInfo.budget}元
- 每餐菜品数：早餐${userInfo.dishCounts.breakfast}道、午餐${userInfo.dishCounts.lunch}道、晚餐${userInfo.dishCounts.dinner}道
- 现有食材：${userInfo.ingredients || '无特定食材，自由搭配'}
- 家庭模式：${userInfo.family && userInfo.family.length > 0 ? '需要为全家人规划，成员：' + userInfo.family.map(m => m.name + '(' + m.age + '岁' + (m.note ? ',' + m.note : '') + ')').join('、') : '仅个人'}
- 运动目标部位：${userInfo.exerciseGoal || '全身燃脂'}
- 训练时长：${userInfo.exerciseDuration || '30'}分钟
- 训练强度：${userInfo.exerciseIntensity === 'low' ? '低（新手）' : userInfo.exerciseIntensity === 'high' ? '高（进阶）' : '中等'}
- 器械条件：${userInfo.exerciseEquipment === 'none' ? '无器械（纯徒手）' : userInfo.exerciseEquipment === 'dumbbells' ? '有哑铃' : userInfo.exerciseEquipment === 'gym' ? '健身房全套器械' : '弹力带'}
${modeInstruction}
${aiContext}
请直接返回JSON，不要多余文字。${userInfo.mode === 'exercise' ? '运动方案要求：根据训练部位重点编排动作，像专业健身教练一样给出每个动作的详细要领（起始姿势、发力方式、呼吸、常见错误）。' : userInfo.mode === 'diet' ? '特殊时期注意事项：经期补铁补血避寒凉；孕期叶酸钙铁避生食；产后高蛋白；术后易消化。' : '运动方案要求专业详细；饮食注意特殊时期。'}`;

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
    // 去除可能的BOM和前后空白
    text = text.trim().replace(/^\uFEFF/, '');

    try {
        // 尝试直接解析
        var parsed = JSON.parse(text);
        return parsed;
    } catch (e) {}

    // 尝试从markdown代码块中提取
    var jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[1].trim());
        } catch (e2) {}
    }

    // 尝试找到第一个 { 和最后一个 }（处理AI在JSON前后加了多余文字的情况）
    var start = text.indexOf('{');
    var end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
        try {
            return JSON.parse(text.substring(start, end + 1));
        } catch (e3) {}
    }

    // 如果都解析不了，直接把原文当消息返回（去掉外层JSON壳如果有的话）
    // 检查是否是未能解析的chat格式文本
    var msgMatch = text.match(/"message"\s*:\s*"([\s\S]*?)"\s*\}?\s*$/);
    if (msgMatch) {
        // 还原转义
        var msg = msgMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        return { type: "chat", message: msg };
    }

    return { type: "chat", message: text };
}
