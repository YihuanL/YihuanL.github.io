// 文章详情页面JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initArticlePage();
});

// 初始化文章详情页面
function initArticlePage() {
    // 获取文章ID
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        // 如果没有文章ID，重定向到文章列表
        window.location.href = 'articles.html';
        return;
    }
    
    // 加载文章详情
    loadArticle(articleId);
    
    // 初始化分享功能
    initShareFeature();
    
    // 初始化评论功能
    initComments();
    
    // 初始化点赞功能
    initLikeFeature();
    
    // 更新浏览量
    incrementViewCount(articleId);
}

// 加载文章详情
async function loadArticle(articleId) {
    try {
        // 模拟API请求
        const article = await mockGetArticle(articleId);
        
        if (!article) {
            showArticleNotFound();
            return;
        }
        
        // 更新页面内容
        updateArticleContent(article);
        
        // 更新页面标题
        document.title = `${article.title} - 个人博客`;
        
        // 加载相关文章
        loadRelatedArticles(article.tags);
        
        // 加载评论
        loadComments(articleId);
        
    } catch (error) {
        console.error('加载文章失败:', error);
        showArticleError();
    }
}

// 更新文章内容
function updateArticleContent(article) {
    // 更新标题
    document.getElementById('article-title').textContent = article.title;
    
    // 更新元信息
    document.getElementById('author-name').textContent = article.author;
    document.getElementById('article-date').textContent = utils.formatDate(article.date);
    document.getElementById('reading-time').textContent = `${article.readTime} 分钟阅读`;
    document.getElementById('view-count').textContent = `${formatNumber(article.views || 0)} 浏览`;
    
    // 更新作者头像
    const authorAvatars = [
        document.getElementById('author-avatar'),
        document.getElementById('author-card-avatar')
    ];
    
    authorAvatars.forEach(avatar => {
        if (avatar && article.authorAvatar) {
            avatar.src = article.authorAvatar;
        }
    });
    
    // 更新特色图片
    if (article.featuredImage) {
        const featuredImage = document.getElementById('featured-image');
        featuredImage.src = article.featuredImage;
        featuredImage.alt = article.title;
    } else {
        document.getElementById('featured-image-container').style.display = 'none';
    }
    
    // 更新摘要
    document.getElementById('article-excerpt').textContent = article.excerpt;
    
    // 更新内容
    document.getElementById('article-content').innerHTML = article.content;
    
    // 更新标签
    updateTags(article.tags);
    
    // 更新评论数
    document.getElementById('comments-count').textContent = article.comments || 0;
    
    // 更新点赞数
    document.getElementById('like-count').textContent = article.likes || 0;
}

// 更新标签
function updateTags(tags) {
    if (!tags || tags.length === 0) return;
    
    const tagsContainer = document.querySelector('article .flex.flex-wrap.gap-2.mb-4');
    tagsContainer.innerHTML = '';
    
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
}

// 加载相关文章
async function loadRelatedArticles(currentTags) {
    try {
        // 模拟API请求
        const relatedArticles = await mockGetRelatedArticles(currentTags);
        
        const relatedContainer = document.getElementById('related-articles');
        relatedContainer.innerHTML = '';
        
        relatedArticles.forEach(article => {
            const articleCard = createRelatedArticleCard(article);
            relatedContainer.appendChild(articleCard);
        });
        
    } catch (error) {
        console.error('加载相关文章失败:', error);
    }
}

// 创建相关文章卡片
function createRelatedArticleCard(article) {
    const articleElement = document.createElement('article');
    articleElement.className = 'bg-ui-light dark:bg-ui-dark rounded-lg p-4 border border-border-light dark:border-border-dark hover:shadow-md transition-shadow';
    
    articleElement.innerHTML = `
        <div class="flex gap-4">
            ${article.featuredImage ? 
                `<img src="${article.featuredImage}" alt="${article.title}" class="w-20 h-20 object-cover rounded-lg flex-shrink-0">` :
                `<div class="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span class="material-icons-outlined text-primary/30">article</span>
                </div>`
            }
            <div class="flex-1">
                <h3 class="font-semibold text-text-light dark:text-text-dark mb-1 line-clamp-2">
                    <a href="article.html?id=${article.id}" class="hover:text-primary transition-colors">${article.title}</a>
                </h3>
                <p class="text-sm text-subtle-light dark:text-subtle-dark line-clamp-2">${article.excerpt}</p>
                <div class="flex items-center space-x-3 text-xs text-subtle-light dark:text-subtle-dark mt-2">
                    <span>${utils.formatDate(article.date)}</span>
                    <span>•</span>
                    <span>${article.readTime} 分钟</span>
                </div>
            </div>
        </div>
    `;
    
    return articleElement;
}

// 初始化分享功能
function initShareFeature() {
    const shareBtn = document.getElementById('share-btn');
    const shareModal = document.getElementById('share-modal');
    const shareUrl = document.getElementById('share-url');
    
    // 设置分享URL
    shareUrl.value = window.location.href;
    
    // 打开分享模态框
    shareBtn.addEventListener('click', function() {
        shareModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
    
    // 复制链接
    shareUrl.addEventListener('click', function() {
        this.select();
        document.execCommand('copy');
        authUtils.showMessage('链接已复制到剪贴板', 'success');
    });
    
    // 分享到社交媒体
    const shareButtons = shareModal.querySelectorAll('button:not(:last-child)');
    shareButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.getElementById('article-title').textContent);
            
            let shareUrl = '';
            switch (index) {
                case 0: // 复制链接
                    shareUrl = '';
                    break;
                case 1: // Facebook
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 2: // Twitter
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 3: // WhatsApp
                    shareUrl = `https://wa.me/?text=${title}%20${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// 关闭分享模态框
function closeShareModal() {
    const shareModal = document.getElementById('share-modal');
    shareModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 初始化评论功能
function initComments() {
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');
    
    // 提交评论
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const commentText = commentInput.value.trim();
        if (!commentText) return;
        
        // 检查用户是否登录
        const authStatus = authUtils.checkAuthStatus();
        if (!authStatus.isAuthenticated) {
            authUtils.showMessage('请先登录后再发表评论', 'error');
            return;
        }
        
        submitComment(commentText);
    });
}

// 提交评论
async function submitComment(commentText) {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
        // 模拟API请求
        const comment = await mockSubmitComment({
            articleId,
            author: user.displayName,
            authorAvatar: user.avatar,
            content: commentText,
            date: new Date().toISOString()
        });
        
        if (comment) {
            // 清空输入框
            document.getElementById('comment-input').value = '';
            
            // 添加评论到列表
            addCommentToList(comment, true);
            
            // 更新评论数
            const commentsCount = document.getElementById('comments-count');
            commentsCount.textContent = parseInt(commentsCount.textContent) + 1;
            
            authUtils.showMessage('评论发表成功', 'success');
        }
    } catch (error) {
        console.error('发表评论失败:', error);
        authUtils.showMessage('发表评论失败，请稍后重试', 'error');
    }
}

// 加载评论
async function loadComments(articleId) {
    try {
        // 模拟API请求
        const comments = await mockGetComments(articleId);
        
        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = '';
        
        comments.forEach(comment => {
            addCommentToList(comment);
        });
        
    } catch (error) {
        console.error('加载评论失败:', error);
    }
}

// 添加评论到列表
function addCommentToList(comment, isNew = false) {
    const commentsList = document.getElementById('comments-list');
    
    const commentElement = document.createElement('div');
    commentElement.className = `bg-ui-light dark:bg-ui-dark rounded-lg p-6 border border-border-light dark:border-border-dark mb-4 ${isNew ? 'fade-in' : ''}`;
    
    commentElement.innerHTML = `
        <div class="flex items-start space-x-4">
            <img src="${comment.authorAvatar || 'https://via.placeholder.com/40'}" alt="${comment.author}" class="w-10 h-10 rounded-full">
            <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                    <h4 class="font-semibold text-text-light dark:text-text-dark">${comment.author}</h4>
                    <span class="text-sm text-subtle-light dark:text-subtle-dark">${utils.formatDate(comment.date)}</span>
                </div>
                <p class="text-text-light dark:text-text-dark">${comment.content}</p>
                <div class="flex items-center space-x-4 mt-3">
                    <button class="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors">
                        <span class="material-icons-outlined text-sm mr-1">thumb_up</span>
                        赞
                    </button>
                    <button class="text-sm text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors">
                        <span class="material-icons-outlined text-sm mr-1">reply</span>
                        回复
                    </button>
                </div>
            </div>
        </div>
    `;
    
    if (isNew) {
        commentsList.insertBefore(commentElement, commentsList.firstChild);
    } else {
        commentsList.appendChild(commentElement);
    }
}

// 初始化点赞功能
function initLikeFeature() {
    const likeBtn = document.getElementById('like-btn');
    const likeCount = document.getElementById('like-count');
    
    likeBtn.addEventListener('click', function() {
        // 检查用户是否登录
        const authStatus = authUtils.checkAuthStatus();
        if (!authStatus.isAuthenticated) {
            authUtils.showMessage('请先登录后再点赞', 'error');
            return;
        }
        
        const icon = this.querySelector('.material-icons-outlined');
        const currentCount = parseInt(likeCount.textContent);
        
        if (icon.textContent === 'favorite_border') {
            // 点赞
            icon.textContent = 'favorite';
            icon.classList.add('text-red-500');
            likeCount.textContent = currentCount + 1;
            
            // 保存点赞状态
            const urlParams = new URLSearchParams(window.location.search);
            const articleId = urlParams.get('id');
            localStorage.setItem(`liked_${articleId}`, 'true');
        } else {
            // 取消点赞
            icon.textContent = 'favorite_border';
            icon.classList.remove('text-red-500');
            likeCount.textContent = currentCount - 1;
            
            // 移除点赞状态
            const urlParams = new URLSearchParams(window.location.search);
            const articleId = urlParams.get('id');
            localStorage.removeItem(`liked_${articleId}`);
        }
    });
    
    // 检查是否已点赞
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    if (localStorage.getItem(`liked_${articleId}`) === 'true') {
        const icon = likeBtn.querySelector('.material-icons-outlined');
        icon.textContent = 'favorite';
        icon.classList.add('text-red-500');
    }
}

// 增加浏览量
function incrementViewCount(articleId) {
    // 获取当前浏览量
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    const article = articles.find(a => a.id == articleId);
    
    if (article) {
        // 增加浏览量
        article.views = (article.views || 0) + 1;
        
        // 更新本地存储
        const index = articles.findIndex(a => a.id == articleId);
        articles[index] = article;
        localStorage.setItem('articles', JSON.stringify(articles));
        
        // 更新显示
        document.getElementById('view-count').textContent = `${formatNumber(article.views)} 浏览`;
    }
}

// 显示文章未找到
function showArticleNotFound() {
    const mainContent = document.querySelector('main.max-w-4xl');
    mainContent.innerHTML = `
        <div class="text-center py-16">
            <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                <span class="material-icons-outlined text-4xl">article</span>
            </div>
            <h1 class="text-3xl font-bold text-text-light dark:text-text-dark mb-4">文章未找到</h1>
            <p class="text-subtle-light dark:text-subtle-dark mb-8">抱歉，您查找的文章不存在或已被删除。</p>
            <a href="articles.html" class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <span class="material-icons-outlined mr-2">arrow_back</span>
                返回文章列表
            </a>
        </div>
    `;
}

// 显示文章加载错误
function showArticleError() {
    const mainContent = document.querySelector('main.max-w-4xl');
    mainContent.innerHTML = `
        <div class="text-center py-16">
            <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400">
                <span class="material-icons-outlined text-4xl">error</span>
            </div>
            <h1 class="text-3xl font-bold text-text-light dark:text-text-dark mb-4">加载失败</h1>
            <p class="text-subtle-light dark:text-subtle-dark mb-8">无法加载文章，请稍后重试。</p>
            <button onclick="location.reload()" class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <span class="material-icons-outlined mr-2">refresh</span>
                重新加载
            </button>
        </div>
    `;
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

// 模拟获取文章API
async function mockGetArticle(articleId) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    
    // 如果没有文章，使用模拟数据
    if (articles.length === 0) {
        return {
            id: articleId,
            title: '设计系统的原则',
            excerpt: '探索创建健壮、可扩展和可维护设计系统的基本原则，这些系统能够赋能团队构建统一的用户体验。',
            content: `
                <h2>什么是设计系统？</h2>
                <p>设计系统是一套完整的标准规范，用来管理大规模的设计。它包含了一系列可复用的组件、清晰的标准和文档，帮助团队创建一致的用户体验。</p>
                
                <h2>为什么需要设计系统？</h2>
                <p>在现代产品开发中，设计系统变得越来越重要。它不仅能够提高设计效率，还能确保产品的一致性和可维护性。</p>
                
                <blockquote>
                    "好的设计系统能够让设计师和开发者更加专注于创新，而不是重复造轮子。"
                </blockquote>
                
                <h2>设计系统的核心原则</h2>
                <ul>
                    <li><strong>一致性：</strong>确保所有界面元素在视觉和交互上保持一致</li>
                    <li><strong>可复用性：</strong>组件应该可以在不同场景下重复使用</li>
                    <li><strong>可扩展性：</strong>系统应该能够适应未来的需求变化</li>
                    <li><strong>可维护性：</strong>系统应该易于更新和维护</li>
                </ul>
                
                <h2>如何构建设计系统？</h2>
                <p>构建设计系统需要从以下几个方面入手：</p>
                <ol>
                    <li>确定设计原则和价值观</li>
                    <li>建立视觉语言（颜色、字体、间距等）</li>
                    <li>创建基础组件库</li>
                    <li>编写详细的文档和使用指南</li>
                    <li>持续迭代和优化</li>
                </ol>
                
                <h2>最佳实践</h2>
                <p>在构建和使用设计系统时，以下最佳实践值得遵循：</p>
                <ul>
                    <li>从小处开始，逐步扩展</li>
                    <li>让团队参与设计和开发过程</li>
                    <li>定期收集用户反馈并改进</li>
                    <li>保持文档的更新和准确性</li>
                </ul>
                
                <p>设计系统是一个持续演进的过程，需要团队的共同努力和长期投入。但一旦建立起来，它将为产品开发带来巨大的价值。</p>
            `,
            date: '2023-10-24T10:00:00Z',
            author: '张三',
            authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzXUhFQr-tPR5vvrc93agkxMg4dmy5yhvF_r10N56eApre15YxkXjg4i_oHmrFEd2pXvxIIm2ltR0rH24hte58sAMJ0dFj_xBKC-I2XJx9owWD07XURgyXjLgZJ2SzXC0lMVO-3yqVSLnAZocwEybU4gfynM4Er0Q3hvORQfzVQJrL0aUaeHi8Z-BM5ACySJIqD-F15ehXjA2Hu5YDhcYPyGCU4TYEiUio1uaBgf51UzHak3_n1jYk_6o07PiCC451Bsix46IlnS0B',
            tags: ['技术', '设计系统', 'UI/UX'],
            featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYXIQYFLXHqtLizov2Q0_Z3IVRMy77UpPwBfLxQW8NTItVt14Hbv6CBbWg1IoRsNsRMjFqisllIl6onLlC3WfaRtQlKIhPsrmxQEfDknsFJvBqe26-g0mRbC8mNFdSZyxQu352qjE_Yoej1XDMcXcbQYeB1uNhPIsBTzzcEQKD6XtzNx7HnJJF9A428XJ_5p1-BvoitlL_GSTtujM8uGz9Robs7jlol2jVTbI11GDg46GvUjAs-nfzjx6j0dp3wmmnZn2IT1IToyxY',
            readTime: 7,
            views: 1200,
            comments: 8,
            likes: 42,
            status: 'published'
        };
    }
    
    return articles.find(a => a.id == articleId) || null;
}

// 模拟获取相关文章API
async function mockGetRelatedArticles(currentTags) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    
    // 如果没有文章，使用模拟数据
    if (articles.length === 0) {
        return [
            {
                id: 2,
                title: 'AI时代的用户体验导航',
                excerpt: '人工智能正在重塑用户体验。本文讨论了设计师在AI驱动世界中的挑战和机遇。',
                date: '2023-09-15T14:30:00Z',
                readTime: 5,
                featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcIm5W7b0SkuSqVyIDoOYQ8sXOcitJVpHmBZFzhmhfRFA1-gc0_s9MN_FAQlU35e1ilBGhuVXuEyuo7-_7h-OWN5RbIqqZzA9QbUxNyETqlTkzX21BtHBi52TX5Ky25ZO3xMGPngvO5QGJb0_si77DfmZ2xNb1rKzqtcXRYQfyAZjj4efjcwjHcS3HChg9369XrsvBG-LQKDb4DnGrrkCUeti2FLs_S1h8l6WjBFEflxcfOjYvKh1DzjhMUQindzGoWp9oXY8_G72k'
            },
            {
                id: 3,
                title: '深入组件化主题设计',
                excerpt: '学习如何为组件库创建灵活且强大的主题解决方案，实现轻松定制和品牌一致性。',
                date: '2023-08-02T09:15:00Z',
                readTime: 10,
                featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAafQl7YaqIWSy7d2GQF8uMvN-9zWI7rgmS3AdvHWJFhxXy0ntLERt3PBpQRAafiES7IG_4nlCQpsXW71kZL0TMNkUr04udIg7nwg7yyndj721y8qtJJ7rMbNv8glpwS2HpU63o3yEGb1ZLZ9m2nkeRUtYqwVp0DSPdFg0BqprodvNju858f8x7suFbqUILV6la0c6FVkEyPiheOfdfCqkcGMaifY6aOP-VPbBPYpzbPkmx-L2r-BR3SzWGtFi0F-jUzwjH1IhZMDIE'
            }
        ];
    }
    
    // 筛选相关文章（排除当前文章）
    return articles
        .filter(article => article.status === 'published')
        .filter(article => article.tags && currentTags && currentTags.some(tag => article.tags.includes(tag)))
        .slice(0, 2);
}

// 模拟获取评论API
async function mockGetComments(articleId) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 返回模拟评论数据
    return [
        {
            id: 1,
            author: '李四',
            authorAvatar: 'https://via.placeholder.com/40',
            content: '非常棒的文章！设计系统确实是现代产品开发中不可或缺的一部分。',
            date: '2023-10-25T09:30:00Z'
        },
        {
            id: 2,
            author: '王五',
            authorAvatar: 'https://via.placeholder.com/40',
            content: '很有见地的分享，特别是关于可维护性的部分，我们团队也正在这方面努力。',
            date: '2023-10-25T14:15:00Z'
        },
        {
            id: 3,
            author: '赵六',
            authorAvatar: 'https://via.placeholder.com/40',
            content: '请问有什么推荐的设计系统工具或框架吗？我们正在评估选择哪个。',
            date: '2023-10-26T11:20:00Z'
        }
    ];
}

// 模拟提交评论API
async function mockSubmitComment(commentData) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        id: Date.now(),
        ...commentData
    };
}