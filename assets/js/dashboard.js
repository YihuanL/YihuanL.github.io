// 仪表板页面JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 检查用户认证状态
    const authStatus = authUtils.checkAuthStatus();
    if (!authStatus.isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }
    
    // 初始化仪表板
    initDashboard();
});

// 初始化仪表板
function initDashboard() {
    // 加载统计数据
    loadStatistics();
    
    // 初始化图表
    initCharts();
    
    // 加载最近活动
    loadRecentActivities();
    
    // 加载热门文章
    loadPopularArticles();
    
    // 加载文章表格
    loadArticlesTable();
    
    // 初始化搜索和筛选
    initSearchAndFilter();
    
    // 初始化批量操作
    initBulkActions();
    
    // 初始化分页
    initPagination();
    
    // 更新用户头像
    updateUserAvatar();
}

// 加载统计数据
async function loadStatistics() {
    try {
        // 模拟API请求
        const stats = await mockGetStatistics();
        
        // 更新统计卡片
        document.getElementById('total-articles').textContent = stats.totalArticles;
        document.getElementById('total-views').textContent = formatNumber(stats.totalViews);
        document.getElementById('total-comments').textContent = stats.totalComments;
        document.getElementById('total-likes').textContent = formatNumber(stats.totalLikes);
        
    } catch (error) {
        console.error('加载统计数据失败:', error);
    }
}

// 初始化图表
function initCharts() {
    const ctx = document.getElementById('views-chart').getContext('2d');
    
    // 生成模拟数据
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        data.push(Math.floor(Math.random() * 500) + 100);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '浏览量',
                data: data,
                borderColor: '#137fec',
                backgroundColor: 'rgba(19, 127, 236, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#137fec',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '浏览量: ' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#617589'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(97, 117, 137, 0.1)'
                    },
                    ticks: {
                        color: '#617589'
                    }
                }
            }
        }
    });
}

// 加载最近活动
async function loadRecentActivities() {
    try {
        // 模拟API请求
        const activities = await mockGetRecentActivities();
        
        const container = document.getElementById('recent-activities');
        container.innerHTML = '';
        
        activities.forEach(activity => {
            const activityElement = createActivityElement(activity);
            container.appendChild(activityElement);
        });
        
    } catch (error) {
        console.error('加载最近活动失败:', error);
    }
}

// 创建活动元素
function createActivityElement(activity) {
    const element = document.createElement('div');
    element.className = 'flex items-start space-x-3';
    
    const iconColor = getActivityIconColor(activity.type);
    
    element.innerHTML = `
        <div class="flex-shrink-0 w-8 h-8 rounded-full ${iconColor.bg} flex items-center justify-center">
            <span class="material-icons-outlined text-sm ${iconColor.text}">${getActivityIcon(activity.type)}</span>
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-sm text-text-light dark:text-text-dark">${activity.description}</p>
            <p class="text-xs text-subtle-light dark:text-subtle-dark">${utils.formatDate(activity.date)}</p>
        </div>
    `;
    
    return element;
}

// 获取活动图标
function getActivityIcon(type) {
    const icons = {
        'article_published': 'article',
        'comment_added': 'chat',
        'like_received': 'favorite',
        'user_registered': 'person_add',
        'article_updated': 'edit'
    };
    return icons[type] || 'info';
}

// 获取活动图标颜色
function getActivityIconColor(type) {
    const colors = {
        'article_published': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-600 dark:text-green-400' },
        'comment_added': { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-600 dark:text-blue-400' },
        'like_received': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-600 dark:text-red-400' },
        'user_registered': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-600 dark:text-purple-400' },
        'article_updated': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-600 dark:text-yellow-400' }
    };
    return colors[type] || { bg: 'bg-gray-100 dark:bg-gray-900', text: 'text-gray-600 dark:text-gray-400' };
}

// 加载热门文章
async function loadPopularArticles() {
    try {
        // 模拟API请求
        const articles = await mockGetPopularArticles();
        
        const container = document.getElementById('popular-articles');
        container.innerHTML = '';
        
        articles.forEach((article, index) => {
            const articleElement = createPopularArticleElement(article, index);
            container.appendChild(articleElement);
        });
        
    } catch (error) {
        console.error('加载热门文章失败:', error);
    }
}

// 创建热门文章元素
function createPopularArticleElement(article, index) {
    const element = document.createElement('div');
    element.className = 'flex items-center space-x-4';
    
    element.innerHTML = `
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span class="text-primary font-bold text-sm">${index + 1}</span>
        </div>
        <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-text-light dark:text-text-dark truncate">${article.title}</h3>
            <div class="flex items-center space-x-3 text-xs text-subtle-light dark:text-subtle-dark">
                <span class="flex items-center">
                    <span class="material-icons-outlined text-xs mr-1">visibility</span>
                    ${formatNumber(article.views)}
                </span>
                <span class="flex items-center">
                    <span class="material-icons-outlined text-xs mr-1">chat</span>
                    ${article.comments}
                </span>
            </div>
        </div>
    `;
    
    return element;
}

// 加载文章表格
async function loadArticlesTable() {
    try {
        // 模拟API请求
        const articles = await mockGetArticles();
        
        renderArticlesTable(articles);
        
    } catch (error) {
        console.error('加载文章表格失败:', error);
    }
}

// 渲染文章表格
function renderArticlesTable(articles) {
    const tbody = document.getElementById('articles-table-body');
    tbody.innerHTML = '';
    
    articles.forEach(article => {
        const row = createArticleTableRow(article);
        tbody.appendChild(row);
    });
    
    // 更新分页信息
    updatePaginationInfo(articles.length);
}

// 创建文章表格行
function createArticleTableRow(article) {
    const row = document.createElement('tr');
    row.className = 'hover:bg-background-light dark:hover:bg-background-dark';
    
    const statusBadge = getStatusBadge(article.status);
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <input type="checkbox" class="article-checkbox rounded border-border-light dark:border-border-dark" data-id="${article.id}">
        </td>
        <td class="px-6 py-4">
            <div class="flex items-center space-x-3">
                ${article.featuredImage ? 
                    `<img src="${article.featuredImage}" alt="${article.title}" class="w-10 h-10 object-cover rounded-lg">` :
                    `<div class="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                        <span class="material-icons-outlined text-primary/30 text-sm">article</span>
                    </div>`
                }
                <div>
                    <div class="text-sm font-medium text-text-light dark:text-text-dark">
                        <a href="article.html?id=${article.id}" class="hover:text-primary transition-colors">${article.title}</a>
                    </div>
                    <div class="text-xs text-subtle-light dark:text-subtle-dark">
                        ${article.tags ? article.tags.slice(0, 2).join(', ') : ''}
                    </div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            ${statusBadge}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">
            ${formatNumber(article.views || 0)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">
            ${article.comments || 0}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-subtle-light dark:text-subtle-dark">
            ${utils.formatDate(article.date)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
            <div class="flex space-x-2">
                <a href="create.html?id=${article.id}" class="text-primary hover:text-primary/80 transition-colors">
                    <span class="material-icons-outlined text-sm">edit</span>
                </a>
                <button onclick="deleteArticle(${article.id})" class="text-red-500 hover:text-red-700 transition-colors">
                    <span class="material-icons-outlined text-sm">delete</span>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// 获取状态徽章
function getStatusBadge(status) {
    const badges = {
        'published': '<span class="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">已发布</span>',
        'draft': '<span class="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400">草稿</span>'
    };
    return badges[status] || badges['draft'];
}

// 初始化搜索和筛选
function initSearchAndFilter() {
    const searchInput = document.getElementById('articles-search');
    const statusFilter = document.getElementById('status-filter');
    
    let searchTimeout;
    
    // 搜索功能
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        
        searchTimeout = setTimeout(() => {
            filterArticles();
        }, 300);
    });
    
    // 状态筛选
    statusFilter.addEventListener('change', function() {
        filterArticles();
    });
}

// 筛选文章
async function filterArticles() {
    const searchQuery = document.getElementById('articles-search').value.trim();
    const statusFilter = document.getElementById('status-filter').value;
    
    try {
        // 模拟API请求
        const articles = await mockGetArticles({ search: searchQuery, status: statusFilter });
        renderArticlesTable(articles);
    } catch (error) {
        console.error('筛选文章失败:', error);
    }
}

// 初始化批量操作
function initBulkActions() {
    const selectAllCheckbox = document.getElementById('select-all');
    const bulkActionsBtn = document.getElementById('bulk-actions-btn');
    
    // 全选/取消全选
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.article-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateBulkActionsButton();
    });
    
    // 监听单个复选框变化
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('article-checkbox')) {
            updateSelectAllCheckbox();
            updateBulkActionsButton();
        }
    });
    
    // 批量操作按钮
    bulkActionsBtn.addEventListener('click', function() {
        const selectedIds = getSelectedArticleIds();
        if (selectedIds.length === 0) {
            authUtils.showMessage('请先选择文章', 'error');
            return;
        }
        
        // 这里可以添加批量操作逻辑
        authUtils.showMessage(`已选择 ${selectedIds.length} 篇文章`, 'info');
    });
}

// 更新全选复选框状态
function updateSelectAllCheckbox() {
    const checkboxes = document.querySelectorAll('.article-checkbox');
    const checkedBoxes = document.querySelectorAll('.article-checkbox:checked');
    const selectAllCheckbox = document.getElementById('select-all');
    
    if (checkedBoxes.length === 0) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = false;
    } else if (checkedBoxes.length === checkboxes.length) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = true;
    } else {
        selectAllCheckbox.indeterminate = true;
        selectAllCheckbox.checked = false;
    }
}

// 更新批量操作按钮
function updateBulkActionsButton() {
    const selectedCount = document.querySelectorAll('.article-checkbox:checked').length;
    const bulkActionsBtn = document.getElementById('bulk-actions-btn');
    
    if (selectedCount > 0) {
        bulkActionsBtn.classList.add('bg-primary', 'text-white');
        bulkActionsBtn.classList.remove('bg-background-light', 'dark:bg-background-dark', 'text-text-light', 'dark:text-text-dark');
        bulkActionsBtn.textContent = `批量操作 (${selectedCount})`;
    } else {
        bulkActionsBtn.classList.remove('bg-primary', 'text-white');
        bulkActionsBtn.classList.add('bg-background-light', 'dark:bg-background-dark', 'text-text-light', 'dark:text-text-dark');
        bulkActionsBtn.textContent = '批量操作';
    }
}

// 获取选中的文章ID
function getSelectedArticleIds() {
    const checkboxes = document.querySelectorAll('.article-checkbox:checked');
    return Array.from(checkboxes).map(checkbox => parseInt(checkbox.dataset.id));
}

// 初始化分页
function initPagination() {
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    prevPageBtn.addEventListener('click', function() {
        // 这里可以添加分页逻辑
        authUtils.showMessage('上一页功能待实现', 'info');
    });
    
    nextPageBtn.addEventListener('click', function() {
        // 这里可以添加分页逻辑
        authUtils.showMessage('下一页功能待实现', 'info');
    });
}

// 更新分页信息
function updatePaginationInfo(totalItems) {
    const showingStart = document.getElementById('showing-start');
    const showingEnd = document.getElementById('showing-end');
    const totalItemsElement = document.getElementById('total-items');
    
    showingStart.textContent = '1';
    showingEnd.textContent = Math.min(5, totalItems);
    totalItemsElement.textContent = totalItems;
}

// 删除文章
async function deleteArticle(articleId) {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
        return;
    }
    
    try {
        // 模拟API请求
        const response = await mockDeleteArticle(articleId);
        
        if (response.success) {
            authUtils.showMessage('文章删除成功', 'success');
            // 重新加载表格
            loadArticlesTable();
        } else {
            authUtils.showMessage('删除失败', 'error');
        }
    } catch (error) {
        console.error('删除文章失败:', error);
        authUtils.showMessage('删除过程中发生错误', 'error');
    }
}

// 更新用户头像
function updateUserAvatar() {
    const user = authUtils.checkAuthStatus();
    const userAvatar = document.getElementById('user-avatar');
    
    if (user.isAuthenticated && user.user.avatar && userAvatar) {
        userAvatar.src = user.user.avatar;
    }
}

// 格式化数字
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// 模拟获取统计数据API
async function mockGetStatistics() {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        totalArticles: 12,
        totalViews: 15200,
        totalComments: 248,
        totalLikes: 892
    };
}

// 模拟获取最近活动API
async function mockGetRecentActivities() {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
        {
            type: 'article_published',
            description: '发布了新文章《现代Web开发最佳实践》',
            date: '2023-10-24T10:00:00Z'
        },
        {
            type: 'comment_added',
            description: '李四评论了您的文章《设计系统的原则》',
            date: '2023-10-23T14:30:00Z'
        },
        {
            type: 'like_received',
            description: '您的文章《AI时代的用户体验导航》获得了10个赞',
            date: '2023-10-23T09:15:00Z'
        },
        {
            type: 'user_registered',
            description: '新用户王五注册了账户',
            date: '2023-10-22T16:45:00Z'
        },
        {
            type: 'article_updated',
            description: '更新了文章《深入组件化主题设计》',
            date: '2023-10-22T11:20:00Z'
        }
    ];
}

// 模拟获取热门文章API
async function mockGetPopularArticles() {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
        {
            id: 5,
            title: '远程工作的艺术',
            views: 3200,
            comments: 45
        },
        {
            id: 6,
            title: '现代CSS技术指南',
            views: 2800,
            comments: 38
        },
        {
            id: 3,
            title: '深入组件化主题设计',
            views: 2500,
            comments: 31
        },
        {
            id: 1,
            title: '设计系统的原则',
            views: 1200,
            comments: 23
        },
        {
            id: 2,
            title: 'AI时代的用户体验导航',
            views: 980,
            comments: 18
        }
    ];
}

// 模拟获取文章API
async function mockGetArticles(filters = {}) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    
    // 如果没有文章，使用模拟数据
    if (articles.length === 0) {
        return [
            {
                id: 1,
                title: '设计系统的原则',
                status: 'published',
                date: '2023-10-24T10:00:00Z',
                views: 1200,
                comments: 23,
                tags: ['技术', '设计系统'],
                featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYXIQYFLXHqtLizov2Q0_Z3IVRMy77UpPwBfLxQW8NTItVt14Hbv6CBbWg1IoRsNsRMjFqisllIl6onLlC3WfaRtQlKIhPsrmxQEfDknsFJvBqe26-g0mRbC8mNFdSZyxQu352qjE_Yoej1XDMcXcbQYeB1uNhPIsBTzzcEQKD6XtzNx7HnJJF9A428XJ_5p1-BvoitlL_GSTtujM8uGz9Robs7jlol2jVTbI11GDg46GvUjAs-nfzjx6j0dp3wmmnZn2IT1IToyxY'
            },
            {
                id: 2,
                title: 'AI时代的用户体验导航',
                status: 'published',
                date: '2023-09-15T14:30:00Z',
                views: 980,
                comments: 18,
                tags: ['技术', 'AI'],
                featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcIm5W7b0SkuSqVyIDoOYQ8sXOcitJVpHmBZFzhmhfRFA1-gc0_s9MN_FAQlU35e1ilBGhuVXuEyuo7-_7h-OWN5RbIqqZzA9QbUxNyETqlTkzX21BtHBi52TX5Ky25ZO3xMGPngvO5QGJb0_si77DfmZ2xNb1rKzqtcXRYQfyAZjj4efjcwjHcS3HChg9369XrsvBG-LQKDb4DnGrrkCUeti2FLs_S1h8l6WjBFEflxcfOjYvKh1DzjhMUQindzGoWp9oXY8_G72k'
            },
            {
                id: 3,
                title: '深入组件化主题设计',
                status: 'published',
                date: '2023-08-02T09:15:00Z',
                views: 2500,
                comments: 31,
                tags: ['技术', 'CSS'],
                featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAafQl7YaqIWSy7d2GQF8uMvN-9zWI7rgmS3AdvHWJFhxXy0ntLERt3PBpQRAafiES7IG_4nlCQpsXW71kZL0TMNkUr04udIg7nwg7yyndj721y8qtJJ7rMbNv8glpwS2HpU63o3yEGb1ZLZ9m2nkeRUtYqwVp0DSPdFg0BqprodvNju858f8x7suFbqUILV6la0c6FVkEyPiheOfdfCqkcGMaifY6aOP-VPbBPYpzbPkmx-L2r-BR3SzWGtFi0F-jUzwjH1IhZMDIE'
            },
            {
                id: 4,
                title: '响应式设计的未来',
                status: 'draft',
                date: '2023-07-20T16:45:00Z',
                views: 0,
                comments: 0,
                tags: ['技术', 'CSS']
            },
            {
                id: 5,
                title: '远程工作的艺术',
                status: 'published',
                date: '2023-06-10T11:20:00Z',
                views: 3200,
                comments: 45,
                tags: ['思考', '远程工作']
            }
        ];
    }
    
    let filteredArticles = [...articles];
    
    // 应用筛选条件
    if (filters.status && filters.status !== 'all') {
        filteredArticles = filteredArticles.filter(article => article.status === filters.status);
    }
    
    if (filters.search) {
        const searchQuery = filters.search.toLowerCase();
        filteredArticles = filteredArticles.filter(article => 
            article.title.toLowerCase().includes(searchQuery) ||
            (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
        );
    }
    
    return filteredArticles;
}

// 模拟删除文章API
async function mockDeleteArticle(articleId) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        success: true,
        message: '文章删除成功'
    };
}