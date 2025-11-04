// 文章编辑器JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 检查用户认证状态
    const authStatus = authUtils.checkAuthStatus();
    if (!authStatus.isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }
    
    // 初始化编辑器
    initEditor();
    
    // 加载现有文章（如果是编辑模式）
    loadExistingArticle();
    
    // 初始化自动保存
    initAutoSave();
    
    // 更新用户头像
    updateUserAvatar();
});

// 初始化编辑器
function initEditor() {
    const editorContent = document.getElementById('editor-content');
    const editorButtons = document.querySelectorAll('.editor-btn');
    
    // 设置占位符行为
    setupPlaceholder(editorContent);
    
    // 初始化工具栏按钮
    editorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            const value = this.getAttribute('data-value');
            
            if (command === 'createLink') {
                const url = prompt('请输入链接地址:');
                if (url) {
                    document.execCommand(command, false, url);
                }
            } else if (command === 'insertImage') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = handleImageUpload;
                input.click();
            } else {
                document.execCommand(command, false, value);
            }
            
            editorContent.focus();
        });
    });
    
    // 监听内容变化
    editorContent.addEventListener('input', function() {
        updateReadingTime();
        updateLastSaved(false);
    });
    
    // 监听标题变化
    document.getElementById('article-title').addEventListener('input', function() {
        updateLastSaved(false);
    });
    
    // 初始化标签输入
    initTagInput();
    
    // 初始化特色图片上传
    initFeaturedImageUpload();
    
    // 初始化发布和保存按钮
    initPublishButtons();
}

// 设置占位符行为
function setupPlaceholder(editor) {
    const placeholder = editor.getAttribute('data-placeholder');
    
    function updatePlaceholder() {
        if (editor.textContent.trim() === '') {
            editor.classList.add('empty');
        } else {
            editor.classList.remove('empty');
        }
    }
    
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .editor-content.empty:before {
            content: attr(data-placeholder);
            color: #9CA3AF;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    editor.addEventListener('input', updatePlaceholder);
    editor.addEventListener('focus', updatePlaceholder);
    editor.addEventListener('blur', updatePlaceholder);
    
    updatePlaceholder();
}

// 处理图片上传
function handleImageUpload(event) {
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
        
        // 读取并插入图片
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            document.execCommand('insertImage', false, imageUrl);
        };
        reader.readAsDataURL(file);
    }
}

// 初始化标签输入
function initTagInput() {
    const tagInput = document.getElementById('tag-input');
    const tagsContainer = document.getElementById('tags-container');
    let tags = [];
    
    tagInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(this.value.trim());
            this.value = '';
        }
    });
    
    function addTag(tagText) {
        if (tagText && !tags.includes(tagText)) {
            tags.push(tagText);
            renderTags();
        }
    }
    
    function removeTag(tagText) {
        tags = tags.filter(tag => tag !== tagText);
        renderTags();
    }
    
    function renderTags() {
        tagsContainer.innerHTML = '';
        
        tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 dark:bg-primary/20 pl-3 pr-2';
            tagElement.innerHTML = `
                <p class="text-primary text-xs font-medium">${tag}</p>
                <button type="button" class="text-primary/70 hover:text-primary">
                    <span class="material-icons-outlined text-base">close</span>
                </button>
            `;
            
            tagElement.querySelector('button').addEventListener('click', function() {
                removeTag(tag);
            });
            
            tagsContainer.appendChild(tagElement);
        });
    }
    
    // 添加一些默认标签
    addTag('技术');
    addTag('设计');
}

// 初始化特色图片上传
function initFeaturedImageUpload() {
    const featuredImageInput = document.getElementById('featured-image-input');
    const featuredImageContainer = document.getElementById('featured-image-container');
    const featuredImagePreview = document.getElementById('featured-image-preview');
    const featuredImageImg = document.getElementById('featured-image-img');
    const removeFeaturedImage = document.getElementById('remove-featured-image');
    
    // 处理文件选择
    featuredImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // 检查文件类型
            if (!file.type.startsWith('image/')) {
                authUtils.showMessage('请选择图片文件', 'error');
                return;
            }
            
            // 检查文件大小 (10MB限制)
            if (file.size > 10 * 1024 * 1024) {
                authUtils.showMessage('图片大小不能超过10MB', 'error');
                return;
            }
            
            // 读取并显示图片
            const reader = new FileReader();
            reader.onload = function(e) {
                featuredImageImg.src = e.target.result;
                featuredImageContainer.classList.add('hidden');
                featuredImagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 处理拖放
    featuredImageContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('border-primary', 'bg-primary/10', 'dark:bg-primary/20');
    });
    
    featuredImageContainer.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('border-primary', 'bg-primary/10', 'dark:bg-primary/20');
    });
    
    featuredImageContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('border-primary', 'bg-primary/10', 'dark:bg-primary/20');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            featuredImageInput.files = e.dataTransfer.files;
            const event = new Event('change', { bubbles: true });
            featuredImageInput.dispatchEvent(event);
        }
    });
    
    // 移除特色图片
    removeFeaturedImage.addEventListener('click', function() {
        featuredImageImg.src = '';
        featuredImageInput.value = '';
        featuredImageContainer.classList.remove('hidden');
        featuredImagePreview.classList.add('hidden');
    });
}

// 初始化发布和保存按钮
function initPublishButtons() {
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const publishBtn = document.getElementById('publish-btn');
    
    saveDraftBtn.addEventListener('click', function() {
        saveArticle('draft');
    });
    
    publishBtn.addEventListener('click', function() {
        openPublishModal();
    });
}

// 打开发布确认模态框
function openPublishModal() {
    const modal = document.getElementById('publish-modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// 关闭发布确认模态框
function closePublishModal() {
    const modal = document.getElementById('publish-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 确认发布
function confirmPublish() {
    closePublishModal();
    saveArticle('published');
}

// 保存文章
async function saveArticle(status) {
    const title = document.getElementById('article-title').value.trim();
    const content = document.getElementById('editor-content').innerHTML;
    const excerpt = document.getElementById('article-excerpt').value.trim();
    const tags = Array.from(document.querySelectorAll('#tags-container p')).map(p => p.textContent);
    const featuredImage = document.getElementById('featured-image-img').src || null;
    
    // 验证必填字段
    if (!title) {
        authUtils.showMessage('请输入文章标题', 'error');
        return;
    }
    
    if (!content || content === '<br>') {
        authUtils.showMessage('请输入文章内容', 'error');
        return;
    }
    
    // 显示加载状态
    const buttons = status === 'published' 
        ? [document.getElementById('publish-btn')]
        : [document.getElementById('save-draft-btn')];
    
    const originalTexts = buttons.map(btn => btn.textContent);
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.textContent = status === 'published' ? '发布中...' : '保存中...';
    });
    
    try {
        // 获取文章ID（如果是编辑模式）
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        
        // 准备文章数据
        const articleData = {
            id: articleId || Date.now(),
            title,
            content,
            excerpt: excerpt || generateExcerpt(content),
            tags,
            featuredImage,
            status,
            date: new Date().toISOString(),
            author: JSON.parse(localStorage.getItem('user')).username,
            readTime: calculateReadingTime(content)
        };
        
        // 模拟API请求
        const response = await mockSaveArticle(articleData);
        
        if (response.success) {
            // 更新文章状态
            document.getElementById('article-status').textContent = status === 'published' ? '已发布' : '草稿';
            
            // 更新最后保存时间
            updateLastSaved(true);
            
            // 显示成功消息
            authUtils.showMessage(
                status === 'published' ? '文章发布成功！' : '草稿保存成功',
                'success'
            );
            
            // 如果是新文章且已发布，跳转到文章页面
            if (status === 'published' && !articleId) {
                setTimeout(() => {
                    window.location.href = `article.html?id=${articleData.id}`;
                }, 1500);
            }
        } else {
            authUtils.showMessage(response.message || '保存失败', 'error');
        }
    } catch (error) {
        console.error('保存文章失败:', error);
        authUtils.showMessage('保存过程中发生错误', 'error');
    } finally {
        // 恢复按钮状态
        buttons.forEach((btn, index) => {
            btn.disabled = false;
            btn.textContent = originalTexts[index];
        });
    }
}

// 加载现有文章（编辑模式）
async function loadExistingArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (articleId) {
        try {
            // 模拟API请求
            const article = await mockGetArticle(articleId);
            
            if (article) {
                // 填充表单
                document.getElementById('article-title').value = article.title;
                document.getElementById('editor-content').innerHTML = article.content;
                document.getElementById('article-excerpt').value = article.excerpt || '';
                document.getElementById('article-status').textContent = article.status === 'published' ? '已发布' : '草稿';
                
                // 设置特色图片
                if (article.featuredImage) {
                    const featuredImageImg = document.getElementById('featured-image-img');
                    featuredImageImg.src = article.featuredImage;
                    document.getElementById('featured-image-container').classList.add('hidden');
                    document.getElementById('featured-image-preview').classList.remove('hidden');
                }
                
                // 设置标签
                const tagsContainer = document.getElementById('tags-container');
                tagsContainer.innerHTML = '';
                
                if (article.tags && article.tags.length > 0) {
                    article.tags.forEach(tag => {
                        const tagInput = document.getElementById('tag-input');
                        tagInput.value = tag;
                        tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
                    });
                }
                
                // 更新阅读时间
                updateReadingTime();
                
                // 更新页面标题
                document.title = `编辑文章 - ${article.title} - 个人博客`;
            }
        } catch (error) {
            console.error('加载文章失败:', error);
            authUtils.showMessage('加载文章失败', 'error');
        }
    }
}

// 自动保存功能
function initAutoSave() {
    let saveTimeout;
    
    function autoSave() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            const title = document.getElementById('article-title').value.trim();
            const content = document.getElementById('editor-content').innerHTML;
            
            if (title || (content && content !== '<br>')) {
                saveArticle('draft');
            }
        }, 30000); // 30秒后自动保存
    }
    
    // 监听变化
    document.getElementById('article-title').addEventListener('input', autoSave);
    document.getElementById('editor-content').addEventListener('input', autoSave);
}

// 更新阅读时间
function updateReadingTime() {
    const content = document.getElementById('editor-content').textContent;
    const readingTime = calculateReadingTime(content);
    document.getElementById('reading-time').textContent = `约 ${readingTime} 分钟阅读`;
}

// 计算阅读时间
function calculateReadingTime(content) {
    const wordsPerMinute = 200; // 假设每分钟阅读200字
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
}

// 更新最后保存时间
function updateLastSaved(isSaved) {
    const lastSavedElement = document.getElementById('last-saved');
    
    if (isSaved) {
        lastSavedElement.textContent = `刚刚保存`;
    } else {
        lastSavedElement.textContent = '未保存';
    }
}

// 生成文章摘要
function generateExcerpt(content) {
    // 移除HTML标签
    const textContent = content.replace(/<[^>]*>/g, '');
    // 截取前150个字符
    return textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
}

// 更新用户头像
function updateUserAvatar() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userAvatar = document.getElementById('user-avatar');
    
    if (user.avatar && userAvatar) {
        userAvatar.style.backgroundImage = `url("${user.avatar}")`;
    }
}

// 模拟保存文章API
async function mockSaveArticle(articleData) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 保存到本地存储（模拟数据库）
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    const existingIndex = articles.findIndex(a => a.id == articleData.id);
    
    if (existingIndex >= 0) {
        articles[existingIndex] = articleData;
    } else {
        articles.push(articleData);
    }
    
    localStorage.setItem('articles', JSON.stringify(articles));
    
    return {
        success: true,
        message: articleData.status === 'published' ? '文章发布成功' : '草稿保存成功'
    };
}

// 模拟获取文章API
async function mockGetArticle(articleId) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    return articles.find(a => a.id == articleId) || null;
}