// 个人资料页面JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 检查用户认证状态
    const authStatus = authUtils.checkAuthStatus();
    if (!authStatus.isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }
    
    // 初始化页面
    initProfilePage();
});

// 初始化个人资料页面
function initProfilePage() {
    // 加载用户数据
    loadUserData();
    
    // 初始化标签切换
    initTabSwitching();
    
    // 初始化搜索功能
    initSearchFunctionality();
    
    // 初始化编辑资料功能
    initEditProfile();
    
    // 初始化用户菜单
    initUserMenu();
    
    // 初始化登出功能
    initLogout();
    
    // 加载文章列表
    loadArticles('published');
}

// 加载用户数据
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // 更新用户信息显示
    document.getElementById('profile-username').textContent = user.displayName || '用户名';
    document.getElementById('profile-handle').textContent = `@${user.username || 'username'}`;
    document.getElementById('profile-bio').textContent = user.bio || '这个人很懒，什么都没有写...';
    
    // 更新头像
    const avatarElements = [
        document.getElementById('profile-avatar'),
        document.getElementById('user-avatar')
    ];
    
    avatarElements.forEach(element => {
        if (element && user.avatar) {
            element.src = user.avatar;
        }
    });
    
    // 更新统计信息
    updateStatistics();
}

// 更新统计信息
function updateStatistics() {
    // 模拟统计数据
    const stats = {
        articles: 12,
        followers: 234,
        following: 89
    };
    
    document.getElementById('articles-count').textContent = stats.articles;
    document.getElementById('followers-count').textContent = stats.followers;
    document.getElementById('following-count').textContent = stats.following;
}

// 初始化标签切换
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // 更新标签样式
            tabButtons.forEach(btn => {
                btn.classList.remove('text-primary', 'border-primary', 'font-semibold');
                btn.classList.add('text-subtle-light', 'dark:text-subtle-dark', 'border-transparent', 'font-medium');
            });
            
            this.classList.remove('text-subtle-light', 'dark:text-subtle-dark', 'border-transparent', 'font-medium');
            this.classList.add('text-primary', 'border-primary', 'font-semibold');
            
            // 加载对应标签的内容
            loadArticles(tabName);
        });
    });
}

// 初始化搜索功能
function initSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        
        // 防抖搜索
        searchTimeout = setTimeout(() => {
            filterArticles(query);
        }, 300);
    });
}

// 初始化编辑资料功能
function initEditProfile() {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileForm = document.getElementById('edit-profile-form');
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    
    // 打开编辑模态框
    editProfileBtn.addEventListener('click', function() {
        openEditProfileModal();
    });
    
    // 更改头像
    changeAvatarBtn.addEventListener('click', function() {
        // 创建隐藏的文件输入
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = handleAvatarChange;
        fileInput.click();
    });
    
    // 提交编辑表单
    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileChanges();
    });
}

// 初始化用户菜单
function initUserMenu() {
    const userMenu = document.getElementById('user-menu');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userMenu && userDropdown) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });
        
        // 点击外部关闭菜单
        document.addEventListener('click', function() {
            userDropdown.classList.add('hidden');
        });
        
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// 初始化登出功能
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            authUtils.logout();
        });
    }
}

// 加载文章列表
async function loadArticles(tab) {
    const container = document.getElementById('articles-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    // 显示加载状态
    container.innerHTML = `
        <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    `;
    
    try {
        // 模拟API请求
        const articles = await mockGetArticles(tab);
        
        if (articles.length === 0) {
            showEmptyState(tab);
        } else {
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
    const container = document.getElementById('articles-container');
    container.innerHTML = '';
    
    articles.forEach(article => {
        const articleCard = createArticleCard(article);
        container.appendChild(articleCard);
    });
}

// 创建文章卡片
function createArticleCard(article) {
    const articleElement = document.createElement('article');
    articleElement.className = 'bg-ui-light dark:bg-ui-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark hover:shadow-md hover:border-border-light dark:hover:border-border-dark transition-all duration-200';
    
    articleElement.innerHTML = `
        <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
                <h2 class="text-lg font-bold text-text-light dark:text-text-dark mb-2">
                    <a href="article.html?id=${article.id}" class="hover:text-primary transition-colors">${article.title}</a>
                </h2>
                <p class="text-sm text-subtle-light dark:text-subtle-dark leading-relaxed line-clamp-2 mb-4">
                    ${article.excerpt}
                </p>
                <div class="flex items-center space-x-4 text-xs text-subtle-light dark:text-subtle-dark">
                    <span>${utils.formatDate(article.date)}</span>
                    <span class="text-border-light dark:text-border-dark">|</span>
                    <span>${article.readTime} 分钟阅读</span>
                    <span class="text-border-light dark:text-border-dark">|</span>
                    <span>${article.comments} 评论</span>
                </div>
            </div>
            ${article.featuredImage ? `
                <img src="${article.featuredImage}" alt="${article.title}" class="w-full sm:w-32 h-32 sm:h-auto object-cover rounded-lg flex-shrink-0">
            ` : ''}
        </div>
        <div class="flex justify-end items-center mt-4 space-x-2">
            <button onclick="editArticle(${article.id})" class="text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors">
                <span class="material-icons-outlined text-sm">edit</span>
            </button>
            <button onclick="deleteArticle(${article.id})" class="text-subtle-light dark:text-subtle-dark hover:text-red-500 transition-colors">
                <span class="material-icons-outlined text-sm">delete</span>
            </button>
        </div>
    `;
    
    return articleElement;
}

// 显示空状态
function showEmptyState(tab) {
    const container = document.getElementById('articles-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    let emptyStateContent = '';
    
    switch (tab) {
        case 'published':
            emptyStateContent = `
                <h3 class="text-lg font-semibold text-text-light dark:text-text-dark mb-2">还没有发布的文章</h3>
                <p class="text-subtle-light dark:text-subtle-dark mb-6">开始撰写您的第一篇文章并与世界分享您的想法！</p>
                <a href="create.html" class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    <span class="material-icons-outlined mr-2">add</span>
                    撰写文章
                </a>
            `;
            break;
        case 'drafts':
            emptyStateContent = `
                <h3 class="text-lg font-semibold text-text-light dark:text-text-dark mb-2">没有草稿</h3>
                <p class="text-subtle-light dark:text-subtle-dark mb-6">您的草稿将显示在这里。</p>
            `;
            break;
        case 'bookmarks':
            emptyStateContent = `
                <h3 class="text-lg font-semibold text-text-light dark:text-text-dark mb-2">没有收藏的文章</h3>
                <p class="text-subtle-light dark:text-subtle-dark mb-6">收藏的文章将显示在这里。</p>
            `;
            break;
    }
    
    container.innerHTML = `
        <div class="text-center bg-ui-light dark:bg-ui-dark p-12 rounded-xl border-2 border-dashed border-border-light dark:border-border-dark">
            <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                <span class="material-icons-outlined text-4xl">article</span>
            </div>
            ${emptyStateContent}
        </div>
    `;
    
    loadMoreBtn.style.display = 'none';
}

// 显示错误状态
function showErrorState() {
    const container = document.getElementById('articles-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    container.innerHTML = `
        <div class="text-center bg-ui-light dark:bg-ui-dark p-12 rounded-xl border-2 border-dashed border-red-300 dark:border-red-700">
            <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400">
                <span class="material-icons-outlined text-4xl">error</span>
            </div>
            <h3 class="text-lg font-semibold text-text-light dark:text-text-dark mb-2">加载失败</h3>
            <p class="text-subtle-light dark:text-subtle-dark mb-6">无法加载文章，请稍后重试。</p>
            <button onclick="loadArticles('published')" class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <span class="material-icons-outlined mr-2">refresh</span>
                重试
            </button>
        </div>
    `;
    
    loadMoreBtn.style.display = 'none';
}

// 筛选文章
function filterArticles(query) {
    const articles = document.querySelectorAll('#articles-container article');
    
    articles.forEach(article => {
        const title = article.querySelector('h2 a').textContent.toLowerCase();
        const excerpt = article.querySelector('p').textContent.toLowerCase();
        const searchTerm = query.toLowerCase();
        
        if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
}

// 打开编辑资料模态框
function openEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // 填充当前用户信息
    document.getElementById('edit-display-name').value = user.displayName || '';
    document.getElementById('edit-username').value = user.username || '';
    document.getElementById('edit-bio').value = user.bio || '';
    
    // 显示模态框
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// 关闭编辑资料模态框
function closeEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 保存资料更改
async function saveProfileChanges() {
    const displayName = document.getElementById('edit-display-name').value;
    const username = document.getElementById('edit-username').value;
    const bio = document.getElementById('edit-bio').value;
    
    // 验证表单
    if (!displayName.trim()) {
        authUtils.showMessage('请输入显示名称', 'error');
        return;
    }
    
    if (!username.trim()) {
        authUtils.showMessage('请输入用户名', 'error');
        return;
    }
    
    try {
        // 模拟API请求
        const response = await mockUpdateProfile({ displayName, username, bio });
        
        if (response.success) {
            // 更新本地存储
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...user, displayName, username, bio };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // 更新页面显示
            loadUserData();
            
            // 关闭模态框
            closeEditProfileModal();
            
            // 显示成功消息
            authUtils.showMessage('资料更新成功', 'success');
        } else {
            authUtils.showMessage(response.message || '更新失败', 'error');
        }
    } catch (error) {
        console.error('更新资料失败:', error);
        authUtils.showMessage('更新过程中发生错误', 'error');
    }
}

// 处理头像更改
function handleAvatarChange(event) {
    const file = event.target.files[0];
    
    if (file) {
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            authUtils.showMessage('请选择图片文件', 'error');
            return;
        }
        
        // 检查文件大小 (5MB限制)
        if (file.size > 5 * 1024 * 1024) {
            authUtils.showMessage('图片大小不能超过5MB', 'error');
            return;
        }
        
        // 读取并显示图片
        const reader = new FileReader();
        reader.onload = function(e) {
            const avatarUrl = e.target.result;
            
            // 更新头像显示
            document.getElementById('profile-avatar').src = avatarUrl;
            document.getElementById('user-avatar').src = avatarUrl;
            
            // 模拟上传
            uploadAvatar(avatarUrl);
        };
        reader.readAsDataURL(file);
    }
}

// 上传头像
async function uploadAvatar(avatarUrl) {
    try {
        // 模拟API请求
        const response = await mockUploadAvatar(avatarUrl);
        
        if (response.success) {
            // 更新本地存储
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...user, avatar: response.avatarUrl };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            authUtils.showMessage('头像更新成功', 'success');
        } else {
            authUtils.showMessage('头像上传失败', 'error');
        }
    } catch (error) {
        console.error('头像上传失败:', error);
        authUtils.showMessage('上传过程中发生错误', 'error');
    }
}

// 编辑文章
function editArticle(articleId) {
    window.location.href = `create.html?id=${articleId}`;
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
            
            // 重新加载文章列表
            const activeTab = document.querySelector('.tab-btn.border-primary').getAttribute('data-tab');
            loadArticles(activeTab);
        } else {
            authUtils.showMessage('删除失败', 'error');
        }
    } catch (error) {
        console.error('删除文章失败:', error);
        authUtils.showMessage('删除过程中发生错误', 'error');
    }
}

// 模拟获取文章API
async function mockGetArticles(tab) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockArticles = {
        published: [
            {
                id: 1,
                title: '设计系统的原则',
                excerpt: '探索创建健壮、可扩展和可维护设计系统的基本原则，这些系统能够赋能团队构建统一的用户体验。',
                date: '2023-10-24',
                readTime: 7,
                comments: 23,
                featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYXIQYFLXHqtLizov2Q0_Z3IVRMy77UpPwBfLxQW8NTItVt14Hbv6CBbWg1IoRsNsRMjFqisllIl6onLlC3WfaRtQlKIhPsrmxQEfDknsFJvBqe26-g0mRbC8mNFdSZyxQu352qjE_Yoej1XDMcXcbQYeB1uNhPIsBTzzcEQKD6XtzNx7HnJJF9A428XJ_5p1-BvoitlL_GSTtujM8uGz9Robs7jlol2jVTbI11GDg46GvUjAs-nfzjx6j0dp3wmmnZn2IT1IToyxY'
            },
            {
                id: 2,
                title: 'AI时代的用户体验导航',
                excerpt: '人工智能正在重塑用户体验。本文讨论了设计师在AI驱动世界中的挑战和机遇。',
                date: '2023-09-15',
                readTime: 5,
                comments: 18,
                featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcIm5W7b0SkuSqVyIDoOYQ8sXOcitJVpHmBZFzhmhfRFA1-gc0_s9MN_FAQlU35e1ilBGhuVXuEyuo7-_7h-OWN5RbIqqZzA9QbUxNyETqlTkzX21BtHBi52TX5Ky25ZO3xMGPngvO5QGJb0_si77DfmZ2xNb1rKzqtcXRYQfyAZjj4efjcwjHcS3HChg9369XrsvBG-LQKDb4DnGrrkCUeti2FLs_S1h8l6WjBFEflxcfOjYvKh1DzjhMUQindzGoWp9oXY8_G72k'
            },
            {
                id: 3,
                title: '深入组件化主题设计',
                excerpt: '学习如何为组件库创建灵活且强大的主题解决方案，实现轻松定制和品牌一致性。',
                date: '2023-08-02',
                readTime: 10,
                comments: 31,
                featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAafQl7YaqIWSy7d2GQF8uMvN-9zWI7rgmS3AdvHWJFhxXy0ntLERt3PBpQRAafiES7IG_4nlCQpsXW71kZL0TMNkUr04udIg7nwg7yyndj721y8qtJJ7rMbNv8glpwS2HpU63o3yEGb1ZLZ9m2nkeRUtYqwVp0DSPdFg0BqprodvNju858f8x7suFbqUILV6la0c6FVkEyPiheOfdfCqkcGMaifY6aOP-VPbBPYpzbPkmx-L2r-BR3SzWGtFi0F-jUzwjH1IhZMDIE'
            }
        ],
        drafts: [
            {
                id: 4,
                title: '响应式设计的未来',
                excerpt: '探索响应式网页设计的最新趋势和未来发展方向...',
                date: '2023-11-01',
                readTime: 8,
                comments: 0
            }
        ],
        bookmarks: [
            {
                id: 5,
                title: '现代CSS技术指南',
                excerpt: '全面了解现代CSS技术，包括Grid、Flexbox和自定义属性...',
                date: '2023-10-20',
                readTime: 12,
                comments: 45,
                featuredImage: 'https://via.placeholder.com/300x200'
            }
        ]
    };
    
    return mockArticles[tab] || [];
}

// 模拟更新资料API
async function mockUpdateProfile(profileData) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        success: true,
        message: '资料更新成功'
    };
}

// 模拟上传头像API
async function mockUploadAvatar(avatarUrl) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        success: true,
        avatarUrl: avatarUrl
    };
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