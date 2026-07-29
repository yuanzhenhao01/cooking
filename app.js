document.addEventListener("DOMContentLoaded", function () {
    const pageAuth = document.getElementById("pageAuth");
    const pageInput = document.getElementById("pageInput");
    const pageResult = document.getElementById("pageResult");
    const pageRecipe = document.getElementById("pageRecipe");
    const pageTimer = document.getElementById("pageTimer");
    const pageReport = document.getElementById("pageReport");
    const pageSocial = document.getElementById("pageSocial");
    const userForm = document.getElementById("userForm");

    // 页面切换
    function showPage(page) {
        [pageAuth, pageInput, pageResult, pageRecipe, pageTimer, pageReport, pageSocial].forEach(function (p) {
            p.classList.remove("active");
        });
        page.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // ========== 登录/注册逻辑 ==========
    function updateUserBar() {
        var user = AuthSystem.getCurrentUser();
        var bar = document.getElementById("userBar");
        if (user) {
            bar.innerHTML = '<span class="user-bar-info">' + user.avatar + ' ' + user.nickname + '</span><button class="user-bar-logout" id="logoutBtn">退出</button>';
            bar.classList.add("visible");
            document.getElementById("logoutBtn").addEventListener("click", function () {
                AuthSystem.logout();
                updateUserBar();
                showPage(pageAuth);
            });
        } else {
            bar.innerHTML = '<button class="user-bar-login" id="goLoginBtn">登录/注册</button>';
            bar.classList.add("visible");
            document.getElementById("goLoginBtn").addEventListener("click", function () {
                showPage(pageAuth);
            });
        }
    }

    // 初始化：检查登录状态
    updateUserBar();
    if (AuthSystem.isLoggedIn()) {
        showPage(pageInput);
    } else {
        showPage(pageAuth);
    }

    // 登录/注册 Tab 切换
    document.querySelectorAll(".auth-tab").forEach(function (tab) {
        tab.addEventListener("click", function () {
            document.querySelectorAll(".auth-tab").forEach(function (t) { t.classList.remove("active"); });
            this.classList.add("active");
            var target = this.getAttribute("data-tab");
            document.getElementById("loginForm").classList.toggle("hidden", target !== "login");
            document.getElementById("registerForm").classList.toggle("hidden", target !== "register");
        });
    });

    // 登录
    document.getElementById("loginBtn").addEventListener("click", function () {
        var username = document.getElementById("loginUsername").value.trim();
        var password = document.getElementById("loginPassword").value;
        var result = AuthSystem.login(username, password);
        document.getElementById("loginMsg").textContent = result.msg;
        document.getElementById("loginMsg").style.color = result.success ? "#52c41a" : "#ff4d4f";
        if (result.success) {
            updateUserBar();
            showPage(pageInput);
        }
    });

    // 注册
    document.getElementById("registerBtn").addEventListener("click", function () {
        var username = document.getElementById("regUsername").value.trim();
        var nickname = document.getElementById("regNickname").value.trim();
        var password = document.getElementById("regPassword").value;
        var result = AuthSystem.register(username, password, nickname);
        document.getElementById("regMsg").textContent = result.msg;
        document.getElementById("regMsg").style.color = result.success ? "#52c41a" : "#ff4d4f";
        if (result.success) {
            updateUserBar();
            showPage(pageInput);
        }
    });

    // 跳过登录
    document.getElementById("skipAuthBtn").addEventListener("click", function () {
        showPage(pageInput);
    });
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
    let currentSpecial = "none";
    let currentPlan = null;

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

    // 特殊时期按钮（单选）
    document.querySelectorAll(".special-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".special-btn").forEach(function (b) { b.classList.remove("active"); });
            this.classList.add("active");
            currentSpecial = this.getAttribute("data-special");
        });
    });

    // 家庭模式
    document.getElementById("familyModeToggle").addEventListener("change", function () {
        document.getElementById("familyMembers").classList.toggle("hidden", !this.checked);
    });

    document.getElementById("addMemberBtn").addEventListener("click", function () {
        var row = document.createElement("div");
        row.className = "family-member-row";
        row.innerHTML = '<input type="text" placeholder="称呼(如:妈妈)" class="fm-name"><input type="number" placeholder="年龄" class="fm-age"><input type="text" placeholder="特殊需求(可选)" class="fm-note"><button type="button" class="remove-member-btn">\u00d7</button>';
        document.getElementById("familyMemberList").appendChild(row);
        row.querySelector(".remove-member-btn").addEventListener("click", function () { row.remove(); });
    });

    function getFamilyMembers() {
        if (!document.getElementById("familyModeToggle").checked) return [];
        var members = [];
        document.querySelectorAll(".family-member-row").forEach(function (row) {
            var name = row.querySelector(".fm-name").value.trim();
            var age = row.querySelector(".fm-age").value.trim();
            var note = row.querySelector(".fm-note").value.trim();
            if (name || age) {
                members.push({ name: name || "家人", age: age || "未知", note: note });
            }
        });
        return members;
    }

    // 表单提交（一键生成饮食+运动）
    userForm.addEventListener("submit", function (e) {
        e.preventDefault();
        handleGenerate("all");
    });

    // 单独生成饮食
    document.getElementById("generateDietBtn").addEventListener("click", function () {
        handleGenerate("diet");
    });

    // 单独生成运动
    document.getElementById("generateExBtn").addEventListener("click", function () {
        handleGenerate("exercise");
    });

    function handleGenerate(mode) {
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
            special: currentSpecial,
            family: getFamilyMembers(),
            dishCounts: {
                breakfast: parseInt(document.getElementById("breakfastCount").value) || 2,
                lunch: parseInt(document.getElementById("lunchCount").value) || 3,
                dinner: parseInt(document.getElementById("dinnerCount").value) || 3
            },
            ingredients: document.getElementById("ingredients").value,
            mode: mode
        };

        // 选择对应按钮的loading状态
        var btnTextEl, btnLoadingEl;
        if (mode === "diet") {
            btnTextEl = document.querySelector(".btn-text-diet");
            btnLoadingEl = document.querySelector(".btn-loading-diet");
        } else if (mode === "exercise") {
            btnTextEl = document.querySelector(".btn-text-ex");
            btnLoadingEl = document.querySelector(".btn-loading-ex");
        } else {
            btnTextEl = document.querySelector(".btn-text");
            btnLoadingEl = document.querySelector(".btn-loading");
        }

        if (getApiKey()) {
            btnTextEl.classList.add("hidden");
            btnLoadingEl.classList.remove("hidden");
            startLoadingAnimation();
            generateAIPlan(userInfo).then(function (plan) {
                stopLoadingAnimation();
                btnTextEl.classList.remove("hidden");
                btnLoadingEl.classList.add("hidden");
                if (plan && plan.meals && Array.isArray(plan.meals)) {
                    if (mode === "diet") {
                        // 只更新饮食部分，保留现有运动
                        currentPlan = currentPlan || {};
                        currentPlan.calories = plan.calories;
                        currentPlan.protein = plan.protein;
                        currentPlan.carbs = plan.carbs;
                        currentPlan.fat = plan.fat;
                        currentPlan.ageNote = plan.ageNote;
                        currentPlan.meals = plan.meals;
                        currentPlan.shoppingList = plan.shoppingList;
                        if (!currentPlan.exercise) {
                            currentPlan.exercise = generateExercisePlan(currentGoal, userInfo.age);
                        }
                    } else if (mode === "exercise" && plan.exercise) {
                        // 只更新运动部分，保留现有饮食
                        if (!currentPlan || !currentPlan.meals) {
                            currentPlan = generateMealPlan(currentGoal, userInfo.age, userInfo.dishCounts);
                        }
                        currentPlan.exercise = plan.exercise;
                    } else {
                        currentPlan = plan;
                    }
                    renderResult();
                    showPage(pageResult);
                } else {
                    generatePlanLocal(userInfo, mode);
                }
            }).catch(function (err) {
                stopLoadingAnimation();
                btnTextEl.classList.remove("hidden");
                btnLoadingEl.classList.add("hidden");
                console.warn("AI生成失败，使用本地方案:", err);
                generatePlanLocal(userInfo, mode);
            });
        } else {
            generatePlanLocal(userInfo, mode);
        }
    }

    // 加载动画
    var loadingInterval = null;
    var loadingStep = 0;
    var loadingSteps = [
        "分析你的身体数据...",
        "规划营养搭配...",
        "挑选适合的菜品...",
        "制定运动计划...",
        "生成采购清单...",
        "最终优化中..."
    ];

    function startLoadingAnimation() {
        loadingStep = 0;
        updateLoadingText();
        loadingInterval = setInterval(function () {
            loadingStep = (loadingStep + 1) % loadingSteps.length;
            updateLoadingText();
        }, 2000);
    }

    function stopLoadingAnimation() {
        if (loadingInterval) {
            clearInterval(loadingInterval);
            loadingInterval = null;
        }
    }

    function updateLoadingText() {
        var el = document.querySelector(".loading-text");
        if (el) el.textContent = loadingSteps[loadingStep];
    }

    // 本地生成方案（即时）
    function generatePlanLocal(userInfo, mode) {
        var age = userInfo ? userInfo.age : (parseInt(document.getElementById("age").value) || 25);
        var dishCounts = userInfo ? userInfo.dishCounts : {
            breakfast: parseInt(document.getElementById("breakfastCount").value) || 2,
            lunch: parseInt(document.getElementById("lunchCount").value) || 3,
            dinner: parseInt(document.getElementById("dinnerCount").value) || 3
        };

        if (mode === "diet") {
            var mealPlan = generateMealPlan(currentGoal, age, dishCounts);
            currentPlan = currentPlan || {};
            currentPlan.calories = mealPlan.calories;
            currentPlan.protein = mealPlan.protein;
            currentPlan.carbs = mealPlan.carbs;
            currentPlan.fat = mealPlan.fat;
            currentPlan.ageNote = mealPlan.ageNote;
            currentPlan.meals = mealPlan.meals;
            currentPlan.shoppingList = mealPlan.shoppingList;
            if (!currentPlan.exercise) {
                currentPlan.exercise = generateExercisePlan(currentGoal, age);
            }
        } else if (mode === "exercise") {
            if (!currentPlan || !currentPlan.meals) {
                currentPlan = generateMealPlan(currentGoal, age, dishCounts);
            }
            currentPlan.exercise = generateExercisePlan(currentGoal, age);
        } else {
            currentPlan = generateMealPlan(currentGoal, age, dishCounts);
            currentPlan.exercise = generateExercisePlan(currentGoal, age);
        }

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
                // 持久化打卡记录
                var mealName = this.getAttribute("data-meal");
                var exerciseId = this.getAttribute("data-exercise");
                if (mealName) UserData.logCheckin("meal", mealName);
                if (exerciseId) UserData.logCheckin("exercise", exerciseId);
            });
        });

        // 反馈按钮
        document.getElementById("feedbackBtn").addEventListener("click", function () {
            var text = document.getElementById("feedbackText").value.trim();
            if (text) {
                document.getElementById("feedbackSuccess").classList.remove("hidden");
                document.getElementById("feedbackText").value = "";
                UserData.logFeedback(text);
            }
        });

        // 体重记录
        document.getElementById("weightLogBtn").addEventListener("click", function () {
            var w = parseFloat(document.getElementById("weightLogInput").value);
            if (w && w > 20 && w < 300) {
                UserData.logWeight(w);
                document.getElementById("weightLogInput").value = "";
                this.textContent = "已记录 \u2713";
                var self = this;
                setTimeout(function () { self.textContent = "记录体重"; }, 2000);
            }
        });

        // 查看报告按钮
        document.getElementById("showReportBtn").addEventListener("click", function () {
            showReport();
        });

        // 社交中心按钮
        document.getElementById("showSocialBtn").addEventListener("click", function () {
            showSocial();
        });

        // 导出采购清单
        document.getElementById("exportListBtn").addEventListener("click", function () {
            var text = "\u3010\u6bcf\u65e5fit \u91c7\u8d2d\u6e05\u5355\u3011\n";
            Object.keys(currentPlan.shoppingList).forEach(function (cat) {
                text += "\n\u25b6 " + cat + "\n";
                currentPlan.shoppingList[cat].forEach(function (item) {
                    text += "  \u2022 " + item + "\n";
                });
            });
            navigator.clipboard.writeText(text).then(function () {
                document.getElementById("exportListBtn").textContent = "\u2713 \u5df2\u590d\u5236\u5230\u526a\u8d34\u677f";
                setTimeout(function () {
                    document.getElementById("exportListBtn").textContent = "\ud83d\udccb \u4e00\u952e\u590d\u5236\u91c7\u8d2d\u6e05\u5355";
                }, 2000);
            });
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
            } else if ((result.type === "plan" || result.meals) && Array.isArray(result.meals)) {
                // AI返回了有效的新方案，先显示回复再更新
                var reply = result.reply || "\u65b9\u6848\u5df2\u6839\u636e\u4f60\u7684\u8981\u6c42\u66f4\u65b0\uff01";
                appendChatMsg("ai", reply);
                currentPlan = result;
                setTimeout(function () { renderResult(); }, 500);
            } else if (typeof result === "object" && result.message) {
                appendChatMsg("ai", result.message);
            } else if (typeof result === "object" && result.reply) {
                // 有回复但方案格式不完整，只显示回复
                appendChatMsg("ai", result.reply);
            } else {
                appendChatMsg("ai", "\u6536\u5230\uff0c\u4f46\u6211\u6682\u65f6\u65e0\u6cd5\u5904\u7406\u8fd9\u4e2a\u8bf7\u6c42\uff0c\u8bf7\u6362\u4e2a\u8bf4\u6cd5\u8bd5\u8bd5\u3002");
            }
        }).catch(function (err) {
            removeChatLoading();
            appendChatMsg("ai", "抱歉，AI暂时无法响应（" + err.message + "），请稍后再试。");
        });
    }

    function appendChatMsg(role, text, extraClass) {
        var container = document.getElementById("chatMessages");
        var cls = role === "user" ? "user-msg" : "ai-msg";
        var avatar = role === "user" ? "\u6211" : "AI";
        // 如果text还是JSON字符串，尝试提取message
        if (typeof text === "string" && text.indexOf('"type"') !== -1 && text.indexOf('"message"') !== -1) {
            try {
                var obj = JSON.parse(text);
                if (obj.message) text = obj.message;
            } catch (e) {
                // 尝试正则提取
                var m = text.match(/"message"\s*:\s*"([\s\S]*?)"\s*\}?\s*$/);
                if (m) text = m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
            }
        }
        // 简单格式化：换行 + markdown粗体 + emoji序号
        var formatted = text
            .replace(/\\n/g, "\n")
            .replace(/\n/g, "<br>")
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        var div = document.createElement("div");
        div.className = "chat-msg " + cls + (extraClass ? " " + extraClass : "");
        div.innerHTML = '<span class="chat-avatar">' + avatar + '</span><div class="chat-bubble">' + formatted + '</div>';
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

    // ========== 社交中心 ==========
    function showSocial() {
        var unlocked = AchievementSystem.getUnlocked();
        var nextGoals = AchievementSystem.getNextGoals();
        var ranking = getMultiUserRanking();
        var shareData = ShareCard.generate();
        var stats = AchievementSystem.getStats();

        var html = '<button class="back-btn" id="backFromSocial">\u2190 \u8fd4\u56de\u65b9\u6848</button>' +
            '<h2>\ud83c\udf1f \u793e\u4ea4\u4e2d\u5fc3</h2>';

        // 成就徽章
        html += '<div class="social-section">' +
            '<h3>\ud83c\udfc5 \u6211\u7684\u6210\u5c31 <span style="font-size:0.85rem;color:#888;">(\u5df2\u89e3\u9501 ' + unlocked.length + '/' + AchievementSystem.badges.length + ')</span></h3>' +
            '<div class="badges-grid">';

        AchievementSystem.badges.forEach(function (badge) {
            var isUnlocked = unlocked.some(function (u) { return u.id === badge.id; });
            html += '<div class="badge-item ' + (isUnlocked ? "unlocked" : "locked") + '">' +
                '<span class="badge-icon">' + badge.icon + '</span>' +
                '<span class="badge-name">' + badge.name + '</span>' +
                '<span class="badge-desc">' + badge.desc + '</span>' +
                '</div>';
        });

        html += '</div>';

        // 下一个目标
        if (nextGoals.length > 0) {
            html += '<div class="next-goals"><h4>\ud83c\udfaf \u4e0b\u4e00\u4e2a\u76ee\u6807</h4><div class="goals-list">';
            nextGoals.forEach(function (g) {
                html += '<div class="goal-item"><span>' + g.icon + ' ' + g.name + '</span><span class="goal-desc">' + g.desc + '</span></div>';
            });
            html += '</div></div>';
        }
        html += '</div>';

        // 排行榜
        html += '<div class="social-section">' +
            '<h3>\ud83c\udfc6 \u6253\u5361\u6392\u884c\u699c</h3>' +
            '<div class="leaderboard">';

        ranking.forEach(function (user, idx) {
            var medal = idx === 0 ? "\ud83e\udd47" : idx === 1 ? "\ud83e\udd48" : idx === 2 ? "\ud83e\udd49" : (idx + 1) + "";
            html += '<div class="rank-item ' + (user.isMe ? "rank-me" : "") + '">' +
                '<span class="rank-pos">' + medal + '</span>' +
                '<span class="rank-avatar">' + user.avatar + '</span>' +
                '<span class="rank-name">' + user.name + '</span>' +
                '<div class="rank-stats">' +
                '<span>\ud83d\udd25' + user.streak + '\u5929</span>' +
                '<span>\ud83c\udf5a' + user.mealRate + '%</span>' +
                '<span>\ud83c\udfcb\ufe0f' + user.exerciseRate + '%</span>' +
                '</div>' +
                '</div>';
        });

        html += '</div></div>';

        // 分享卡片
        html += '<div class="social-section">' +
            '<h3>\ud83d\udcf1 \u5206\u4eab\u6211\u7684\u6210\u7ee9</h3>' +
            '<div class="share-card">' +
            '<div class="share-card-inner">' +
            '<div class="share-header">\u6bcf\u65e5fit \u00b7 \u4eca\u65e5\u6253\u5361</div>' +
            '<div class="share-date">' + shareData.date + '</div>' +
            '<div class="share-stats-row">' +
            '<div class="share-stat"><div class="share-stat-val">\ud83d\udd25 ' + shareData.streak + '</div><div class="share-stat-lbl">\u8fde\u7eed\u5929\u6570</div></div>' +
            '<div class="share-stat"><div class="share-stat-val">\ud83c\udf5a ' + shareData.mealRate + '%</div><div class="share-stat-lbl">\u996e\u98df</div></div>' +
            '<div class="share-stat"><div class="share-stat-val">\ud83c\udfcb\ufe0f ' + shareData.exerciseRate + '%</div><div class="share-stat-lbl">\u8fd0\u52a8</div></div>' +
            '<div class="share-stat"><div class="share-stat-val">' + shareData.weightTrend + '</div><div class="share-stat-lbl">\u4f53\u91cd</div></div>' +
            '</div>' +
            '<div class="share-badges">\ud83c\udfc5 ' + shareData.badgeCount + ' \u4e2a\u6210\u5c31 ' + shareData.badges + '</div>' +
            '</div>' +
            '<button class="share-btn" id="copyShareBtn">\ud83d\udccb \u590d\u5236\u5206\u4eab\u6587\u6848</button>' +
            '</div></div>';

        document.getElementById("socialContent").innerHTML = html;
        showPage(pageSocial);

        // 绑定事件
        document.getElementById("backFromSocial").addEventListener("click", function () {
            showPage(pageResult);
        });

        document.getElementById("copyShareBtn").addEventListener("click", function () {
            var text = "\u3010\u6bcf\u65e5fit \u6253\u5361\u3011\n" +
                "\ud83d\udd25 \u8fde\u7eed\u6253\u5361 " + shareData.streak + " \u5929\n" +
                "\ud83c\udf5a \u996e\u98df\u5b8c\u6210\u7387 " + shareData.mealRate + "%\n" +
                "\ud83c\udfcb\ufe0f \u8fd0\u52a8\u5b8c\u6210\u7387 " + shareData.exerciseRate + "%\n" +
                "\ud83c\udfc5 \u5df2\u89e3\u9501 " + shareData.badgeCount + " \u4e2a\u6210\u5c31\n" +
                "\u4e00\u8d77\u6765\u6bcf\u65e5fit\uff0c\u5403\u5f97\u5bf9\u3001\u7ec3\u5f97\u597d\uff01";
            navigator.clipboard.writeText(text).then(function () {
                document.getElementById("copyShareBtn").textContent = "\u2713 \u5df2\u590d\u5236";
                setTimeout(function () {
                    document.getElementById("copyShareBtn").textContent = "\ud83d\udccb \u590d\u5236\u5206\u4eab\u6587\u6848";
                }, 2000);
            });
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
            dish.steps.map(function (s) {
                // 检测步骤中是否有时间，添加计时器按钮
                var timeMatch = s.match(/(\d+)\s*分钟/);
                if (timeMatch) {
                    return '<li>' + s + ' <button class="step-timer-btn" data-minutes="' + timeMatch[1] + '">\u23f0 ' + timeMatch[1] + '\u5206\u949f</button></li>';
                }
                return '<li>' + s + '</li>';
            }).join("") +
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

        // 厨房计时器按钮
        document.querySelectorAll(".step-timer-btn").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                var minutes = parseInt(this.getAttribute("data-minutes"));
                startKitchenTimer(minutes, this);
            });
        });
    }

    // 厨房定时器
    function startKitchenTimer(minutes, btn) {
        var seconds = minutes * 60;
        var originalText = btn.textContent;
        btn.disabled = true;
        btn.classList.add("timer-active");

        var interval = setInterval(function () {
            seconds--;
            var m = Math.floor(seconds / 60);
            var s = seconds % 60;
            btn.textContent = "\u23f0 " + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
            if (seconds <= 0) {
                clearInterval(interval);
                btn.textContent = "\u2705 \u65f6\u95f4\u5230!";
                btn.classList.remove("timer-active");
                btn.classList.add("timer-done");
                // 提醒
                if (Notification.permission === "granted") {
                    new Notification("\u6bcf\u65e5fit \u53a8\u623f\u8ba1\u65f6\u5668", { body: minutes + "\u5206\u949f\u5230\u4e86\uff01" });
                }
                setTimeout(function () {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.classList.remove("timer-done");
                }, 5000);
            }
        }, 1000);
    }

    // ========== 健康报告 ==========
    function showReport() {
        var weekly = UserData.getWeeklyReport();
        var monthly = UserData.getMonthlyReport();
        var weightTrend = UserData.getWeightTrend();

        var html = '<button class="back-btn" id="backFromReport">\u2190 \u8fd4\u56de\u65b9\u6848</button>' +
            '<h2>\ud83d\udcca \u5065\u5eb7\u62a5\u544a</h2>' +
            '<div class="report-tabs">' +
            '<button class="report-tab active" data-tab="weekly">\u5468\u62a5</button>' +
            '<button class="report-tab" data-tab="monthly">\u6708\u62a5</button>' +
            '</div>';

        // 周报
        html += '<div class="report-panel" id="weeklyPanel">' +
            '<h3>\ud83d\udcc5 \u672c\u5468\u6982\u89c8 <span style="font-size:0.8rem;color:#888;">(' + weekly.period + ')</span></h3>' +
            '<div class="report-stats">' +
            '<div class="stat-card"><div class="stat-value">' + weekly.daysTracked + '</div><div class="stat-label">\u6253\u5361\u5929\u6570</div></div>' +
            '<div class="stat-card"><div class="stat-value">' + weekly.mealRate + '%</div><div class="stat-label">\u996e\u98df\u5b8c\u6210\u7387</div></div>' +
            '<div class="stat-card"><div class="stat-value">' + weekly.exerciseRate + '%</div><div class="stat-label">\u8fd0\u52a8\u5b8c\u6210\u7387</div></div>' +
            '<div class="stat-card"><div class="stat-value">' + (weekly.weightChange > 0 ? "+" : "") + weekly.weightChange + 'kg</div><div class="stat-label">\u4f53\u91cd\u53d8\u5316</div></div>' +
            '</div>';

        // 体重曲线（简易柱状图）
        if (weekly.weights.length > 0) {
            html += '<div class="chart-section"><h4>\u4f53\u91cd\u8d8b\u52bf</h4><div class="weight-chart">';
            var maxW = Math.max.apply(null, weekly.weights.map(function (w) { return w.weight; }));
            var minW = Math.min.apply(null, weekly.weights.map(function (w) { return w.weight; }));
            var range = maxW - minW || 1;
            weekly.weights.forEach(function (w) {
                var pct = ((w.weight - minW) / range) * 60 + 30;
                html += '<div class="weight-bar-wrap"><div class="weight-bar" style="height:' + pct + '%"></div><span class="weight-bar-label">' + w.weight + '</span><span class="weight-bar-date">' + w.date.slice(5) + '</span></div>';
            });
            html += '</div></div>';
        }

        // 打卡详情
        html += '<div class="chart-section"><h4>\u6253\u5361\u660e\u7ec6</h4><div class="checkin-chart">';
        if (weekly.daysTracked === 0) {
            html += '<p style="color:#999;">\u672c\u5468\u8fd8\u6ca1\u6709\u6253\u5361\u8bb0\u5f55\uff0c\u5f00\u59cb\u6253\u5361\u5427\uff01</p>';
        } else {
            html += '<p>\ud83c\udf5a \u996e\u98df\u6253\u5361 ' + weekly.mealsCompleted + ' \u9910 / ' + (weekly.daysTracked * 3) + ' \u9910</p>';
            html += '<div class="progress-bar"><div class="progress-fill" style="width:' + weekly.mealRate + '%"></div></div>';
            html += '<p>\ud83c\udfcb\ufe0f \u8fd0\u52a8\u6253\u5361 ' + weekly.exerciseDays + ' \u5929 / ' + weekly.daysTracked + ' \u5929</p>';
            html += '<div class="progress-bar"><div class="progress-fill progress-green" style="width:' + weekly.exerciseRate + '%"></div></div>';
        }
        html += '</div></div>';

        html += '</div>'; // end weeklyPanel

        // 月报
        html += '<div class="report-panel hidden" id="monthlyPanel">' +
            '<h3>\ud83d\udcc6 \u672c\u6708\u6982\u89c8 <span style="font-size:0.8rem;color:#888;">(' + monthly.period + ')</span></h3>' +
            '<div class="report-stats">' +
            '<div class="stat-card"><div class="stat-value">' + monthly.daysTracked + '</div><div class="stat-label">\u6253\u5361\u5929\u6570</div></div>' +
            '<div class="stat-card"><div class="stat-value">' + monthly.mealRate + '%</div><div class="stat-label">\u996e\u98df\u5b8c\u6210\u7387</div></div>' +
            '<div class="stat-card"><div class="stat-value">' + monthly.exerciseRate + '%</div><div class="stat-label">\u8fd0\u52a8\u5b8c\u6210\u7387</div></div>' +
            '<div class="stat-card"><div class="stat-value">' + (monthly.weightChange > 0 ? "+" : "") + monthly.weightChange + 'kg</div><div class="stat-label">\u4f53\u91cd\u53d8\u5316</div></div>' +
            '</div>';

        if (monthly.weights.length > 0) {
            html += '<div class="chart-section"><h4>\u4f53\u91cd\u8d8b\u52bf\uff0830\u5929\uff09</h4><div class="weight-chart">';
            var maxM = Math.max.apply(null, monthly.weights.map(function (w) { return w.weight; }));
            var minM = Math.min.apply(null, monthly.weights.map(function (w) { return w.weight; }));
            var rangeM = maxM - minM || 1;
            monthly.weights.forEach(function (w) {
                var pct = ((w.weight - minM) / rangeM) * 60 + 30;
                html += '<div class="weight-bar-wrap"><div class="weight-bar" style="height:' + pct + '%"></div><span class="weight-bar-label">' + w.weight + '</span><span class="weight-bar-date">' + w.date.slice(5) + '</span></div>';
            });
            html += '</div></div>';
        }

        html += '</div>'; // end monthlyPanel

        // AI建议
        var aiAdvice = "";
        var rate = UserData.getCheckinRate(7);
        if (rate.meal < 50) aiAdvice += "\u2022 \u996e\u98df\u6267\u884c\u7387\u504f\u4f4e\uff0c\u5efa\u8bae\u9009\u62e9\u66f4\u7b80\u5355\u5feb\u624b\u7684\u83dc\u8c31<br>";
        if (rate.exercise < 30) aiAdvice += "\u2022 \u8fd0\u52a8\u5b8c\u6210\u7387\u4e0d\u8db3\uff0c\u5efa\u8bae\u964d\u4f4e\u8fd0\u52a8\u5f3a\u5ea6\u548c\u65f6\u957f<br>";
        if (weightTrend.trend === "gaining" && weightTrend.change > 1) aiAdvice += "\u2022 \u4f53\u91cd\u6709\u4e0a\u5347\u8d8b\u52bf\uff0c\u5efa\u8bae\u9002\u5f53\u63a7\u5236\u70ed\u91cf\u6444\u5165<br>";
        if (weightTrend.trend === "losing" && weightTrend.change < -2) aiAdvice += "\u2022 \u4f53\u91cd\u4e0b\u964d\u8f83\u5feb\uff0c\u6ce8\u610f\u4fdd\u8bc1\u57fa\u7840\u8425\u517b\u6444\u5165<br>";
        if (!aiAdvice) aiAdvice = "\u2022 \u7ee7\u7eed\u4fdd\u6301\u5f53\u524d\u8282\u594f\uff0c\u4f60\u505a\u5f97\u5f88\u597d\uff01";

        html += '<div class="ai-advice-section"><h4>\ud83e\udd16 AI \u5efa\u8bae</h4><p>' + aiAdvice + '</p></div>';

        document.getElementById("reportContent").innerHTML = html;
        showPage(pageReport);

        // 绑定报告页事件
        document.getElementById("backFromReport").addEventListener("click", function () {
            showPage(pageResult);
        });

        document.querySelectorAll(".report-tab").forEach(function (tab) {
            tab.addEventListener("click", function () {
                document.querySelectorAll(".report-tab").forEach(function (t) { t.classList.remove("active"); });
                this.classList.add("active");
                var target = this.getAttribute("data-tab");
                document.getElementById("weeklyPanel").classList.toggle("hidden", target !== "weekly");
                document.getElementById("monthlyPanel").classList.toggle("hidden", target !== "monthly");
            });
        });
    }
});
