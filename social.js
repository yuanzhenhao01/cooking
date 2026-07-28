// 社交与激励体系模块

// ========== 成就徽章系统 ==========
const AchievementSystem = {
    // 所有成就定义
    badges: [
        { id: "streak_3", name: "初试牛刀", desc: "连续打卡3天", icon: "\ud83c\udf1f", condition: function (s) { return s.streak >= 3; } },
        { id: "streak_7", name: "习惯养成", desc: "连续打卡7天", icon: "\ud83d\udd25", condition: function (s) { return s.streak >= 7; } },
        { id: "streak_14", name: "坚持达人", desc: "连续打卡14天", icon: "\ud83d\udcaa", condition: function (s) { return s.streak >= 14; } },
        { id: "streak_30", name: "自律之星", desc: "连续打卡30天", icon: "\ud83c\udf1f", condition: function (s) { return s.streak >= 30; } },
        { id: "meals_10", name: "小厨初成", desc: "累计完成10餐打卡", icon: "\ud83c\udf73", condition: function (s) { return s.totalMeals >= 10; } },
        { id: "meals_50", name: "厨房能手", desc: "累计完成50餐打卡", icon: "\ud83d\udc68\u200d\ud83c\udf73", condition: function (s) { return s.totalMeals >= 50; } },
        { id: "meals_100", name: "百餐大厨", desc: "累计完成100餐打卡", icon: "\ud83c\udfc6", condition: function (s) { return s.totalMeals >= 100; } },
        { id: "exercise_7", name: "动起来了", desc: "累计运动7天", icon: "\ud83c\udfc3", condition: function (s) { return s.exerciseDays >= 7; } },
        { id: "exercise_30", name: "运动达人", desc: "累计运动30天", icon: "\ud83e\udd38", condition: function (s) { return s.exerciseDays >= 30; } },
        { id: "exercise_60", name: "健身狂人", desc: "累计运动60天", icon: "\ud83c\udfcb\ufe0f", condition: function (s) { return s.exerciseDays >= 60; } },
        { id: "weight_first", name: "第一步", desc: "首次记录体重", icon: "\u2696\ufe0f", condition: function (s) { return s.weightRecords >= 1; } },
        { id: "weight_10", name: "持续关注", desc: "记录体重10次", icon: "\ud83d\udcca", condition: function (s) { return s.weightRecords >= 10; } },
        { id: "perfect_day", name: "完美一天", desc: "某天饮食+运动全部打卡", icon: "\ud83c\udf08", condition: function (s) { return s.perfectDays >= 1; } },
        { id: "perfect_week", name: "完美一周", desc: "连续7天饮食+运动全打卡", icon: "\ud83d\udc8e", condition: function (s) { return s.perfectDays >= 7; } },
        { id: "feedback_5", name: "积极反馈", desc: "提交5次饮食反馈", icon: "\ud83d\udcdd", condition: function (s) { return s.feedbacks >= 5; } }
    ],

    // 计算用户统计数据
    getStats: function () {
        var data = UserData.getAll();
        var checkins = data.checkin_history;
        var totalMeals = 0;
        var exerciseDays = 0;
        var perfectDays = 0;

        checkins.forEach(function (r) {
            totalMeals += r.meals.length;
            if (r.exercises.length > 0) exerciseDays++;
            if (r.meals.length >= 3 && r.exercises.length > 0) perfectDays++;
        });

        // 计算连续打卡天数
        var streak = 0;
        var today = new Date().toISOString().split("T")[0];
        var dates = checkins.map(function (r) { return r.date; }).sort().reverse();
        if (dates.length > 0) {
            var checkDate = new Date(today);
            for (var i = 0; i < 60; i++) {
                var dateStr = checkDate.toISOString().split("T")[0];
                if (dates.indexOf(dateStr) !== -1) {
                    streak++;
                } else if (i > 0) {
                    break;
                }
                checkDate.setDate(checkDate.getDate() - 1);
            }
        }

        return {
            streak: streak,
            totalMeals: totalMeals,
            exerciseDays: exerciseDays,
            perfectDays: perfectDays,
            weightRecords: data.weight_history.length,
            feedbacks: data.feedback_history.length
        };
    },

    // 获取已解锁的成就
    getUnlocked: function () {
        var stats = this.getStats();
        return this.badges.filter(function (badge) {
            return badge.condition(stats);
        });
    },

    // 获取下一个即将解锁的成就
    getNextGoals: function () {
        var stats = this.getStats();
        return this.badges.filter(function (badge) {
            return !badge.condition(stats);
        }).slice(0, 3);
    }
};

// ========== 打卡排行榜（模拟好友数据） ==========
const Leaderboard = {
    // 模拟好友数据
    friends: [
        { name: "小明", avatar: "\ud83d\udc66", streak: 12, mealRate: 85, exerciseRate: 70 },
        { name: "小红", avatar: "\ud83d\udc67", streak: 8, mealRate: 92, exerciseRate: 60 },
        { name: "大壮", avatar: "\ud83e\uddd1", streak: 21, mealRate: 78, exerciseRate: 95 },
        { name: "小美", avatar: "\ud83d\udc69", streak: 5, mealRate: 88, exerciseRate: 45 },
        { name: "阿健", avatar: "\ud83d\udc68", streak: 15, mealRate: 70, exerciseRate: 88 }
    ],

    // 获取排行榜（含当前用户）
    getRanking: function () {
        var stats = AchievementSystem.getStats();
        var rate = UserData.getCheckinRate(7);
        var me = {
            name: "我",
            avatar: "\ud83d\ude0a",
            streak: stats.streak,
            mealRate: rate.meal,
            exerciseRate: rate.exercise,
            isMe: true
        };

        var all = this.friends.concat([me]);
        // 按综合分排序（连续天数×2 + 饮食率 + 运动率）
        all.sort(function (a, b) {
            var scoreA = a.streak * 2 + a.mealRate + a.exerciseRate;
            var scoreB = b.streak * 2 + b.mealRate + b.exerciseRate;
            return scoreB - scoreA;
        });

        return all;
    }
};

// ========== 社区分享（生成分享卡片HTML） ==========
const ShareCard = {
    generate: function () {
        var stats = AchievementSystem.getStats();
        var rate = UserData.getCheckinRate(7);
        var weightTrend = UserData.getWeightTrend();
        var unlocked = AchievementSystem.getUnlocked();
        var today = new Date().toISOString().split("T")[0];

        var badgeIcons = unlocked.slice(-5).map(function (b) { return b.icon; }).join(" ");

        var trendText = "";
        if (weightTrend.trend === "losing") trendText = "\u2b07\ufe0f " + Math.abs(weightTrend.change) + "kg";
        else if (weightTrend.trend === "gaining") trendText = "\u2b06\ufe0f " + weightTrend.change + "kg";
        else if (weightTrend.trend === "stable") trendText = "\u2194\ufe0f \u7a33\u5b9a";
        else trendText = "\u2014";

        return {
            date: today,
            streak: stats.streak,
            mealRate: rate.meal,
            exerciseRate: rate.exercise,
            badges: badgeIcons,
            badgeCount: unlocked.length,
            weightTrend: trendText
        };
    }
};
