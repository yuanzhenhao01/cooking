// 菜品池 —— 按餐次分类，每个方案从中选取对应数量
// AI根据年龄段调整：青少年多碳水蛋白、中年均衡、老年清淡易消化

const dishPool = {
    breakfast: [
        {
            id: "b1", name: "燕麦香蕉煎饼", emoji: "\ud83e\udd5e",
            calories: 220, protein: 12, carbs: 30, fat: 6,
            time: "10分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["燕麦片 50g", "香蕉 1根", "鸡蛋 1个", "牛奶 2汤匙"],
            steps: ["香蕉压泥。", "加燕麦和鸡蛋搅成面糊。", "平底锅刷薄油小火煎。", "两面金黄出锅。"],
            tips: ["无需加糖，香蕉本身够甜。", "搭配无糖酸奶更佳。"]
        },
        {
            id: "b2", name: "水煮蛋+牛奶", emoji: "\ud83e\udd5a",
            calories: 180, protein: 16, carbs: 8, fat: 9,
            time: "8分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["鸡蛋 2个", "纯牛奶 250ml"],
            steps: ["鸡蛋冷水下锅煮8分钟。", "过冷水剥壳，配牛奶。"],
            tips: ["高蛋白早餐首选。", "可换脱脂牛奶减少脂肪。"]
        },
        {
            id: "b3", name: "手抓饼煎蛋", emoji: "\ud83e\uddc7",
            calories: 380, protein: 15, carbs: 40, fat: 18,
            time: "8分钟", difficulty: "入门",
            ageTag: "young,adult",
            ingredients: ["速冻手抓饼 1张", "鸡蛋 1个", "生菜 2片", "甜面酱 适量"],
            steps: ["小火煎手抓饼至两面金黄。", "旁边煎一个鸡蛋。", "抹酱卷起食用。"],
            tips: ["不需放油，饼自带油脂。"]
        },
        {
            id: "b4", name: "小米南瓜粥", emoji: "\ud83c\udf5b",
            calories: 150, protein: 4, carbs: 30, fat: 2,
            time: "30分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["小米 50g", "南瓜 100g", "水 500ml"],
            steps: ["南瓜切小块。", "水烧开下小米和南瓜。", "小火煮25分钟至浓稠。"],
            tips: ["养胃佳品，适合各年龄段。", "老年人可以煮得更烂一些。"]
        },
        {
            id: "b5", name: "全麦三明治", emoji: "\ud83e\udd6a",
            calories: 350, protein: 22, carbs: 35, fat: 14,
            time: "10分钟", difficulty: "入门",
            ageTag: "young,adult",
            ingredients: ["全麦面包 2片", "鸡蛋 1个", "生菜 2片", "鸡胸肉片 50g", "芝士片 1片"],
            steps: ["煎蛋和鸡胸肉。", "面包上铺生菜、肉片、芝士、煎蛋。", "盖面包切开。"],
            tips: ["全麦面包比白面包GI更低。"]
        },
        {
            id: "b6", name: "豆浆油条", emoji: "\ud83e\udd5b",
            calories: 320, protein: 10, carbs: 42, fat: 13,
            time: "5分钟（买现成）", difficulty: "入门",
            ageTag: "young,adult",
            ingredients: ["现磨豆浆 1杯", "油条 1根"],
            steps: ["豆浆加热。", "油条搭配食用。"],
            tips: ["经典中式早餐。", "可选无糖豆浆减少热量。"]
        },
        {
            id: "b7", name: "蒸蛋羹", emoji: "\ud83c\udf73",
            calories: 120, protein: 12, carbs: 2, fat: 7,
            time: "15分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["鸡蛋 2个", "温水 蛋液1.5倍", "盐 少许", "香油 几滴"],
            steps: ["蛋打散加温水和盐。", "过筛入碗盖保鲜膜。", "水开后蒸10分钟。", "淋香油。"],
            tips: ["口感滑嫩，老人小孩都适合。"]
        },
        {
            id: "b8", name: "红枣桂圆粥", emoji: "\ud83c\udf5b",
            calories: 160, protein: 3, carbs: 35, fat: 1,
            time: "30分钟", difficulty: "入门",
            ageTag: "senior,adult",
            ingredients: ["大米 50g", "红枣 5颗", "桂圆干 10g", "水 500ml"],
            steps: ["大米洗净，红枣去核。", "所有材料下锅大火烧开。", "小火煮25分钟。"],
            tips: ["补气养血，适合中老年女性。"]
        }
    ],
    lunch: [
        {
            id: "l1", name: "鸡胸肉藜麦饭", emoji: "\ud83c\udf71",
            calories: 420, protein: 45, carbs: 35, fat: 10,
            time: "20分钟", difficulty: "简单",
            ageTag: "young,adult",
            ingredients: ["鸡胸肉 150g", "藜麦 80g", "西兰花 100g", "胡萝卜 半根", "橄榄油 1小勺", "黑胡椒 适量"],
            steps: ["藜麦煮15分钟。", "鸡胸肉腌后煎熟。", "蔬菜焯水。", "摆盘组合。"],
            tips: ["高蛋白减脂经典搭配。"]
        },
        {
            id: "l2", name: "番茄炒鸡蛋", emoji: "\ud83c\udf45",
            calories: 200, protein: 14, carbs: 12, fat: 12,
            time: "10分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["鸡蛋 3个", "番茄 2个", "盐 适量", "糖 少许", "油 适量"],
            steps: ["蛋打散炒熟盛出。", "番茄切块炒出汁。", "倒回鸡蛋加调味。"],
            tips: ["经典家常菜，老少皆宜。"]
        },
        {
            id: "l3", name: "清炒西兰花", emoji: "\ud83e\udd66",
            calories: 80, protein: 5, carbs: 8, fat: 3,
            time: "8分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["西兰花 200g", "蒜 2瓣", "橄榄油 1小勺", "盐 少许"],
            steps: ["西兰花焯水1分钟。", "蒜末爆香，下西兰花翻炒。", "加盐出锅。"],
            tips: ["少油清炒保留营养。"]
        },
        {
            id: "l4", name: "红烧肉", emoji: "\ud83c\udf56",
            calories: 450, protein: 22, carbs: 12, fat: 35,
            time: "60分钟", difficulty: "中等",
            ageTag: "young,adult",
            ingredients: ["五花肉 250g", "冰糖 20g", "生抽 2汤匙", "老抽 1汤匙", "八角 2个", "姜片 3片"],
            steps: ["五花肉焯水切块。", "熬冰糖上色。", "加调料和热水炖45分钟。", "大火收汁。"],
            tips: ["小火慢炖才软烂。"]
        },
        {
            id: "l5", name: "虾仁炒芦笋", emoji: "\ud83e\udd90",
            calories: 180, protein: 25, carbs: 8, fat: 5,
            time: "10分钟", difficulty: "简单",
            ageTag: "all",
            ingredients: ["虾仁 150g", "芦笋 200g", "蒜 2瓣", "盐 少许", "料酒 1汤匙"],
            steps: ["虾仁加盐和料酒腌5分钟。", "芦笋切段。", "蒜爆香，炒虾仁至变色。", "加芦笋翻炒2分钟。"],
            tips: ["高蛋白低脂，减脂增肌皆宜。"]
        },
        {
            id: "l6", name: "宫保鸡丁", emoji: "\ud83c\udf36\ufe0f",
            calories: 320, protein: 30, carbs: 15, fat: 16,
            time: "20分钟", difficulty: "简单",
            ageTag: "young,adult",
            ingredients: ["鸡胸肉 200g", "花生米 30g", "干辣椒 5个", "醋 2汤匙", "糖 1汤匙", "生抽 1汤匙"],
            steps: ["鸡肉切丁腌制。", "调糖醋汁。", "炒鸡丁盛出，爆香辣椒。", "回锅淋汁，加花生。"],
            tips: ["花生最后放保持酥脆。"]
        },
        {
            id: "l7", name: "紫菜蛋花汤", emoji: "\ud83c\udf72",
            calories: 50, protein: 4, carbs: 3, fat: 2,
            time: "5分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["紫菜 一小把", "鸡蛋 1个", "盐 少许", "香油 几滴"],
            steps: ["水烧开放紫菜。", "淋入蛋液。", "加盐和香油出锅。"],
            tips: ["低卡增加饱腹感。"]
        },
        {
            id: "l8", name: "清蒸鲈鱼", emoji: "\ud83d\udc1f",
            calories: 200, protein: 35, carbs: 3, fat: 6,
            time: "20分钟", difficulty: "简单",
            ageTag: "all",
            ingredients: ["鲈鱼 1条", "姜丝 适量", "葱丝 适量", "蒸鱼豉油 2汤匙", "料酒 1汤匙"],
            steps: ["鱼处理干净，身上划刀。", "铺姜丝料酒，大火蒸8分钟。", "倒掉蒸汁，铺葱丝。", "淋热油和蒸鱼豉油。"],
            tips: ["高蛋白低脂肪，老人孩子都适合。", "蒸的时间不要超过10分钟。"]
        },
        {
            id: "l9", name: "米饭", emoji: "\ud83c\udf5a",
            calories: 230, protein: 5, carbs: 50, fat: 1,
            time: "30分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["大米 130g"],
            steps: ["淘米加水，电饭锅煮饭。"],
            tips: ["米水比1:1.2。"]
        },
        {
            id: "l10", name: "杂粮饭", emoji: "\ud83c\udf5a",
            calories: 200, protein: 6, carbs: 42, fat: 2,
            time: "35分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["大米 60g", "糙米 30g", "红豆 15g", "燕麦 15g"],
            steps: ["红豆和糙米提前浸泡2小时。", "所有材料混合加水煮饭。"],
            tips: ["GI更低，饱腹感更强。"]
        },
        {
            id: "l11", name: "凉拌黄瓜", emoji: "\ud83e\udd52",
            calories: 40, protein: 2, carbs: 6, fat: 1,
            time: "5分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["黄瓜 1根", "蒜 2瓣", "醋 1汤匙", "生抽 1汤匙", "盐 少许"],
            steps: ["黄瓜拍碎切段。", "蒜末加醋、生抽、盐调汁。", "浇上拌匀。"],
            tips: ["清爽低卡开胃菜。"]
        },
        {
            id: "l12", name: "山药排骨汤", emoji: "\ud83c\udf72",
            calories: 280, protein: 20, carbs: 25, fat: 12,
            time: "50分钟", difficulty: "简单",
            ageTag: "senior,adult",
            ingredients: ["排骨 200g", "山药 150g", "姜片 3片", "枸杞 少许", "盐 适量"],
            steps: ["排骨焯水。", "山药去皮切段。", "排骨加水大火烧开转小火炖30分钟。", "加山药再炖15分钟，加盐和枸杞。"],
            tips: ["山药健脾养胃，特别适合中老年人。"]
        }
    ],
    dinner: [
        {
            id: "d1", name: "虾仁西兰花", emoji: "\ud83e\udd90",
            calories: 160, protein: 22, carbs: 8, fat: 5,
            time: "10分钟", difficulty: "简单",
            ageTag: "all",
            ingredients: ["虾仁 150g", "西兰花 200g", "蒜 2瓣", "盐 少许"],
            steps: ["虾仁焯水。", "西兰花焯水。", "蒜爆香，虾仁和西兰花翻炒调味。"],
            tips: ["减脂晚餐首选。"]
        },
        {
            id: "d2", name: "凉拌鸡丝", emoji: "\ud83c\udf57",
            calories: 180, protein: 28, carbs: 5, fat: 6,
            time: "20分钟", difficulty: "简单",
            ageTag: "all",
            ingredients: ["鸡胸肉 200g", "黄瓜 1根", "姜片 2片", "生抽 2汤匙", "醋 1汤匙", "辣椒油 适量"],
            steps: ["鸡胸肉煮熟撕丝。", "黄瓜切丝。", "调酱汁浇上拌匀。"],
            tips: ["高蛋白低脂肪，适合减脂。"]
        },
        {
            id: "d3", name: "葱油拌面", emoji: "\ud83c\udf5c",
            calories: 420, protein: 12, carbs: 58, fat: 16,
            time: "15分钟", difficulty: "入门",
            ageTag: "young,adult",
            ingredients: ["面条 150g", "小葱 5根", "生抽 2汤匙", "老抽 半汤匙", "糖 1小勺", "油 3汤匙"],
            steps: ["葱段冷油小火炸酥。", "葱油加调料调匀。", "面煮熟浇葱油拌匀。"],
            tips: ["冷油下葱慢炸是关键。"]
        },
        {
            id: "d4", name: "蒜蓉蒸虾", emoji: "\ud83e\udd90",
            calories: 150, protein: 28, carbs: 4, fat: 3,
            time: "15分钟", difficulty: "简单",
            ageTag: "all",
            ingredients: ["大虾 8只", "蒜 5瓣", "粉丝 少许", "蒸鱼豉油 2汤匙"],
            steps: ["虾开背去虾线。", "粉丝泡软铺底摆虾。", "淋蒜蓉油蒸6分钟。", "淋蒸鱼豉油。"],
            tips: ["清蒸保持原味，高蛋白低脂。"]
        },
        {
            id: "d5", name: "番茄豆腐汤", emoji: "\ud83c\udf72",
            calories: 100, protein: 8, carbs: 10, fat: 4,
            time: "10分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["番茄 1个", "嫩豆腐 半块", "盐 少许", "香油 几滴", "葱花 少许"],
            steps: ["番茄切块炒出汁。", "加水烧开。", "豆腐切小块放入煮2分钟。", "加盐、香油、葱花。"],
            tips: ["低卡高蛋白汤品，适合晚餐。"]
        },
        {
            id: "d6", name: "醋溜土豆丝", emoji: "\ud83e\udd54",
            calories: 120, protein: 3, carbs: 20, fat: 4,
            time: "10分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["土豆 2个", "醋 2汤匙", "干辣椒 2个", "蒜 2瓣", "盐 适量"],
            steps: ["土豆切丝泡水去淀粉。", "蒜和辣椒爆香。", "大火快炒土豆丝。", "淋醋加盐出锅。"],
            tips: ["泡水去淀粉才能炒出脆口感。"]
        },
        {
            id: "d7", name: "牛肉炒芹菜", emoji: "\ud83e\udd69",
            calories: 220, protein: 28, carbs: 8, fat: 9,
            time: "15分钟", difficulty: "简单",
            ageTag: "young,adult",
            ingredients: ["牛里脊 200g", "芹菜 3根", "蒜 2瓣", "生抽 1汤匙", "料酒 1汤匙", "淀粉 1汤匙"],
            steps: ["牛肉逆纹切片腌15分钟。", "芹菜切段。", "大火滑炒牛肉盛出。", "炒芹菜后回锅调味。"],
            tips: ["牛肉逆纹切才嫩。"]
        },
        {
            id: "d8", name: "小份杂粮饭", emoji: "\ud83c\udf5a",
            calories: 160, protein: 4, carbs: 34, fat: 1,
            time: "30分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["大米 40g", "糙米 20g", "红豆 10g"],
            steps: ["红豆糙米提前泡。", "混合煮饭。"],
            tips: ["晚餐少量主食控制碳水。"]
        },
        {
            id: "d9", name: "清蒸鸡蛋羹", emoji: "\ud83c\udf73",
            calories: 120, protein: 12, carbs: 2, fat: 7,
            time: "15分钟", difficulty: "入门",
            ageTag: "senior,all",
            ingredients: ["鸡蛋 2个", "温水 蛋液1.5倍", "盐 少许", "香油"],
            steps: ["蛋打散加温水盐。", "过筛盖保鲜膜。", "蒸10分钟淋香油。"],
            tips: ["口感滑嫩易消化，适合老人。"]
        },
        {
            id: "d10", name: "蔬菜沙拉", emoji: "\ud83e\udd57",
            calories: 90, protein: 3, carbs: 12, fat: 4,
            time: "5分钟", difficulty: "入门",
            ageTag: "all",
            ingredients: ["混合生菜 100g", "小番茄 5个", "黄瓜 半根", "橄榄油 1小勺", "柠檬汁 少许"],
            steps: ["蔬菜洗净切好。", "橄榄油和柠檬汁调汁。", "拌匀即可。"],
            tips: ["最简单的减脂晚餐选择。"]
        }
    ]
};

// 年龄段配置：影响热量系数和推荐食物偏好
const ageConfig = {
    teen: { label: "青少年(12-17)", calFactor: 1.1, prefer: "young", note: "成长期需充足碳水和蛋白质" },
    young: { label: "青年(18-30)", calFactor: 1.0, prefer: "young", note: "代谢旺盛，可适当增加蛋白质" },
    adult: { label: "中年(31-50)", calFactor: 0.95, prefer: "adult", note: "注意控制油脂，增加膳食纤维" },
    middle: { label: "中老年(51-65)", calFactor: 0.85, prefer: "senior", note: "注重清淡，多补钙和优质蛋白" },
    senior: { label: "老年(65+)", calFactor: 0.75, prefer: "senior", note: "清淡易消化，少油少盐" }
};

function getAgeGroup(age) {
    if (age < 18) return "teen";
    if (age <= 30) return "young";
    if (age <= 50) return "adult";
    if (age <= 65) return "middle";
    return "senior";
}

// 基础方案热量（根据目标）
const basePlans = {
    lose: { calories: 1500, protein: 120, carbs: 150, fat: 45 },
    maintain: { calories: 2000, protein: 90, carbs: 250, fat: 65 },
    gain: { calories: 2500, protein: 150, carbs: 300, fat: 75 },
    health: { calories: 1800, protein: 80, carbs: 220, fat: 60 }
};

// 根据用户设置动态生成方案
function generateMealPlan(goal, age, dishCounts) {
    var ageGroup = getAgeGroup(age);
    var ageInfo = ageConfig[ageGroup];
    var base = basePlans[goal];

    // 年龄调整热量
    var totalCal = Math.round(base.calories * ageInfo.calFactor);
    var protein = Math.round(base.protein * ageInfo.calFactor);
    var carbs = Math.round(base.carbs * ageInfo.calFactor);
    var fat = Math.round(base.fat * ageInfo.calFactor);

    // 三餐热量分配比例
    var calRatios = { breakfast: 0.3, lunch: 0.4, dinner: 0.3 };

    // 从菜品池中选菜（按年龄适配性筛选）
    function pickDishes(pool, count, prefer) {
        // 优先选适合该年龄段的菜
        var suitable = pool.filter(function (d) {
            return d.ageTag === "all" || d.ageTag.indexOf(prefer) !== -1;
        });
        // 不够就从全池补
        if (suitable.length < count) {
            suitable = pool.slice();
        }
        // 随机打乱
        suitable.sort(function () { return Math.random() - 0.5; });
        return suitable.slice(0, count);
    }

    var meals = [
        {
            name: "早餐",
            emoji: "\ud83c\udf05",
            calories: Math.round(totalCal * calRatios.breakfast),
            dishes: pickDishes(dishPool.breakfast, dishCounts.breakfast, ageInfo.prefer)
        },
        {
            name: "午餐",
            emoji: "\u2600\ufe0f",
            calories: Math.round(totalCal * calRatios.lunch),
            dishes: pickDishes(dishPool.lunch, dishCounts.lunch, ageInfo.prefer)
        },
        {
            name: "晚餐",
            emoji: "\ud83c\udf19",
            calories: Math.round(totalCal * calRatios.dinner),
            dishes: pickDishes(dishPool.dinner, dishCounts.dinner, ageInfo.prefer)
        }
    ];

    // 生成采购清单
    var shoppingMap = {};
    meals.forEach(function (meal) {
        meal.dishes.forEach(function (dish) {
            dish.ingredients.forEach(function (ing) {
                // 简单分类
                var cat = "其他";
                if (/鸡|肉|虾|牛|排骨|鱼|蛋/.test(ing)) cat = "肉蛋水产";
                else if (/菜|瓜|茄|椒|葱|蒜|芹|笋|兰花|山药|豆腐|生菜|番茄/.test(ing)) cat = "蔬菜豆制品";
                else if (/米|面|饼|麦|燕麦|藜|粉/.test(ing)) cat = "主食杂粮";
                else if (/奶|牛奶|酸奶/.test(ing)) cat = "乳制品";
                else if (/油|抽|酱|醋|盐|糖|料酒|椒|粉|淀粉/.test(ing)) cat = "调味料";
                else if (/枣|桂圆|枸杞|花生/.test(ing)) cat = "干果";
                if (!shoppingMap[cat]) shoppingMap[cat] = [];
                if (shoppingMap[cat].indexOf(ing) === -1) shoppingMap[cat].push(ing);
            });
        });
    });

    return {
        calories: totalCal,
        protein: protein,
        carbs: carbs,
        fat: fat,
        ageGroup: ageGroup,
        ageNote: ageInfo.note,
        meals: meals,
        shoppingList: shoppingMap
    };
}

// ==================== 运动计划模块 ====================

const exercisePool = {
    warmup: [
        { id: "w1", name: "开合跳", emoji: "\ud83e\uddd8", duration: "3分钟", intensity: "低", calories: 30, desc: "双脚跳开同时双手举过头顶，再跳回。", ageTag: "young,adult" },
        { id: "w2", name: "原地高抬腿", emoji: "\ud83c\udfc3", duration: "2分钟", intensity: "低", calories: 25, desc: "原地跑步，膝盖尽量抬高至腰部。", ageTag: "young,adult" },
        { id: "w3", name: "关节活动操", emoji: "\ud83e\uddd8", duration: "5分钟", intensity: "低", calories: 15, desc: "头颈、肩膀、手腕、腰部、膝盖、脚踝逐个活动。", ageTag: "all" },
        { id: "w4", name: "慢走热身", emoji: "\ud83d\udeb6", duration: "5分钟", intensity: "低", calories: 20, desc: "中速步行，配合手臂摆动，让身体逐渐升温。", ageTag: "senior" }
    ],
    cardio: [
        { id: "c1", name: "快走/慢跑", emoji: "\ud83c\udfc3", duration: "30分钟", intensity: "中", calories: 200, desc: "户外或跑步机慢跑，心率保持在最大心率60-70%。", ageTag: "all" },
        { id: "c2", name: "跳绳", emoji: "\u26a1", duration: "15分钟", intensity: "高", calories: 180, desc: "匀速跳绳，30秒跳+10秒休息为一组。", ageTag: "young" },
        { id: "c3", name: "骑行/动感单车", emoji: "\ud83d\udeb4", duration: "30分钟", intensity: "中", calories: 220, desc: "匀速骑行或室内动感单车，保持中等阻力。", ageTag: "young,adult" },
        { id: "c4", name: "HIIT间歇训练", emoji: "\ud83d\udd25", duration: "20分钟", intensity: "高", calories: 250, desc: "30秒高强度（波比跳/深蹲跳）+30秒休息，重复。", ageTag: "young" },
        { id: "c5", name: "游泳", emoji: "\ud83c\udfca", duration: "30分钟", intensity: "中", calories: 230, desc: "自由泳或蛙泳交替，适合关节保护。", ageTag: "all" },
        { id: "c6", name: "健步走", emoji: "\ud83d\udeb6", duration: "40分钟", intensity: "低", calories: 150, desc: "6-7km/h步速，手臂自然摆动，适合中老年。", ageTag: "senior,adult" },
        { id: "c7", name: "太极拳", emoji: "\ud83e\uddd8", duration: "30分钟", intensity: "低", calories: 100, desc: "柔和的全身运动，改善平衡和柔韧性。", ageTag: "senior" }
    ],
    strength: [
        { id: "s1", name: "俯卧撑", emoji: "\ud83d\udcaa", duration: "4组×12个", intensity: "中", calories: 60, desc: "双手略宽于肩，身体保持一条直线，胸部贴近地面。跪姿版适合初学者。", ageTag: "young,adult" },
        { id: "s2", name: "深蹲", emoji: "\ud83e\uddb5", duration: "4组×15个", intensity: "中", calories: 70, desc: "双脚与肩同宽，臀部向后坐，膝盖不超过脚尖，蹲至大腿平行地面。", ageTag: "all" },
        { id: "s3", name: "平板支撑", emoji: "\ud83e\uddd8", duration: "3组×45秒", intensity: "中", calories: 40, desc: "前臂撑地，身体成一条直线，核心收紧。", ageTag: "young,adult" },
        { id: "s4", name: "弓步蹲", emoji: "\ud83e\uddb5", duration: "3组×12个(每侧)", intensity: "中", calories: 60, desc: "向前迈步蹲下，两腿成90度角，交替进行。", ageTag: "young,adult" },
        { id: "s5", name: "哑铃弯举", emoji: "\ud83d\udcaa", duration: "3组×12个", intensity: "中", calories: 40, desc: "手持哑铃（2-5kg），上臂固定，弯曲肘关节。", ageTag: "young,adult" },
        { id: "s6", name: "靠墙静蹲", emoji: "\ud83e\uddb5", duration: "3组×30秒", intensity: "低", calories: 35, desc: "背靠墙壁，大腿与小腿成90度角，坚持。", ageTag: "all" },
        { id: "s7", name: "弹力带训练", emoji: "\ud83c\udfcb\ufe0f", duration: "3组×15个", intensity: "低", calories: 45, desc: "用弹力带做侧向行走、拉伸等动作，对关节友好。", ageTag: "senior,adult" },
        { id: "s8", name: "仰卧卷腹", emoji: "\ud83e\uddb4", duration: "3组×20个", intensity: "中", calories: 45, desc: "仰卧屈膝，双手放耳侧，肩膀离地收缩腹肌。", ageTag: "young,adult" }
    ],
    stretch: [
        { id: "st1", name: "全身拉伸", emoji: "\ud83e\uddd8", duration: "10分钟", intensity: "低", calories: 20, desc: "从上到下依次拉伸：颈部、肩膀、胸部、背部、腿部，每个位置停留20秒。", ageTag: "all" },
        { id: "st2", name: "瑜伽放松", emoji: "\ud83e\uddd8\u200d\u2640\ufe0f", duration: "15分钟", intensity: "低", calories: 30, desc: "下犬式、婴儿式、猫牛式等基础瑜伽动作。", ageTag: "all" },
        { id: "st3", name: "泡沫轴放松", emoji: "\ud83e\uddb4", duration: "10分钟", intensity: "低", calories: 15, desc: "用泡沫轴滚压大腿、小腿、背部肌肉，缓解紧张。", ageTag: "young,adult" }
    ]
};

// 运动方案配置（根据目标不同）
const exerciseConfig = {
    lose: {
        focus: "减脂",
        totalTime: "45-60分钟",
        note: "以有氧为主，搭配力量训练提升基础代谢",
        cardioCount: 2,
        strengthCount: 3,
        stretchCount: 1
    },
    maintain: {
        focus: "维持",
        totalTime: "30-45分钟",
        note: "有氧和力量均衡，保持身体状态",
        cardioCount: 1,
        strengthCount: 2,
        stretchCount: 1
    },
    gain: {
        focus: "增肌",
        totalTime: "45-60分钟",
        note: "以力量训练为主，有氧适量辅助",
        cardioCount: 1,
        strengthCount: 4,
        stretchCount: 1
    },
    health: {
        focus: "健康",
        totalTime: "30-40分钟",
        note: "中等强度活动，提升心肺功能和柔韧性",
        cardioCount: 1,
        strengthCount: 2,
        stretchCount: 1
    }
};

// 生成运动计划
function generateExercisePlan(goal, age) {
    var ageGroup = getAgeGroup(age);
    var ageInfo = ageConfig[ageGroup];
    var config = exerciseConfig[goal];

    function pickExercises(pool, count, prefer) {
        var suitable = pool.filter(function (e) {
            return e.ageTag === "all" || e.ageTag.indexOf(prefer) !== -1;
        });
        if (suitable.length < count) suitable = pool.slice();
        suitable.sort(function () { return Math.random() - 0.5; });
        return suitable.slice(0, count);
    }

    var warmup = pickExercises(exercisePool.warmup, 1, ageInfo.prefer);
    var cardio = pickExercises(exercisePool.cardio, config.cardioCount, ageInfo.prefer);
    var strength = pickExercises(exercisePool.strength, config.strengthCount, ageInfo.prefer);
    var stretch = pickExercises(exercisePool.stretch, config.stretchCount, ageInfo.prefer);

    var totalCalories = 0;
    [warmup, cardio, strength, stretch].forEach(function (group) {
        group.forEach(function (e) { totalCalories += e.calories; });
    });

    return {
        focus: config.focus,
        totalTime: config.totalTime,
        note: config.note,
        totalCalories: totalCalories,
        sections: [
            { title: "热身", emoji: "\ud83d\udd25", items: warmup },
            { title: "有氧训练", emoji: "\u2764\ufe0f", items: cardio },
            { title: "力量训练", emoji: "\ud83d\udcaa", items: strength },
            { title: "拉伸放松", emoji: "\ud83e\uddd8", items: stretch }
        ]
    };
}

