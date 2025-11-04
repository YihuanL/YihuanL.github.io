// 文章列表页面JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initArticlesPage();
});

// 初始化文章列表页面
function initArticlesPage() {
    // 初始化搜索功能
    initSearch();
    
    // 初始化筛选功能
    initFilters();
    
    // 初始化标签云
    initTagsCloud();
    
    // 初始化用户菜单
    initUserMenu();
    
    // 加载文章列表
    loadArticles();
    
    // 更新用户头像
    updateUserAvatar();
}

// 初始化搜索功能
function initSearch() {
    const searchToggle = document.getElementById('search-toggle');
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');
    const closeSearch = document.getElementById('close-search');
    
    // 打开搜索栏
    searchToggle.addEventListener('click', function() {
        searchBar.classList.remove('hidden');
        searchInput.focus();
    });
    
    // 关闭搜索栏
    closeSearch.addEventListener('click', function() {
        searchBar.classList.add('hidden');
        searchInput.value = '';
        loadArticles(); // 重新加载所有文章
    });
    
    // 搜索功能
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        
        // 防抖搜索
        searchTimeout = setTimeout(() => {
            searchArticles(query);
        }, 300);
    });
    
    // ESC键关闭搜索
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !searchBar.classList.contains('hidden')) {
            searchBar.classList.add('hidden');
            searchInput.value = '';
            loadArticles();
        }
    });
}

// 初始化筛选功能
function initFilters() {
    const sortSelect = document.getElementById('sort-select');
    const categorySelect = document.getElementById('category-select');
    const resetFilters = document.getElementById('reset-filters');
    
    // 排序筛选
    sortSelect.addEventListener('change', function() {
        loadArticles();
    });
    
    // 分类筛选
    categorySelect.addEventListener('change', function() {
        loadArticles();
    });
    
    // 重置筛选
    resetFilters.addEventListener('click', function() {
        sortSelect.value = 'latest';
        categorySelect.value = 'all';
        loadArticles();
    });
}

// 初始化标签云
function initTagsCloud() {
    const tagButtons = document.querySelectorAll('.tag-btn');
    
    tagButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tag = this.getAttribute('data-tag');
            
            // 切换选中状态
            this.classList.toggle('bg-primary/20');
            this.classList.toggle('dark:bg-primary/30');
            
            // 加载筛选后的文章
            loadArticles();
        });
    });
}

// 加载文章列表
async function loadArticles() {
    const articlesGrid = document.getElementById('articles-grid');
    const emptyState = document.getElementById('empty-state');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    // 显示加载状态
    articlesGrid.innerHTML = `
        <div class="col-span-full flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    `;
    
    try {
        // 获取筛选条件
        const sortBy = document.getElementById('sort-select').value;
        const category = document.getElementById('category-select').value;
        const selectedTags = Array.from(document.querySelectorAll('.tag-btn.bg-primary\/20, .tag-btn.dark\:bg-primary\/30')).map(btn => btn.getAttribute('data-tag'));
        const searchQuery = document.getElementById('search-input')?.value.trim() || '';
        
        // 模拟API请求
        const articles = await mockGetArticles({
            sort: sortBy,
            category,
            tags: selectedTags,
            search: searchQuery
        });
        
        if (articles.length === 0) {
            articlesGrid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            loadMoreBtn.style.display = 'none';
        } else {
            articlesGrid.classList.remove('hidden');
            emptyState.classList.add('hidden');
            renderArticles(articles);
            loadMoreBtn.style.display = 'block';
        }
    } catch (error) {
        console.error('加载文章失败:', error);
        showErrorState();
    }
}

// 渲染文章列表
function renderArticles(articles) {
    const articlesGrid = document.getElementById('articles-grid');
    articlesGrid.innerHTML = '';
    
    articles.forEach(article => {
        const articleCard = createArticleCard(article);
        articlesGrid.appendChild(articleCard);
    });
}

// 创建文章卡片
function createArticleCard(article) {
    const articleElement = document.createElement('article');
    articleElement.className = 'bg-ui-light dark:bg-ui-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark overflow-hidden hover:shadow-md transition-all duration-300 card-hover';
    
    // 格式化日期
    const formattedDate = utils.formatDate(article.date);
    
    // 获取主要分类
    const primaryCategory = article.tags && article.tags.length > 0 ? article.tags[0] : '未分类';
    
    articleElement.innerHTML = `
        <div class="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
            ${article.featuredImage ? 
                `<img src="${article.featuredImage}" alt="${article.title}" class="w-full h-full object-cover">` :
                `<div class="absolute inset-0 flex items-center justify-center">
                    <span class="material-icons-outlined text-4xl text-primary/30">article</span>
                </div>`
            }
        </div>
        <div class="p-6">
            <div class="flex items-center space-x-2 text-sm text-subtle-light dark:text-subtle-dark mb-2">
                <span class="px-2 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs">${primaryCategory}</span>
                <span>${formattedDate}</span>
            </div>
            <h3 class="text-xl font-bold text-text-light dark:text-text-dark mb-2 line-clamp-2">
                <a href="article.html?id=${article.id}" class="hover:text-primary transition-colors">${article.title}</a>
            </h3>
            <p class="text-subtle-light dark:text-subtle-dark mb-4 line-clamp-3">
                ${article.excerpt}
            </p>
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4 text-sm text-subtle-light dark:text-subtle-dark">
                    <span class="flex items-center">
                        <span class="material-icons-outlined text-sm mr-1">schedule</span>
                        ${article.readTime} 分钟
                    </span>
                    <span class="flex items-center">
                        <span class="material-icons-outlined text-sm mr-1">visibility</span>
                        ${article.views || 0}
                    </span>
                    <span class="flex items-center">
                        <span class="material-icons-outlined text-sm mr-1">chat_bubble_outline</span>
                        ${article.comments || 0}
                    </span>
                </div>
                <a href="article.html?id=${article.id}" class="text-primary hover:underline text-sm font-medium">
                    阅读更多
                </a>
            </div>
        </div>
    `;
    
    return articleElement;
}

// 搜索文章
async function searchArticles(query) {
    if (!query) {
        loadArticles();
        return;
    }
    
    const articlesGrid = document.getElementById('articles-grid');
    const emptyState = document.getElementById('empty-state');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    // 显示加载状态
    articlesGrid.innerHTML = `
        <div class="col-span-full flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    `;
    
    try {
        // 模拟API请求
        const articles = await mockSearchArticles(query);
        
        if (articles.length === 0) {
            articlesGrid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            loadMoreBtn.style.display = 'none';
        } else {
            articlesGrid.classList.remove('hidden');
            emptyState.classList.add('hidden');
            renderArticles(articles);
            loadMoreBtn.style.display = 'block';
        }
    } catch (error) {
        console.error('搜索文章失败:', error);
        showErrorState();
    }
}

// 显示错误状态
function showErrorState() {
    const articlesGrid = document.getElementById('articles-grid');
    const emptyState = document.getElementById('empty-state');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    articlesGrid.innerHTML = `
        <div class="col-span-full text-center bg-ui-light dark:bg-ui-dark p-12 rounded-xl border-2 border-dashed border-red-300 dark:border-red-700">
            <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400">
                <span class="material-icons-outlined text-4xl">error</span>
            </div>
            <h3 class="text-lg font-semibold text-text-light dark:text-text-dark mb-2">加载失败</h3>
            <p class="text-subtle-light dark:text-subtle-dark mb-6">无法加载文章，请稍后重试。</p>
            <button onclick="loadArticles()" class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <span class="material-icons-outlined mr-2">refresh</span>
                重试
            </button>
        </div>
    `;
    
    emptyState.classList.add('hidden');
    loadMoreBtn.style.display = 'none';
}

// 更新用户头像
function updateUserAvatar() {
    const user = authUtils.checkAuthStatus();
    const userAvatar = document.getElementById('user-avatar');
    
    if (user.isAuthenticated && user.user.avatar && userAvatar) {
        userAvatar.src = user.user.avatar;
    }
}

// 模拟获取文章API
async function mockGetArticles(filters = {}) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 获取本地存储的文章
    let articles = JSON.parse(localStorage.getItem('articles') || '[]');
    
    // 如果没有文章，使用模拟数据
    if (articles.length === 0) {
        articles = [
            {
                id: 1,
                title: '设计系统的原则',
                excerpt: '探索创建健壮、可扩展和可维护设计系统的基本原则，这些系统能够赋能团队构建统一的用户体验。',
                content: '<p>设计系统是现代产品开发中不可或缺的一部分...</p>',
                date: '2023-10-24T10:00:00Z',
                author: '张三',
                authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzXUhFQr-tPR5vvrc93agkxMg4dmy5yhvF_r10N56eApre15YxkXjg4i_oHmrFEd2pXvxIIm2ltR0rH24hte58sAMJ0dFj_xBKC-I2XJx9owWD07XURgyXjLgZJ2SzXC0lMVO-3yqVSLnAZocwEybU4gfynM4Er0Q3hvORQfzVQJrL0aUaeHi8Z-BM5ACySJIqD-F15ehXjA2Hu5YDhcYPyGCU4TYEiUio1uaBgf51UzHak3_n1jYk_6o07PiCC451Bsix46IlnS0B',
                tags: ['技术', '设计系统', 'UI/UX'],
                featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYXIQYFLXHqtLizov2Q0_Z3IVRMy77UpPwBfLxQW8NTItVt14Hbv6CBbWg1IoRsNsRMjFqisllIl6onLlC3WfaRtQlKIhPsrmxQEfDknsFJvBqe26-g0mRbC8mNFdSZyxQu352qjE_Yoej1XDMcXcbQYeB1uNhPIsBTzzcEQKD6XtzNx7HnJJF9A428XJ_5p1-BvoitlL_GSTtujM8uGz9Robs7jlol2jVTbI11GDg46GvUjAs-nfzjx6j0dp3wmmnZn2IT1IToyxY',
                readTime: 7,
                views: 1200,
                comments: 23,
                status: 'published'
            },
            {
                id: 2,
                title: 'AI时代的用户体验导航',
                excerpt: '人工智能正在重塑用户体验。本文讨论了设计师在AI驱动世界中的挑战和机遇。',
                content: '<p>人工智能技术的发展正在深刻改变用户体验设计领域...</p>',
                date: '2023-09-15T14:30:00Z',
                author: '张三',
                authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzXUhFQr-tPR5vvrc93agkxMg4dmy5yhvF_r10N56eApre15YxkXjg4i_oHmrFEd2pXvxIIm2ltR0rH24hte58sAMJ0dFj_xBKC-I2XJx9owWD07XURgyXjLgZJ2SzXC0lMVO-3yqVSLnAZocwEybU4gfynM4Er0Q3hvORQfzVQJrL0aUaeHi8Z-BM5ACySJIqD-F15ehXjA2Hu5YDhcYPyGCU4TYEiUio1uaBgf51UzHak3_n1jYk_6o07PiCC451Bsix46IlnS0B',
                tags: ['技术', 'AI', '用户体验'],
                featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcIm5W7b0SkuSqVyIDoOYQ8sXOcitJVpHmBZFzhmhfRFA1-gc0_s9MN_FAQlU35e1ilBGhuVXuEyuo7-_7h-OWN5RbIqqZzA9QbUxNyETqlTkzX21BtHBi52TX5Ky25ZO3xMGPngvO5QGJb0_si77DfmZ2xNb1rKzqtcXRYQfyAZjj4efjcwjHcS3HChg9369XrsvBG-LQKDb4DnGrrkCUeti2FLs_S1h8l6WjBFEflxcfOjYvKh1DzjhMUQindzGoWp9oXY8_G72k',
                readTime: 5,
                views: 980,
                comments: 18,
                status: 'published'
            },
            {
                id: 3,
                title: '深入组件化主题设计',
                excerpt: '学习如何为组件库创建灵活且强大的主题解决方案，实现轻松定制和品牌一致性。',
                content: '<p>在现代前端开发中，主题系统是构建可维护UI的关键...</p>',
                date: '2023-08-02T09:15:00Z',
                author: '张三',
                authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzXUhFQr-tPR5vvrc93agkxMg4dmy5yhvF_r10N56eApre15YxkXjg4i_oHmrFEd2pXvxIIm2ltR0rH24hte58sAMJ0dFj_xBKC-I2XJx9owWD07XURgyXjLgZJ2SzXC0lMVO-3yqVSLnAZocwEybU4gfynM4Er0Q3hvORQfzVQJrL0aUaeHi8Z-BM5ACySJIqD-F15ehXjA2Hu5YDhcYPyGCU4TYEiUio1uaBgf51UzHak3_n1jYk_6o07PiCC451Bsix46IlnS0B',
                tags: ['技术', 'CSS', '组件库'],
                featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAafQl7YaqIWSy7d2GQF8uMvN-9zWI7rgmS3AdvHWJFhxXy0ntLERt3PBpQRAafiES7IG_4nlCQpsXW71kZL0TMNkUr04udIg7nwg7yyndj721y8qtJJ7rMbNv8glpwS2HpU63o3yEGb1ZLZ9m2nkeRUtYqwVp0DSPdFg0BqprodvNju858f8x7suFbqUILV6la0c6FVkEyPiheOfdfCqkcGMaifY6aOP-VPbBPYpzbPkmx-L2r-BR3SzWGtFi0F-jUzwjH1IhZMDIE',
                readTime: 10,
                views: 2500,
                comments: 31,
                status: 'published'
            },
            {
                id: 4,
                title: '响应式设计的未来',
                excerpt: '探索响应式网页设计的最新趋势和未来发展方向，包括容器查询和自适应设计。',
                content: '<p>响应式设计自诞生以来已经经历了多次演进...</p>',
                date: '2023-07-20T16:45:00Z',
                author: '张三',
                authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzXUhFQr-tPR5vvrc93agkxMg4dmy5yhvF_r10N56eApre15YxkXjg4i_oHmrFEd2pXvxIIm2ltR0rH24hte58sAMJ0dFj_xBKC-I2XJx9owWD07XURgyXjLgZJ2SzXC0lMVO-3yqVSLnAZocwEybU4gfynM4Er0Q3hvORQfzVQJrL0aUaeHi8Z-BM5ACySJIqD-F15ehXjA2Hu5YDhcYPyGCU4TYEiUio1uaBgf51UzHak3_n1jYk_6o07PiCC451Bsix46IlnS0B',
                tags: ['技术', 'CSS', '响应式设计'],
                readTime: 8,
                views: 1500,
                comments: 12,
                status: 'published'
            },
            {
                id: 5,
                title: '远程工作的艺术',
                excerpt: '分享远程工作三年的经验总结，如何保持高效、建立连接并维持工作生活平衡。',
                content: '<p>远程工作已经成为新常态，但如何做好远程工作仍是一门艺术...</p>',
                date: '2023-06-10T11:20:00Z',
                author: '张三',
                authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzXUhFQr-tPR5vvrc93agkxMg4dmy5yhvF_r10N56eApre15YxkXjg4i_oHmrFEd2pXvxIIm2ltR0rH24hte58sAMJ0dFj_xBKC-I2XJx9owWD07XURgyXjLgZJ2SzXC0lMVO-3yqVSLnAZocwEybU4gfynM4Er0Q3hvORQfzVQJrL0aUaeHi8Z-BM5ACySJIqD-F15ehXjA2Hu5YDhcYPyGCU4TYEiUio1uaBgf51UzHak3_n1jYk_6o07PiCC451Bsix46IlnS0B',
                tags: ['思考', '远程工作', '生活'],
                readTime: 6,
                views: 3200,
                comments: 45,
                status: 'published'
            },
            {
                id: 6,
                title: '现代CSS技术指南',
                excerpt: '全面了解现代CSS技术，包括Grid、Flexbox和自定义属性等实用特性。',
                content: '<p>CSS在过去几年中发展迅速，许多新特性已经得到广泛支持...</p>',
                date: '2023-05-15T13:00:00Z',
                author: '张三',
                authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzXUhFQr-tPR5vvrc93agkxMg4dmy5yhvF_r10N56eApre15YxkXjg4i_oHmrFEd2pXvxIIm2ltR0rH24hte58sAMJ0dFj_xBKC-I2XJx9owWD07XURgyXjLgZJ2SzXC0lMVO-3yqVSLnAZocwEybU4gfynM4Er0Q3hvORQfzVQJrL0aUaeHi8Z-BM5ACySJIqD-F15ehXjA2Hu5YDhcYPyGCU4TYEiUio1uaBgf51UzHak3_n1jYk_6o07PiCC451Bsix46IlnS0B',
                tags: ['技术', 'CSS', '前端'],
                readTime: 12,
                views: 2800,
                comments: 38,
                status: 'published'
            }
        ];
    }
    
    // 只显示已发布的文章
    articles = articles.filter(article => article.status === 'published');
    
    // 应用筛选条件
    if (filters.category && filters.category !== 'all') {
        articles = articles.filter(article => 
            article.tags && article.tags.includes(filters.category)
        );
    }
    
    if (filters.tags && filters.tags.length > 0) {
        articles = articles.filter(article => 
            article.tags && filters.tags.some(tag => article.tags.includes(tag))
        );
    }
    
    if (filters.search) {
        const searchQuery = filters.search.toLowerCase();
        articles = articles.filter(article => 
            article.title.toLowerCase().includes(searchQuery) ||
            article.excerpt.toLowerCase().includes(searchQuery) ||
            (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
        );
    }
    
    // 应用排序
    switch (filters.sort) {
        case 'oldest':
            articles.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'popular':
            articles.sort((a, b) => (b.views || 0) - (a.views || 0));
            break;
        case 'latest':
        default:
            articles.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
    }
    
    return articles;
}

// 模拟搜索文章API
async function mockSearchArticles(query) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const articles = await mockGetArticles();
    const searchQuery = query.toLowerCase();
    
    return articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery) ||
        article.excerpt.toLowerCase().includes(searchQuery) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
    );
}