document.addEventListener("DOMContentLoaded", function () {
    const recipeList = document.getElementById("recipeList");
    const recipeDetail = document.getElementById("recipeDetail");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const categoryBtns = document.querySelectorAll(".cat-btn");

    let currentCategory = "all";

    function renderList(filteredRecipes) {
        recipeDetail.classList.add("hidden");
        recipeList.classList.remove("hidden");

        if (filteredRecipes.length === 0) {
            recipeList.innerHTML = '<div class="no-result">没有找到相关菜谱，换个关键词试试吧</div>';
            return;
        }

        recipeList.innerHTML = filteredRecipes.map(function (r) {
            return '<div class="recipe-card" data-id="' + r.id + '">' +
                '<div class="emoji">' + r.emoji + '</div>' +
                '<h3>' + r.name + '</h3>' +
                '<div class="meta">' +
                '<span>' + r.time + '</span>' +
                '<span>' + r.difficulty + '</span>' +
                '<span>' + r.servings + '</span>' +
                '</div>' +
                '<div class="tags">' +
                r.category.map(function (c) {
                    return '<span class="tag">' + getCategoryName(c) + '</span>';
                }).join("") +
                '</div>' +
                '</div>';
        }).join("");

        document.querySelectorAll(".recipe-card").forEach(function (card) {
            card.addEventListener("click", function () {
                var id = parseInt(this.getAttribute("data-id"));
                showDetail(id);
            });
        });
    }

    function getCategoryName(key) {
        var map = {
            quick: "快手菜",
            meat: "荤菜",
            veg: "素菜",
            soup: "汤粥",
            staple: "主食",
            breakfast: "早餐",
            diet: "减脂餐",
            cold: "凉菜",
            rice: "下饭菜"
        };
        return map[key] || key;
    }

    function showDetail(id) {
        var recipe = recipes.find(function (r) { return r.id === id; });
        if (!recipe) return;

        recipeList.classList.add("hidden");
        recipeDetail.classList.remove("hidden");

        recipeDetail.innerHTML =
            '<button class="back-btn" id="backBtn">\u2190 返回列表</button>' +
            '<div class="detail-header">' +
            '<h2>' + recipe.emoji + ' ' + recipe.name + '</h2>' +
            '<div class="detail-meta">' +
            '<span>用时：' + recipe.time + '</span>' +
            '<span>难度：' + recipe.difficulty + '</span>' +
            '<span>份量：' + recipe.servings + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="detail-section">' +
            '<h3>食材准备</h3>' +
            '<ul class="ingredients-list">' +
            recipe.ingredients.map(function (i) { return '<li>' + i + '</li>'; }).join("") +
            '</ul>' +
            '</div>' +
            '<div class="detail-section">' +
            '<h3>做法步骤</h3>' +
            '<ol class="steps-list">' +
            recipe.steps.map(function (s) { return '<li>' + s + '</li>'; }).join("") +
            '</ol>' +
            '</div>' +
            '<div class="detail-section">' +
            '<h3>小贴士</h3>' +
            '<div class="tips-box"><ul>' +
            recipe.tips.map(function (t) { return '<li>' + t + '</li>'; }).join("") +
            '</ul></div>' +
            '</div>';

        recipeDetail.scrollIntoView({ behavior: "smooth", block: "start" });

        document.getElementById("backBtn").addEventListener("click", function () {
            filterAndRender();
        });
    }

    function filterAndRender() {
        var keyword = searchInput.value.trim().toLowerCase();
        var filtered = recipes.filter(function (r) {
            var matchCategory = currentCategory === "all" || r.category.indexOf(currentCategory) !== -1;
            var matchKeyword = !keyword ||
                r.name.toLowerCase().indexOf(keyword) !== -1 ||
                r.ingredients.some(function (i) { return i.toLowerCase().indexOf(keyword) !== -1; });
            return matchCategory && matchKeyword;
        });
        renderList(filtered);
    }

    categoryBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            categoryBtns.forEach(function (b) { b.classList.remove("active"); });
            this.classList.add("active");
            currentCategory = this.getAttribute("data-category");
            filterAndRender();
        });
    });

    searchBtn.addEventListener("click", filterAndRender);
    searchInput.addEventListener("keyup", function (e) {
        if (e.key === "Enter") filterAndRender();
    });
    searchInput.addEventListener("input", function () {
        if (this.value === "") filterAndRender();
    });

    // 初始渲染
    filterAndRender();
});
