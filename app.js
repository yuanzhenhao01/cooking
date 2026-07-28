document.addEventListener("DOMContentLoaded", function () {
    const pageInput = document.getElementById("pageInput");
    const pageResult = document.getElementById("pageResult");
    const pageRecipe = document.getElementById("pageRecipe");
    const pageTimer = document.getElementById("pageTimer");
    const userForm = document.getElementById("userForm");

    // 动态日期显示
    function updateDate() {
        var now = new Date();
        var weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var weekDay = weekDays[now.getDay()];
        var hours = now.getHours().toString().padStart(2, "0");
        var minutes = now.getMinutes().toString().padStart(2, "0");

        var greeting = "";
        var h = now.getHours();
        if (h < 6) greeting = "夜深了，注意休息";
        else if (h < 9) greeting = "早安，新的一天从早餐开始";
        else if (h < 11) greeting = "上午好，规划今日饮食";
        else if (h < 13) greeting = "午餐时间到了";
        else if (h < 17) greeting = "下午好，准备晚餐食材";
        else if (h < 19) greeting = "晚餐时间，吃点好的";
        else greeting = "晚上好，明天吃什么？";

        document.getElementById("dateDisplay").innerHTML =
            year + "年" + month + "月" + day + "日 " + weekDay + " " + hours + ":" + minutes +
            '<span style="margin-left:1rem;opacity:0.85;">' + greeting + '</span>';
    }
    updateDate();
    setInterval(updateDate, 30000);
    const budgetSlider = document.getElementById("budget");
    const budgetDisplay = document.getElementById("budgetDisplay");

    let currentGoal = "lose";
    let currentPlan = null;

    // 页面切换
    function showPage(page) {
        [pageInput, pageResult, pageRecipe, pageTimer].forEach(function (p) {
            p.classList.remove("active");
        });
        page.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // 预算滑块
    budgetSlider.addEventListener("input", function () {
        budgetDisplay.textContent = this.value + "元/天";
    });

    // 目标按钮
    document.querySelectorAll(".goal-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".goal-btn").forEach(function (b) { b.classList.remove("active"); });
            this.classList.add("active");
            currentGoal = this.getAttribute("data-goal");
        });
    });

    // 口味按钮（多选）
    document.querySelectorAll(".taste-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            this.classList.toggle("active");
        });
    });

    // 表单提交
    userForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var btnText = document.querySelector(".btn-text");
        var btnLoading = document.querySelector(".btn-loading");

        // 保存API Key
        var apiKeyVal = document.getElementById("apiKeyInput").value.trim();
        if (apiKeyVal) setApiKey(apiKeyVal);

        // 收集用户信息
        var userInfo = {
            age: parseInt(document.getElementById("age").value) || 25,
            height: parseInt(document.getElementById("height").value) || 170,
            weight: parseInt(document.getElementById("weight").value) || 65,
            gender: document.getElementById("gender").value,
            goal: { lose: "减脂瘦身", maintain: "维持体重", gain: "增肌增重", health: "均衡健康" }[currentGoal] || "均衡健康",
            tastes: Array.from(document.querySelectorAll(".taste-btn.active")).map(function (b) { return b.textContent; }),
            allergy: document.getElementById("allergy").value,
            budget: document.getElementById("budget").value,
            dishCounts: {
                breakfast: parseInt(document.getElementById("breakfastCount").value) || 2,
                lunch: parseInt(document.getElementById("lunchCount").value) || 3,
                dinner: parseInt(document.getElementById("dinnerCount").value) || 3
            },
            ingredients: document.getElementById("ingredients").value
        };

        // 先用本地数据秒出方案
        generatePlanLocal(userInfo);

        // 后台调用AI优化方案
        btnText.textContent = "AI优化中...";
        generateAIPlan(userInfo).then(function (plan) {
            btnText.textContent = "AI 生成今日健康方案";
            if (plan && plan.meals) {
                currentPlan = plan;
                renderResult();
                appendChatMsg("ai", "AI已优化你的方案，内容已更新！");
            }
        }).catch(function (err) {
            btnText.textContent = "AI 生成今日健康方案";
            console.warn("AI优化失败，保持本地方案:", err);
        });
    });

    // 本地生成方案（即时）
    function generatePlanLocal(userInfo) {
        var age = userInfo ? userInfo.age : (parseInt(document.getElementById("age").value) || 25);
        var dishCounts = userInfo ? userInfo.dishCounts : {
            breakfast: parseInt(document.getElementById("breakfastCount").value) || 2,
            lunch: parseInt(document.getElementById("lunchCount").value) || 3,
            dinner: parseInt(document.getElementById("dinnerCount").value) || 3
        };
        currentPlan = generateMealPlan(currentGoal, age, dishCounts);
        currentPlan.exercise = generateExercisePlan(currentGoal, age);
        renderResult();
        showPage(pageResult);
    }

    // 渲染结果页
    function renderResult() {
        // 营养概览
        document.getElementById("nutritionOverview").innerHTML =
            '<div class="nutrition-title">今日营养目标' +
            '<span style="margin-left:1rem;font-size:0.8rem;font-weight:normal;color:#888;">(' + currentPlan.ageNote + ')</span>' +
            '</div>' +
            '<div class="nutrition-grid">' +
            '<div class="nutrition-item"><div class="value">' + currentPlan.calories + '</div><div class="label">总热量(kcal)</div></div>' +
            '<div class="nutrition-item"><div class="value">' + currentPlan.protein + 'g</div><div class="label">蛋白质</div></div>' +
            '<div class="nutrition-item"><div class="value">' + currentPlan.carbs + 'g</div><div class="label">碳水</div></div>' +
            '<div class="nutrition-item"><div class="value">' + currentPlan.fat + 'g</div><div class="label">脂肪</div></div>' +
            '</div>';

        // 三餐方案
        var mealsHtml = currentPlan.meals.map(function (meal) {
            var dishesHtml = meal.dishes.map(function (dish) {
                return '<div class="dish-item" data-dish-id="' + dish.id + '">' +
                    '<span class="dish-name">' + dish.emoji + ' ' + dish.name + '</span>' +
                    '<span class="dish-arrow">' + dish.calories + 'kcal ›</span>' +
                    '</div>';
            }).join("");

            return '<div class="meal-card">' +
                '<div class="meal-header">' +
                '<h3>' + meal.emoji + ' ' + meal.name + '</h3>' +
                '<span class="meal-cal">' + meal.calories + ' kcal</span>' +
                '</div>' +
                '<div class="meal-dishes">' + dishesHtml + '</div>' +
                '</div>';
        }).join("");

        document.getElementById("mealsPlan").innerHTML = mealsHtml;

        // 采购清单
        var shoppingHtml = Object.keys(currentPlan.shoppingList).map(function (category) {
            var items = currentPlan.shoppingList[category].map(function (item) {
                return '<span class="shopping-item">' + item + '</span>';
            }).join("");
            return '<div class="shopping-category">' +
                '<h4>' + category + '</h4>' +
                '<div class="shopping-items">' + items + '</div>' +
                '</div>';
        }).join("");

        document.getElementById("shoppingList").innerHTML = shoppingHtml;

        // 饮食打卡
        var checkinHtml = '<div class="checkin-meals">' +
            currentPlan.meals.map(function (meal) {
                return '<div class="checkin-item">' +
                    '<span class="meal-name">' + meal.emoji + ' ' + meal.name + '</span>' +
                    '<button class="checkin-btn" data-meal="' + meal.name + '">打卡</button>' +
                    '</div>';
            }).join("") +
            '</div>' +
            '<div class="feedback-area">' +
            '<textarea id="feedbackText" placeholder="今天的饮食感受如何？有什么想调整的？AI会根据你的反馈优化明天的方案..."></textarea>' +
            '<button class="feedback-btn" id="feedbackBtn">提交反馈</button>' +
            '<div class="feedback-success hidden" id="feedbackSuccess">反馈已收到，AI将在明日方案中调整</div>' +
            '</div>';

        document.getElementById("checkinArea").innerHTML = checkinHtml;

        // 运动计划
        var ex = currentPlan.exercise;
        var exerciseHtml = '<div class="exercise-overview">' +
            '<div class="exercise-overview-row">' +
            '<span class="exercise-focus">' + ex.focus + '训练</span>' +
            '<span class="exercise-time">' + ex.totalTime + '</span>' +
            '<span class="exercise-cal">消耗约 ' + ex.totalCalories + ' kcal</span>' +
            '</div>' +
            '<p class="exercise-note">' + ex.note + '</p>' +
            '</div>';

        exerciseHtml += ex.sections.map(function (section) {
            if (section.items.length === 0) return '';
            var itemsHtml = section.items.map(function (item) {
                return '<div class="exercise-item" data-exercise-id="' + item.id + '">' +
                    '<div class="exercise-item-header">' +
                    '<span class="exercise-item-name">' + item.emoji + ' ' + item.name + '</span>' +
                    '<span class="exercise-item-meta">' + item.duration + ' \u00b7 ' + item.intensity + '\u5f3a\u5ea6 \u00b7 ' + item.calories + 'kcal</span>' +
                    '</div>' +
                    '<p class="exercise-item-desc">' + item.desc + '</p>' +
                    '<p class="exercise-item-start-hint">\u70b9\u51fb\u5f00\u59cb\u8ba1\u65f6 \u203a</p>' +
                    '</div>';
            }).join("");
            return '<div class="exercise-group">' +
                '<h4>' + section.emoji + ' ' + section.title + '</h4>' +
                itemsHtml +
                '</div>';
        }).join("");

        document.getElementById("exercisePlan").innerHTML = exerciseHtml;

        // 运动打卡
        var exCheckinHtml = '<div class="checkin-meals">' +
            ex.sections.map(function (section) {
                return section.items.map(function (item) {
                    return '<div class="checkin-item">' +
                        '<span class="meal-name">' + item.emoji + ' ' + item.name + '</span>' +
                        '<button class="checkin-btn exercise-checkin-btn" data-exercise="' + item.id + '">打卡</button>' +
                        '</div>';
                }).join("");
            }).join("") +
            '</div>';

        document.getElementById("exerciseCheckin").innerHTML = exCheckinHtml;

        // 绑定事件
        bindResultEvents();
    }

    // 绑定结果页事件
    function bindResultEvents() {
        // 点击菜品查看详情
        document.querySelectorAll(".dish-item").forEach(function (item) {
            item.addEventListener("click", function () {
                var dishId = this.getAttribute("data-dish-id");
                showRecipeDetail(dishId);
            });
        });

        // 点击运动项目进入计时器
        document.querySelectorAll(".exercise-item").forEach(function (item) {
            item.addEventListener("click", function () {
                var exerciseId = this.getAttribute("data-exercise-id");
                showExerciseTimer(exerciseId);
            });
        });

        // 返回按钮
        document.getElementById("backToInput").addEventListener("click", function () {
            showPage(pageInput);
        });

        // 打卡按钮（饮食+运动）
        document.querySelectorAll(".checkin-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                this.textContent = "\u5df2\u6253\u5361 \u2713";
                this.classList.add("checked");
            });
        });

        // 反馈按钮
        document.getElementById("feedbackBtn").addEventListener("click", function () {
            var text = document.getElementById("feedbackText").value.trim();
            if (text) {
                document.getElementById("feedbackSuccess").classList.remove("hidden");
                document.getElementById("feedbackText").value = "";
            }
        });

        // AI对话发送
        document.getElementById("chatSendBtn").addEventListener("click", sendChatMessage);
        document.getElementById("chatInput").addEventListener("keyup", function (e) {
            if (e.key === "Enter") sendChatMessage();
        });

        // 食材识别按钮
        document.getElementById("photoBtn").addEventListener("click", handlePhotoIdentify);
    }

    // 发送对话消息
    function sendChatMessage() {
        var input = document.getElementById("chatInput");
        var msg = input.value.trim();
        if (!msg) return;

        // 显示用户消息
        appendChatMsg("user", msg);
        input.value = "";

        // 显示loading
        appendChatMsg("ai", "AI思考中...", "loading-msg");

        chatWithAI(msg, currentPlan).then(function (result) {
            removeChatLoading();
            if (result.type === "chat") {
                appendChatMsg("ai", result.message);
            } else if (result.meals) {
                // AI返回了新方案
                currentPlan = result;
                appendChatMsg("ai", "方案已更新！页面内容已刷新。");
                renderResult();
            } else {
                appendChatMsg("ai", "收到，但我暂时无法处理这个请求，请换个说法试试。");
            }
        }).catch(function (err) {
            removeChatLoading();
            appendChatMsg("ai", "抱歉，AI暂时无法响应（" + err.message + "），请稍后再试。");
        });
    }

    function appendChatMsg(role, text, extraClass) {
        var container = document.getElementById("chatMessages");
        var cls = role === "user" ? "user-msg" : "ai-msg";
        var avatar = role === "user" ? "我" : "AI";
        var div = document.createElement("div");
        div.className = "chat-msg " + cls + (extraClass ? " " + extraClass : "");
        div.innerHTML = '<span class="chat-avatar">' + avatar + '</span><div class="chat-bubble">' + text + '</div>';
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function removeChatLoading() {
        var loading = document.querySelector(".loading-msg");
        if (loading) loading.remove();
    }

    // 食材识别
    function handlePhotoIdentify() {
        var input = document.getElementById("photoInput");
        var desc = input.value.trim();
        if (!desc) return;

        var btn = document.getElementById("photoBtn");
        btn.textContent = "AI识别中...";
        btn.disabled = true;

        identifyIngredients(desc).then(function (result) {
            btn.textContent = "AI识别并推荐";
            btn.disabled = false;
            if (result && result.meals) {
                currentPlan = result;
                renderResult();
                appendChatMsg("ai", "已根据你的食材「" + desc + "」生成了新方案，请查看上方内容！");
                // 滚动到顶部查看
                document.querySelector(".result-container").scrollIntoView({ behavior: "smooth" });
            }
        }).catch(function (err) {
            btn.textContent = "AI识别并推荐";
            btn.disabled = false;
            appendChatMsg("ai", "食材识别失败：" + err.message);
        });
    }

    // 运动计时器
    var timerInterval = null;
    var timerSeconds = 0;
    var timerRunning = false;
    var timerTotalSeconds = 0;

    function parseDuration(durationStr) {
        // 解析 "3分钟" "30分钟" "45秒" "4组×12个" 等
        var minMatch = durationStr.match(/(\d+)\s*分钟/);
        if (minMatch) return parseInt(minMatch[1]) * 60;
        var secMatch = durationStr.match(/(\d+)\s*秒/);
        if (secMatch) return parseInt(secMatch[1]);
        // 组数类型，默认给60秒/组
        var groupMatch = durationStr.match(/(\d+)\s*组/);
        if (groupMatch) return parseInt(groupMatch[1]) * 45;
        return 60; // 默认60秒
    }

    function formatTime(seconds) {
        var min = Math.floor(seconds / 60);
        var sec = seconds % 60;
        return min.toString().padStart(2, "0") + ":" + sec.toString().padStart(2, "0");
    }

    function showExerciseTimer(exerciseId) {
        var exercise = null;
        currentPlan.exercise.sections.forEach(function (section) {
            section.items.forEach(function (item) {
                if (item.id === exerciseId) exercise = item;
            });
        });
        if (!exercise) return;

        // 清除之前的计时器
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        timerRunning = false;
        timerTotalSeconds = parseDuration(exercise.duration);
        timerSeconds = timerTotalSeconds;

        var html = '<button class="back-btn" id="backFromTimer">\u2190 \u8fd4\u56de\u65b9\u6848</button>' +
            '<div class="timer-exercise-name">' + exercise.emoji + ' ' + exercise.name + '</div>' +
            '<p class="timer-exercise-desc">' + exercise.desc + '</p>' +
            '<div class="timer-display" id="timerDisplay">' +
            '<span class="timer-time" id="timerTime">' + formatTime(timerSeconds) + '</span>' +
            '</div>' +
            '<div class="timer-controls" id="timerControls">' +
            '<button class="timer-btn timer-btn-start" id="timerStart">\u5f00\u59cb</button>' +
            '<button class="timer-btn timer-btn-reset" id="timerReset">\u91cd\u7f6e</button>' +
            '</div>' +
            '<p class="timer-progress-text">\u76ee\u6807\u65f6\u957f\uff1a' + exercise.duration + ' \u00b7 \u6d88\u8017 ' + exercise.calories + ' kcal</p>';

        document.getElementById("timerContent").innerHTML = html;
        showPage(pageTimer);

        // 绑定计时器事件
        document.getElementById("backFromTimer").addEventListener("click", function () {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = null;
            timerRunning = false;
            showPage(pageResult);
        });

        document.getElementById("timerStart").addEventListener("click", function () {
            if (timerRunning) {
                // 暂停
                clearInterval(timerInterval);
                timerInterval = null;
                timerRunning = false;
                this.textContent = "\u7ee7\u7eed";
                this.className = "timer-btn timer-btn-start";
                document.getElementById("timerDisplay").className = "timer-display paused";
            } else {
                // 开始/继续
                timerRunning = true;
                this.textContent = "\u6682\u505c";
                this.className = "timer-btn timer-btn-pause";
                document.getElementById("timerDisplay").className = "timer-display running";
                timerInterval = setInterval(function () {
                    timerSeconds--;
                    document.getElementById("timerTime").textContent = formatTime(timerSeconds);
                    if (timerSeconds <= 0) {
                        clearInterval(timerInterval);
                        timerInterval = null;
                        timerRunning = false;
                        document.getElementById("timerDisplay").className = "timer-display done";
                        document.getElementById("timerTime").textContent = "\u5b8c\u6210!";
                        document.getElementById("timerControls").innerHTML =
                            '<button class="timer-btn timer-btn-done" id="timerDone">\u8fd4\u56de\u65b9\u6848</button>';
                        document.getElementById("timerDone").addEventListener("click", function () {
                            showPage(pageResult);
                        });
                    }
                }, 1000);
            }
        });

        document.getElementById("timerReset").addEventListener("click", function () {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = null;
            timerRunning = false;
            timerSeconds = timerTotalSeconds;
            document.getElementById("timerTime").textContent = formatTime(timerSeconds);
            document.getElementById("timerDisplay").className = "timer-display";
            var startBtn = document.getElementById("timerStart");
            if (startBtn) {
                startBtn.textContent = "\u5f00\u59cb";
                startBtn.className = "timer-btn timer-btn-start";
            }
        });
    }

    // 显示菜谱详情
    function showRecipeDetail(dishId) {
        var dish = null;
        currentPlan.meals.forEach(function (meal) {
            meal.dishes.forEach(function (d) {
                if (d.id === dishId) dish = d;
            });
        });
        if (!dish) return;

        var html = '<button class="back-btn" id="backToResult">\u2190 返回方案</button>' +
            '<h2>' + dish.emoji + ' ' + dish.name + '</h2>' +
            '<div class="recipe-meta">' +
            '<span>用时：' + dish.time + '</span>' +
            '<span>难度：' + dish.difficulty + '</span>' +
            '<span>热量：' + dish.calories + ' kcal</span>' +
            '</div>' +
            '<div class="nutrition-bar">' +
            '<span>蛋白质 ' + dish.protein + 'g</span>' +
            '<span>碳水 ' + dish.carbs + 'g</span>' +
            '<span>脂肪 ' + dish.fat + 'g</span>' +
            '</div>' +
            '<div class="recipe-section">' +
            '<h3>食材准备</h3>' +
            '<ul class="recipe-ingredients">' +
            dish.ingredients.map(function (i) { return '<li>' + i + '</li>'; }).join("") +
            '</ul>' +
            '</div>' +
            '<div class="recipe-section">' +
            '<h3>做法步骤</h3>' +
            '<ol class="recipe-steps">' +
            dish.steps.map(function (s) { return '<li>' + s + '</li>'; }).join("") +
            '</ol>' +
            '</div>' +
            '<div class="recipe-section">' +
            '<h3>小贴士</h3>' +
            '<div class="recipe-tips"><ul>' +
            dish.tips.map(function (t) { return '<li>' + t + '</li>'; }).join("") +
            '</ul></div>' +
            '</div>';

        document.getElementById("recipeDetailContent").innerHTML = html;
        showPage(pageRecipe);

        document.getElementById("backToResult").addEventListener("click", function () {
            showPage(pageResult);
        });
    }
});
