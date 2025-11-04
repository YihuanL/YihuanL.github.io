// 设置页面JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 检查用户认证状态
    const authStatus = authUtils.checkAuthStatus();
    if (!authStatus.isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }
    
    // 初始化设置页面
    initSettingsPage();
});

// 初始化设置页面
function initSettingsPage() {
    // 初始化导航切换
    initNavigation();
    
    // 初始化表单提交
    initFormSubmissions();
    
    // 加载设置数据
    loadSettingsData();
    
    // 初始化主题切换
    initThemeToggle();
    
    // 更新用户头像
    updateUserAvatar();
}

// 初始化导航切换
function initNavigation() {
    const navButtons = document.querySelectorAll('.settings-nav-btn');
    const sections = document.querySelectorAll('.settings-section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // 更新导航按钮样式
            navButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('text-text-light', 'dark:text-text-dark');
            });
            
            this.classList.remove('text-text-light', 'dark:text-text-dark');
            this.classList.add('bg-primary', 'text-white');
            
            // 显示对应的内容区域
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            
            const targetElement = document.getElementById(`${targetSection}-section`);
            if (targetElement) {
                targetElement.classList.remove('hidden');
            }
        });
    });
    
    // 默认显示通用设置
    const firstButton = document.querySelector('.settings-nav-btn');
    if (firstButton) {
        firstButton.click();
    }
}

// 初始化表单提交
function initFormSubmissions() {
    // 通用设置表单
    const generalForm = document.getElementById('general-form');
    if (generalForm) {
        generalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveGeneralSettings();
        });
    }
    
    // 外观设置表单
    const appearanceForm = document.getElementById('appearance-form');
    if (appearanceForm) {
        appearanceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAppearanceSettings();
        });
    }
    
    // 通知设置表单
    const notificationsForm = document.getElementById('notifications-form');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveNotificationSettings();
        });
    }
    
    // 隐私设置表单
    const privacyForm = document.getElementById('privacy-form');
    if (privacyForm) {
        privacyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePrivacySettings();
        });
    }
    
    // 账户设置表单
    const accountForm = document.getElementById('account-form');
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAccountSettings();
        });
    }
    
    // 高级设置表单
    const advancedForm = document.getElementById('advanced-form');
    if (advancedForm) {
        advancedForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAdvancedSettings();
        });
    }
}

// 加载设置数据
async function loadSettingsData() {
    try {
        // 模拟API请求
        const settings = await mockGetSettings();
        
        // 填充通用设置
        document.getElementById('site-name').value = settings.siteName;
        document.getElementById('site-description').value = settings.siteDescription;
        document.getElementById('site-language').value = settings.siteLanguage;
        document.getElementById('timezone').value = settings.timezone;
        
        // 填充外观设置
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            if (radio.value === settings.theme) {
                radio.checked = true;
            }
        });
        
        document.getElementById('primary-color').value = settings.primaryColor;
        document.getElementById('font-size').value = settings.fontSize;
        
        // 填充通知设置
        // 这里可以根据实际数据结构填充复选框状态
        
        // 填充账户设置
        document.getElementById('email').value = settings.email;
        
    } catch (error) {
        console.error('加载设置数据失败:', error);
    }
}

// 保存通用设置
async function saveGeneralSettings() {
    const settings = {
        siteName: document.getElementById('site-name').value,
        siteDescription: document.getElementById('site-description').value,
        siteLanguage: document.getElementById('site-language').value,
        timezone: document.getElementById('timezone').value
    };
    
    try {
        // 模拟API请求
        const response = await mockSaveSettings('general', settings);
        
        if (response.success) {
            authUtils.showMessage('通用设置保存成功', 'success');
        } else {
            authUtils.showMessage('保存失败', 'error');
        }
    } catch (error) {
        console.error('保存通用设置失败:', error);
        authUtils.showMessage('保存过程中发生错误', 'error');
    }
}

// 保存外观设置
async function saveAppearanceSettings() {
    const themeRadios = document.querySelectorAll('input[name="theme"]:checked');
    const theme = themeRadios.length > 0 ? themeRadios[0].value : 'auto';
    
    const settings = {
        theme: theme,
        primaryColor: document.getElementById('primary-color').value,
        fontSize: document.getElementById('font-size').value
    };
    
    try {
        // 模拟API请求
        const response = await mockSaveSettings('appearance', settings);
        
        if (response.success) {
            // 应用主题设置
            if (theme === 'light') {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
            } else if (theme === 'dark') {
                document.documentElement.classList.remove('light');
                document.documentElement.classList.add('dark');
            } else {
                // 跟随系统
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            
            // 应用主题色
            const primaryColor = settings.primaryColor;
            document.documentElement.style.setProperty('--primary', primaryColor);
            
            authUtils.showMessage('外观设置保存成功', 'success');
        } else {
            authUtils.showMessage('保存失败', 'error');
        }
    } catch (error) {
        console.error('保存外观设置失败:', error);
        authUtils.showMessage('保存过程中发生错误', 'error');
    }
}

// 保存通知设置
async function saveNotificationSettings() {
    const settings = {
        emailNotifications: {
            newComments: document.querySelector('#notifications-form input[type="checkbox"]:nth-of-type(1)').checked,
            newUserRegistration: document.querySelector('#notifications-form input[type="checkbox"]:nth-of-type(2)').checked,
            siteUpdates: document.querySelector('#notifications-form input[type="checkbox"]:nth-of-type(3)').checked
        },
        browserNotifications: {
            enabled: document.getElementById('browser-notifications').checked,
            realTimeComments: document.querySelector('#notifications-form input[type="checkbox"]:nth-of-type(5)').checked
        }
    };
    
    try {
        // 模拟API请求
        const response = await mockSaveSettings('notifications', settings);
        
        if (response.success) {
            // 处理浏览器通知权限
            if (settings.browserNotifications.enabled) {
                requestNotificationPermission();
            }
            
            authUtils.showMessage('通知设置保存成功', 'success');
        } else {
            authUtils.showMessage('保存失败', 'error');
        }
    } catch (error) {
        console.error('保存通知设置失败:', error);
        authUtils.showMessage('保存过程中发生错误', 'error');
    }
}

// 保存隐私设置
async function savePrivacySettings() {
    const settings = {
        profileVisibility: {
            showEmail: document.querySelector('#privacy-form input[type="checkbox"]:nth-of-type(1)').checked,
            showSocialLinks: document.querySelector('#privacy-form input[type="checkbox"]:nth-of-type(2)').checked,
            showWebsite: document.querySelector('#privacy-form input[type="checkbox"]:nth-of-type(3)').checked
        },
        searchEngine: {
            allowIndexing: document.querySelector('#privacy-form input[type="checkbox"]:nth-of-type(5)').checked,
            showInResults: document.querySelector('#privacy-form input[type="checkbox"]:nth-of-type(6)').checked
        },
        dataCollection: {
            enableAnalytics: document.querySelector('#privacy-form input[type="checkbox"]:nth-of-type(8)').checked,
            collectUserData: document.querySelector('#privacy-form input[type="checkbox"]:nth-of-type(9)').checked
        }
    };
    
    try {
        // 模拟API请求
        const response = await mockSaveSettings('privacy', settings);
        
        if (response.success) {
            authUtils.showMessage('隐私设置保存成功', 'success');
        } else {
            authUtils.showMessage('保存失败', 'error');
        }
    } catch (error) {
        console.error('保存隐私设置失败:', error);
        authUtils.showMessage('保存过程中发生错误', 'error');
    }
}

// 保存账户设置
async function saveAccountSettings() {
    const settings = {
        email: document.getElementById('email').value
    };
    
    try {
        // 模拟API请求
        const response = await mockSaveSettings('account', settings);
        
        if (response.success) {
            authUtils.showMessage('账户设置保存成功', 'success');
        } else {
            authUtils.showMessage('保存失败', 'error');
        }
    } catch (error) {
        console.error('保存账户设置失败:', error);
        authUtils.showMessage('保存过程中发生错误', 'error');
    }
}

// 保存高级设置
async function saveAdvancedSettings() {
    const settings = {
        cache: {
            enableBrowserCache: document.querySelector('#advanced-form input[type="checkbox"]:nth-of-type(1)').checked,
            enableCDNCache: document.querySelector('#advanced-form input[type="checkbox"]:nth-of-type(2)').checked
        },
        backup: {
            enableAutoBackup: document.querySelector('#advanced-form input[type="checkbox"]:nth-of-type(4)').checked,
            frequency: document.querySelector('#advanced-form select').value
        },
        api: {
            apiKey: document.querySelector('#advanced-form input[type="password"]').value
        }
    };
    
    try {
        // 模拟API请求
        const response = await mockSaveSettings('advanced', settings);
        
        if (response.success) {
            authUtils.showMessage('高级设置保存成功', 'success');
        } else {
            authUtils.showMessage('保存失败', 'error');
        }
    } catch (error) {
        console.error('保存高级设置失败:', error);
        authUtils.showMessage('保存过程中发生错误', 'error');
    }
}

// 请求浏览器通知权限
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                authUtils.showMessage('浏览器通知已启用', 'success');
            } else if (permission === 'denied') {
                authUtils.showMessage('浏览器通知已被拒绝', 'info');
            }
        });
    } else {
        authUtils.showMessage('您的浏览器不支持通知功能', 'info');
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

// 模拟获取设置API
async function mockGetSettings() {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        siteName: '我的博客',
        siteDescription: '分享技术见解、创意思考和人生感悟的个人博客平台',
        siteLanguage: 'zh-CN',
        timezone: 'Asia/Shanghai',
        theme: 'auto',
        primaryColor: '#137fec',
        fontSize: 'medium',
        email: 'admin@example.com'
    };
}

// 模拟保存设置API
async function mockSaveSettings(category, settings) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 保存到本地存储
    const existingSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    existingSettings[category] = settings;
    localStorage.setItem('userSettings', JSON.stringify(existingSettings));
    
    return {
        success: true,
        message: '设置保存成功'
    };
}