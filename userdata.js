// 用户数据持久化模块 — 使用 localStorage 模拟数据库
// 数据结构：历史方案、打卡记录、体重记录、反馈记录

const UserData = {
    // 获取所有数据
    getAll: function () {
        var data = localStorage.getItem("dailyfit_userdata");
        if (!data) {
            return {
                weight_history: [],    // [{date, weight}]
                checkin_history: [],    // [{date, meals: [], exercises: []}]
                plan_history: [],       // [{date, plan}]
                feedback_history: [],   // [{date, text}]
                preferences: {}        // 学习到的用户偏好
            };
        }
        return JSON.parse(data);
    },

    // 保存所有数据
    saveAll: function (data) {
        localStorage.setItem("dailyfit_userdata", JSON.stringify(data));
    },

    // 记录体重
    logWeight: function (weight) {
        var data = this.getAll();
        var today = new Date().toISOString().split("T")[0];
        // 同一天只保留最新的
        data.weight_history = data.weight_history.filter(function (r) { return r.date !== today; });
        data.weight_history.push({ date: today, weight: weight });
        // 只保留最近90天
        data.weight_history = data.weight_history.slice(-90);
        this.saveAll(data);
    },

    // 记录打卡
    logCheckin: function (type, name) {
        var data = this.getAll();
        var today = new Date().toISOString().split("T")[0];
        var todayRecord = data.checkin_history.find(function (r) { return r.date === today; });
        if (!todayRecord) {
            todayRecord = { date: today, meals: [], exercises: [] };
            data.checkin_history.push(todayRecord);
        }
        if (type === "meal" && todayRecord.meals.indexOf(name) === -1) {
            todayRecord.meals.push(name);
        } else if (type === "exercise" && todayRecord.exercises.indexOf(name) === -1) {
            todayRecord.exercises.push(name);
        }
        // 只保留最近60天
        data.checkin_history = data.checkin_history.slice(-60);
        this.saveAll(data);
    },

    // 保存今日方案
    logPlan: function (plan) {
        var data = this.getAll();
        var today = new Date().toISOString().split("T")[0];
        data.plan_history = data.plan_history.filter(function (r) { return r.date !== today; });
        data.plan_history.push({ date: today, calories: plan.calories, goal: plan.focus || "" });
        data.plan_history = data.plan_history.slice(-30);
        this.saveAll(data);
    },

    // 保存反馈
    logFeedback: function (text) {
        var data = this.getAll();
        var today = new Date().toISOString().split("T")[0];
        data.feedback_history.push({ date: today, text: text });
        data.feedback_history = data.feedback_history.slice(-30);
        this.saveAll(data);
    },

    // 更新学习到的偏好
    updatePreferences: function (prefs) {
        var data = this.getAll();
        Object.assign(data.preferences, prefs);
        this.saveAll(data);
    },

    // ========== 统计分析 ==========

    // 获取最近N天打卡完成率
    getCheckinRate: function (days) {
        var data = this.getAll();
        var recent = data.checkin_history.slice(-days);
        if (recent.length === 0) return { meal: 0, exercise: 0 };
        var mealTotal = 0, mealDone = 0, exTotal = 0, exDone = 0;
        recent.forEach(function (r) {
            mealTotal += 3; // 每天3餐
            mealDone += r.meals.length;
            exTotal += 1; // 每天算1次运动
            exDone += r.exercises.length > 0 ? 1 : 0;
        });
        return {
            meal: mealTotal > 0 ? Math.round(mealDone / mealTotal * 100) : 0,
            exercise: exTotal > 0 ? Math.round(exDone / exTotal * 100) : 0,
            days: recent.length
        };
    },

    // 获取体重趋势
    getWeightTrend: function () {
        var data = this.getAll();
        var history = data.weight_history;
        if (history.length < 2) return { trend: "insufficient", change: 0 };
        var first = history[0].weight;
        var last = history[history.length - 1].weight;
        var change = last - first;
        var trend = change < -0.5 ? "losing" : change > 0.5 ? "gaining" : "stable";
        return { trend: trend, change: Math.round(change * 10) / 10, history: history };
    },

    // 生成周报数据
    getWeeklyReport: function () {
        var data = this.getAll();
        var now = new Date();
        var weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        var weekStr = weekAgo.toISOString().split("T")[0];

        var weekCheckins = data.checkin_history.filter(function (r) { return r.date >= weekStr; });
        var weekWeights = data.weight_history.filter(function (r) { return r.date >= weekStr; });
        var weekFeedback = data.feedback_history.filter(function (r) { return r.date >= weekStr; });

        var totalMeals = 0, totalExercises = 0;
        weekCheckins.forEach(function (r) {
            totalMeals += r.meals.length;
            totalExercises += r.exercises.length;
        });

        var weightChange = 0;
        if (weekWeights.length >= 2) {
            weightChange = weekWeights[weekWeights.length - 1].weight - weekWeights[0].weight;
        }

        return {
            period: weekStr + " ~ " + now.toISOString().split("T")[0],
            daysTracked: weekCheckins.length,
            mealsCompleted: totalMeals,
            mealRate: weekCheckins.length > 0 ? Math.round(totalMeals / (weekCheckins.length * 3) * 100) : 0,
            exerciseDays: weekCheckins.filter(function (r) { return r.exercises.length > 0; }).length,
            exerciseRate: weekCheckins.length > 0 ? Math.round(weekCheckins.filter(function (r) { return r.exercises.length > 0; }).length / weekCheckins.length * 100) : 0,
            weightChange: Math.round(weightChange * 10) / 10,
            weights: weekWeights,
            feedbacks: weekFeedback
        };
    },

    // 生成月报数据
    getMonthlyReport: function () {
        var data = this.getAll();
        var now = new Date();
        var monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        var monthStr = monthAgo.toISOString().split("T")[0];

        var monthCheckins = data.checkin_history.filter(function (r) { return r.date >= monthStr; });
        var monthWeights = data.weight_history.filter(function (r) { return r.date >= monthStr; });

        var totalMeals = 0, totalExercises = 0;
        monthCheckins.forEach(function (r) {
            totalMeals += r.meals.length;
            totalExercises += r.exercises.length;
        });

        var weightChange = 0;
        if (monthWeights.length >= 2) {
            weightChange = monthWeights[monthWeights.length - 1].weight - monthWeights[0].weight;
        }

        return {
            period: monthStr + " ~ " + now.toISOString().split("T")[0],
            daysTracked: monthCheckins.length,
            mealsCompleted: totalMeals,
            mealRate: monthCheckins.length > 0 ? Math.round(totalMeals / (monthCheckins.length * 3) * 100) : 0,
            exerciseDays: monthCheckins.filter(function (r) { return r.exercises.length > 0; }).length,
            exerciseRate: monthCheckins.length > 0 ? Math.round(monthCheckins.filter(function (r) { return r.exercises.length > 0; }).length / monthCheckins.length * 100) : 0,
            weightChange: Math.round(weightChange * 10) / 10,
            weights: monthWeights
        };
    },

    // 生成AI学习上下文（供AI参考用户历史）
    getAIContext: function () {
        var rate = this.getCheckinRate(7);
        var weightTrend = this.getWeightTrend();
        var data = this.getAll();
        var recentFeedback = data.feedback_history.slice(-3).map(function (f) { return f.text; });

        var context = "用户历史数据参考：\n";
        context += "- 近7天饮食打卡率：" + rate.meal + "%\n";
        context += "- 近7天运动打卡率：" + rate.exercise + "%\n";
        if (weightTrend.trend !== "insufficient") {
            context += "- 体重趋势：" + (weightTrend.trend === "losing" ? "下降" : weightTrend.trend === "gaining" ? "上升" : "稳定") + "（变化" + weightTrend.change + "kg）\n";
        }
        if (recentFeedback.length > 0) {
            context += "- 近期反馈：" + recentFeedback.join("；") + "\n";
        }
        if (rate.meal < 50) {
            context += "- 建议：用户饮食执行率较低，请推荐更简单快手的菜品\n";
        }
        if (rate.exercise < 30) {
            context += "- 建议：用户运动执行率较低，请降低运动强度和时长\n";
        }
        return context;
    }
};
