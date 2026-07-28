// 模拟账户系统 — localStorage 实现
const AuthSystem = {
    // 获取所有注册用户
    getAllUsers: function () {
        var users = localStorage.getItem("dailyfit_users");
        return users ? JSON.parse(users) : {};
    },

    saveAllUsers: function (users) {
        localStorage.setItem("dailyfit_users", JSON.stringify(users));
    },

    // 获取当前登录用户
    getCurrentUser: function () {
        var uid = localStorage.getItem("dailyfit_current_user");
        if (!uid) return null;
        var users = this.getAllUsers();
        return users[uid] || null;
    },

    // 注册
    register: function (username, password, nickname) {
        var users = this.getAllUsers();
        if (users[username]) {
            return { success: false, msg: "用户名已存在" };
        }
        if (!username || username.length < 3) {
            return { success: false, msg: "用户名至少3个字符" };
        }
        if (!password || password.length < 4) {
            return { success: false, msg: "密码至少4位" };
        }
        users[username] = {
            username: username,
            password: password,
            nickname: nickname || username,
            avatar: getRandomAvatar(),
            createdAt: new Date().toISOString().split("T")[0]
        };
        this.saveAllUsers(users);
        // 自动登录
        localStorage.setItem("dailyfit_current_user", username);
        // 初始化该用户的数据空间
        this.initUserData(username);
        return { success: true, msg: "注册成功" };
    },

    // 登录
    login: function (username, password) {
        var users = this.getAllUsers();
        if (!users[username]) {
            return { success: false, msg: "用户不存在" };
        }
        if (users[username].password !== password) {
            return { success: false, msg: "密码错误" };
        }
        localStorage.setItem("dailyfit_current_user", username);
        return { success: true, msg: "登录成功" };
    },

    // 登出
    logout: function () {
        localStorage.removeItem("dailyfit_current_user");
    },

    // 是否已登录
    isLoggedIn: function () {
        return !!localStorage.getItem("dailyfit_current_user");
    },

    // 初始化用户数据
    initUserData: function (username) {
        var key = "dailyfit_data_" + username;
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify({
                weight_history: [],
                checkin_history: [],
                plan_history: [],
                feedback_history: [],
                preferences: {}
            }));
        }
    },

    // 更新用户昵称
    updateNickname: function (nickname) {
        var uid = localStorage.getItem("dailyfit_current_user");
        if (!uid) return;
        var users = this.getAllUsers();
        if (users[uid]) {
            users[uid].nickname = nickname;
            this.saveAllUsers(users);
        }
    }
};

// 将 UserData 改为读取当前用户的数据
(function () {
    var originalGetAll = UserData.getAll;
    var originalSaveAll = UserData.saveAll;

    UserData.getAll = function () {
        var uid = localStorage.getItem("dailyfit_current_user");
        if (!uid) return originalGetAll.call(this);
        var key = "dailyfit_data_" + uid;
        var data = localStorage.getItem(key);
        if (!data) {
            return { weight_history: [], checkin_history: [], plan_history: [], feedback_history: [], preferences: {} };
        }
        return JSON.parse(data);
    };

    UserData.saveAll = function (data) {
        var uid = localStorage.getItem("dailyfit_current_user");
        if (!uid) { originalSaveAll.call(this, data); return; }
        var key = "dailyfit_data_" + uid;
        localStorage.setItem(key, JSON.stringify(data));
    };
})();

// 随机头像
function getRandomAvatar() {
    var avatars = ["\ud83d\ude0a", "\ud83d\ude0e", "\ud83e\udd29", "\ud83e\udd73", "\ud83d\ude0d", "\ud83e\uddd1", "\ud83d\udc66", "\ud83d\udc67", "\ud83d\udc68", "\ud83d\udc69", "\ud83e\uddd4", "\ud83d\udc74", "\ud83d\udc75"];
    return avatars[Math.floor(Math.random() * avatars.length)];
}

// 模拟多用户排行数据（注册时自动生成一些模拟好友）
function ensureMockUsers() {
    var users = AuthSystem.getAllUsers();
    var mockNames = [
        { username: "xiaoming_fit", nickname: "小明", avatar: "\ud83d\udc66" },
        { username: "xiaohong_run", nickname: "小红", avatar: "\ud83d\udc67" },
        { username: "dazhuang_gym", nickname: "大壮", avatar: "\ud83e\uddd1" },
        { username: "xiaomei_yoga", nickname: "小美", avatar: "\ud83d\udc69" },
        { username: "ajian_muscle", nickname: "阿健", avatar: "\ud83d\udc68" }
    ];

    mockNames.forEach(function (mock) {
        if (!users[mock.username]) {
            users[mock.username] = {
                username: mock.username,
                password: "1234",
                nickname: mock.nickname,
                avatar: mock.avatar,
                createdAt: "2026-07-01",
                isMock: true
            };
            // 给模拟用户生成一些打卡数据
            var mockData = {
                weight_history: [],
                checkin_history: generateMockCheckins(),
                plan_history: [],
                feedback_history: [],
                preferences: {}
            };
            localStorage.setItem("dailyfit_data_" + mock.username, JSON.stringify(mockData));
        }
    });
    AuthSystem.saveAllUsers(users);
}

function generateMockCheckins() {
    var checkins = [];
    var today = new Date();
    var days = Math.floor(Math.random() * 15) + 5;
    for (var i = 0; i < days; i++) {
        var d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        var dateStr = d.toISOString().split("T")[0];
        var meals = [];
        var exercises = [];
        if (Math.random() > 0.2) meals.push("\u65e9\u9910");
        if (Math.random() > 0.15) meals.push("\u5348\u9910");
        if (Math.random() > 0.25) meals.push("\u665a\u9910");
        if (Math.random() > 0.4) exercises.push("exercise_done");
        checkins.push({ date: dateStr, meals: meals, exercises: exercises });
    }
    return checkins;
}

// 获取所有用户排行（真实多用户数据）
function getMultiUserRanking() {
    ensureMockUsers();
    var users = AuthSystem.getAllUsers();
    var currentUid = localStorage.getItem("dailyfit_current_user");
    var ranking = [];

    Object.keys(users).forEach(function (uid) {
        var user = users[uid];
        var key = "dailyfit_data_" + uid;
        var dataStr = localStorage.getItem(key);
        var data = dataStr ? JSON.parse(dataStr) : { checkin_history: [] };

        var checkins = data.checkin_history || [];
        var recent7 = checkins.slice(-7);
        var mealTotal = 0, mealDone = 0, exDone = 0;
        recent7.forEach(function (r) {
            mealTotal += 3;
            mealDone += r.meals.length;
            if (r.exercises.length > 0) exDone++;
        });

        // 计算连续天数
        var streak = 0;
        var dates = checkins.map(function (r) { return r.date; }).sort().reverse();
        if (dates.length > 0) {
            var checkDate = new Date();
            for (var i = 0; i < 60; i++) {
                var ds = checkDate.toISOString().split("T")[0];
                if (dates.indexOf(ds) !== -1) { streak++; } else if (i > 0) { break; }
                checkDate.setDate(checkDate.getDate() - 1);
            }
        }

        ranking.push({
            name: user.nickname,
            avatar: user.avatar,
            streak: streak,
            mealRate: mealTotal > 0 ? Math.round(mealDone / mealTotal * 100) : 0,
            exerciseRate: recent7.length > 0 ? Math.round(exDone / recent7.length * 100) : 0,
            isMe: uid === currentUid
        });
    });

    ranking.sort(function (a, b) {
        return (b.streak * 2 + b.mealRate + b.exerciseRate) - (a.streak * 2 + a.mealRate + a.exerciseRate);
    });

    return ranking;
}
