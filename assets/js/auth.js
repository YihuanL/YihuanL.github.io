// 认证相关JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化认证功能
    initAuthToggle();
    initPasswordToggle();
    initLoginForm();
    initRegisterForm();
    initThirdPartyAuth();
});

// 切换登录/注册表单
function initAuthToggle() {
    const authToggles = document.querySelectorAll('input[name="auth-toggle"]');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const titleElement = document.querySelector('h1');
    const subtitleElement = document.querySelector('p.text-center');
    
    authToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            if (this.value === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
                titleElement.textContent = '欢迎回来';
                subtitleElement.textContent = '登录您的账户以继续';
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
                titleElement.textContent = '创建账户';
                subtitleElement.textContent = '注册新账户开始您的博客之旅';
            }
        });
    });
}

// 密码可见性切换
function initPasswordToggle() {
    const passwordToggles = [
        { button: 'toggle-login-password', input: 'login-password' },
        { button: 'toggle-register-password', input: 'register-password' },
        { button: 'toggle-register-confirm-password', input: 'register-confirm-password' }
    ];
    
    passwordToggles.forEach(({ button, input }) => {
        const buttonElement = document.getElementById(button);
        const inputElement = document.getElementById(input);
        const iconElement = buttonElement.querySelector('.material-icons-outlined');
        
        if (buttonElement && inputElement && iconElement) {
            buttonElement.addEventListener('click', function() {
                const type = inputElement.getAttribute('type') === 'password' ? 'text' : 'password';
                inputElement.setAttribute('type', type);
                iconElement.textContent = type === 'password' ? 'visibility' : 'visibility_off';
            });
        }
    });
}

// 初始化登录表单
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = loginForm.querySelector('input[type="checkbox"]').checked;
            
            // 清除之前的错误信息
            clearFormErrors(loginForm);
            
            // 验证表单
            if (!validateLoginForm(email, password)) {
                return;
            }
            
            // 显示加载状态
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = '登录中...';
            submitButton.disabled = true;
            
            try {
                // 模拟API请求
                const response = await mockLoginRequest(email, password, rememberMe);
                
                if (response.success) {
                    // 保存用户信息
                    localStorage.setItem('user', JSON.stringify(response.user));
                    localStorage.setItem('token', response.token);
                    
                    // 显示成功消息
                    showMessage('登录成功！正在跳转...', 'success');
                    
                    // 跳转到首页或个人资料页面
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1500);
                } else {
                    showMessage(response.message || '登录失败，请检查您的凭据', 'error');
                }
            } catch (error) {
                console.error('登录错误:', error);
                showMessage('登录过程中发生错误，请稍后重试', 'error');
            } finally {
                // 恢复按钮状态
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// 初始化注册表单
function initRegisterForm() {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // 清除之前的错误信息
            clearFormErrors(registerForm);
            
            // 验证表单
            if (!validateRegisterForm(username, email, password, confirmPassword, termsAccepted)) {
                return;
            }
            
            // 显示加载状态
            const submitButton = registerForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = '注册中...';
            submitButton.disabled = true;
            
            try {
                // 模拟API请求
                const response = await mockRegisterRequest(username, email, password);
                
                if (response.success) {
                    // 显示成功消息
                    showMessage('注册成功！请登录您的账户', 'success');
                    
                    // 切换到登录表单
                    setTimeout(() => {
                        const loginToggle = document.querySelector('input[name="auth-toggle"][value="login"]');
                        loginToggle.checked = true;
                        loginToggle.dispatchEvent(new Event('change'));
                        
                        // 预填邮箱
                        document.getElementById('login-email').value = email;
                    }, 1500);
                } else {
                    showMessage(response.message || '注册失败，请稍后重试', 'error');
                }
            } catch (error) {
                console.error('注册错误:', error);
                showMessage('注册过程中发生错误，请稍后重试', 'error');
            } finally {
                // 恢复按钮状态
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// 初始化第三方认证
function initThirdPartyAuth() {
    const googleButton = document.querySelector('button:has(svg[path^="M22.56"])');
    const githubButton = document.querySelector('button:has(svg[d^="M12 0c-6.626"])');
    
    if (googleButton) {
        googleButton.addEventListener('click', function() {
            showMessage('Google 登录功能正在开发中', 'info');
        });
    }
    
    if (githubButton) {
        githubButton.addEventListener('click', function() {
            showMessage('GitHub 登录功能正在开发中', 'info');
        });
    }
}

// 验证登录表单
function validateLoginForm(email, password) {
    let isValid = true;
    
    // 验证邮箱/用户名
    if (!email.trim()) {
        formValidation.showError(document.getElementById('login-email'), '请输入邮箱或用户名');
        isValid = false;
    }
    
    // 验证密码
    if (!password) {
        formValidation.showError(document.getElementById('login-password'), '请输入密码');
        isValid = false;
    } else if (password.length < 6) {
        formValidation.showError(document.getElementById('login-password'), '密码至少6位');
        isValid = false;
    }
    
    return isValid;
}

// 验证注册表单
function validateRegisterForm(username, email, password, confirmPassword, termsAccepted) {
    let isValid = true;
    
    // 验证用户名
    if (!username.trim()) {
        formValidation.showError(document.getElementById('register-username'), '请输入用户名');
        isValid = false;
    } else if (username.length < 3) {
        formValidation.showError(document.getElementById('register-username'), '用户名至少3位');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        formValidation.showError(document.getElementById('register-username'), '用户名只能包含字母、数字和下划线');
        isValid = false;
    }
    
    // 验证邮箱
    if (!email.trim()) {
        formValidation.showError(document.getElementById('register-email'), '请输入邮箱');
        isValid = false;
    } else if (!formValidation.isValidEmail(email)) {
        formValidation.showError(document.getElementById('register-email'), '请输入有效的邮箱地址');
        isValid = false;
    }
    
    // 验证密码
    if (!password) {
        formValidation.showError(document.getElementById('register-password'), '请输入密码');
        isValid = false;
    } else if (!formValidation.isStrongPassword(password)) {
        formValidation.showError(document.getElementById('register-password'), '密码不符合要求');
        isValid = false;
    }
    
    // 验证确认密码
    if (!confirmPassword) {
        formValidation.showError(document.getElementById('register-confirm-password'), '请确认密码');
        isValid = false;
    } else if (password !== confirmPassword) {
        formValidation.showError(document.getElementById('register-confirm-password'), '两次输入的密码不一致');
        isValid = false;
    }
    
    // 验证服务条款
    if (!termsAccepted) {
        showMessage('请阅读并同意服务条款和隐私政策', 'error');
        isValid = false;
    }
    
    return isValid;
}

// 清除表单错误
function clearFormErrors(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        formValidation.clearError(input);
    });
}

// 显示消息
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
    
    // 根据类型设置样式
    switch (type) {
        case 'success':
            messageElement.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            messageElement.classList.add('bg-red-500', 'text-white');
            break;
        case 'info':
        default:
            messageElement.classList.add('bg-blue-500', 'text-white');
            break;
    }
    
    messageElement.textContent = message;
    
    // 添加到页面
    document.body.appendChild(messageElement);
    
    // 显示动画
    setTimeout(() => {
        messageElement.classList.remove('translate-x-full');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        messageElement.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 300);
    }, 3000);
}

// 模拟登录API请求
async function mockLoginRequest(email, password, rememberMe) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟验证逻辑
    if (email === 'admin@example.com' && password === 'password123') {
        return {
            success: true,
            user: {
                id: 1,
                username: 'admin',
                email: 'admin@example.com',
                displayName: '管理员',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnCXuMuCSZpMJwRtbfDE3s5soXApRfIghmlBcLCn3ayKepG1fuGIFryhedoWNDE9GC0BGyWUX2mOwjKZYcHOGgF-ulo2lCsUxBEdJL6rNs3j8bUslLpzUUuuqeUPS8v8_xIGSq8GCWrqrgZ_GEBIJti3hguFcZQJ3diWXCOBA4YOMNfDEFReZJrRWyatNP3zVfpDoNhvuCo98NjRp8BngZdzkvvpdgcYJrQLkFGDbnSTeVBBL1zqW3NeCkZ-6DGX6JmXWFZ60Twt4m'
            },
            token: 'mock-jwt-token-' + Date.now()
        };
    } else {
        return {
            success: false,
            message: '邮箱或密码错误'
        };
    }
}

// 模拟注册API请求
async function mockRegisterRequest(username, email, password) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟验证逻辑
    if (email === 'admin@example.com') {
        return {
            success: false,
            message: '该邮箱已被注册'
        };
    } else {
        return {
            success: true,
            message: '注册成功'
        };
    }
}

// 检查登录状态
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            return {
                isAuthenticated: true,
                user: userData
            };
        } catch (error) {
            console.error('解析用户数据失败:', error);
            logout();
            return { isAuthenticated: false };
        }
    }
    
    return { isAuthenticated: false };
}

// 登出功能
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'pages/login.html';
}

// 导出函数供其他脚本使用
window.authUtils = {
    checkAuthStatus,
    logout,
    showMessage
};