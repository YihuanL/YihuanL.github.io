// 网站分析页面JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 检查用户认证状态
    const authStatus = authUtils.checkAuthStatus();
    if (!authStatus.isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }
    
    // 初始化分析页面
    initAnalytics();
});

// 初始化分析页面
function initAnalytics() {
    // 加载概览数据
    loadOverviewData();
    
    // 初始化图表
    initCharts();
    
    // 加载热门页面
    loadPopularPages();
    
    // 加载地理位置分布
    loadGeoDistribution();
    
    // 初始化时间范围选择
    initTimeRangeSelector();
    
    // 初始化导出功能
    initExportFeature();
    
    // 初始化实时数据更新
    initRealTimeUpdates();
    
    // 更新用户头像
    updateUserAvatar();
}

// 加载概览数据
async function loadOverviewData() {
    try {
        // 模拟API请求
        const data = await mockGetOverviewData();
        
        // 更新概览卡片
        document.getElementById('total-visits').textContent = formatNumber(data.totalVisits);
        document.getElementById('unique-visitors').textContent = formatNumber(data.uniqueVisitors);
        document.getElementById('page-views').textContent = formatNumber(data.pageViews);
        document.getElementById('avg-duration').textContent = formatDuration(data.avgDuration);
        
    } catch (error) {
        console.error('加载概览数据失败:', error);
    }
}

// 初始化图表
function initCharts() {
    initVisitsTrendChart();
    initDeviceChart();
    initSourceChart();
    initNewReturningChart();
    initBounceRateChart();
    initSessionDurationChart();
}

// 初始化访问量趋势图表
function initVisitsTrendChart() {
    const ctx = document.getElementById('visits-trend-chart').getContext('2d');
    
    // 生成模拟数据
    const labels = [];
    const visitsData = [];
    const pageViewsData = [];
    
    const days = 30; // 默认30天
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        visitsData.push(Math.floor(Math.random() * 800) + 200);
        pageViewsData.push(Math.floor(Math.random() * 2000) + 500);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '访问量',
                    data: visitsData,
                    borderColor: '#137fec',
                    backgroundColor: 'rgba(19, 127, 236, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#137fec',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                {
                    label: '页面浏览量',
                    data: pageViewsData,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#617589',
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    displayColors: true,
                    intersect: false,
                    mode: 'index'
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#617589',
                        maxRotation: 45,
                        minRotation: 45
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

// 初始化设备分布图表
function initDeviceChart() {
    const ctx = document.getElementById('device-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['桌面端', '移动端', '平板'],
            datasets: [{
                data: [65, 30, 5],
                backgroundColor: [
                    '#137fec',
                    '#8b5cf6',
                    '#10b981'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#617589',
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// 初始化流量来源图表
function initSourceChart() {
    const ctx = document.getElementById('source-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['直接访问', '搜索引擎', '社交媒体', '引荐网站', '其他'],
            datasets: [{
                data: [40, 30, 15, 10, 5],
                backgroundColor: [
                    '#137fec',
                    '#8b5cf6',
                    '#10b981',
                    '#f59e0b',
                    '#6b7280'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#617589',
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// 初始化新老访客对比图表
function initNewReturningChart() {
    const ctx = document.getElementById('new-returning-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['新访客', '回访客'],
            datasets: [{
                label: '访客数',
                data: [3200, 5000],
                backgroundColor: ['#10b981', '#137fec'],
                borderWidth: 0,
                borderRadius: 4
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
                    displayColors: false
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

// 初始化跳出率趋势图表
function initBounceRateChart() {
    const ctx = document.getElementById('bounce-rate-chart').getContext('2d');
    
    // 生成模拟数据
    const labels = [];
    const bounceRateData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        bounceRateData.push(Math.floor(Math.random() * 20) + 35);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '跳出率',
                data: bounceRateData,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5
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
                            return '跳出率: ' + context.parsed.y + '%';
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
                    max: 100,
                    grid: {
                        color: 'rgba(97, 117, 137, 0.1)'
                    },
                    ticks: {
                        color: '#617589',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// 初始化会话时长分布图表
function initSessionDurationChart() {
    const ctx = document.getElementById('session-duration-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0-30秒', '30秒-2分钟', '2-5分钟', '5-10分钟', '10分钟+'],
            datasets: [{
                label: '会话数',
                data: [1200, 2300, 2800, 1500, 800],
                backgroundColor: '#8b5cf6',
                borderWidth: 0,
                borderRadius: 4
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
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#617589',
                        maxRotation: 45,
                        minRotation: 45
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

// 加载热门页面
async function loadPopularPages() {
    try {
        // 模拟API请求
        const pages = await mockGetPopularPages();
        
        const container = document.getElementById('popular-pages');
        container.innerHTML = '';
        
        pages.forEach((page, index) => {
            const pageElement = createPopularPageElement(page, index);
            container.appendChild(pageElement);
        });
        
    } catch (error) {
        console.error('加载热门页面失败:', error);
    }
}

// 创建热门页面元素
function createPopularPageElement(page, index) {
    const element = document.createElement('div');
    element.className = 'flex items-center justify-between';
    
    element.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-primary font-bold text-sm">${index + 1}</span>
            </div>
            <div>
                <p class="text-sm font-medium text-text-light dark:text-text-dark">${page.title}</p>
                <p class="text-xs text-subtle-light dark:text-subtle-dark">${page.path}</p>
            </div>
        </div>
        <div class="text-right">
            <p class="text-sm font-medium text-text-light dark:text-text-dark">${formatNumber(page.views)}</p>
            <p class="text-xs text-subtle-light dark:text-subtle-dark">${page.avgDuration}</p>
        </div>
    `;
    
    return element;
}

// 加载地理位置分布
async function loadGeoDistribution() {
    try {
        // 模拟API请求
        const geoData = await mockGetGeoDistribution();
        
        const container = document.getElementById('geo-distribution');
        container.innerHTML = '';
        
        geoData.forEach((geo, index) => {
            const geoElement = createGeoElement(geo, index);
            container.appendChild(geoElement);
        });
        
    } catch (error) {
        console.error('加载地理位置分布失败:', error);
    }
}

// 创建地理位置元素
function createGeoElement(geo, index) {
    const element = document.createElement('div');
    element.className = 'flex items-center justify-between';
    
    element.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-primary font-bold text-sm">${index + 1}</span>
            </div>
            <div>
                <p class="text-sm font-medium text-text-light dark:text-text-dark">${geo.country}</p>
                <p class="text-xs text-subtle-light dark:text-subtle-dark">${geo.city}</p>
            </div>
        </div>
        <div class="text-right">
            <p class="text-sm font-medium text-text-light dark:text-text-dark">${formatNumber(geo.visitors)}</p>
            <p class="text-xs text-subtle-light dark:text-subtle-dark">${geo.percentage}%</p>
        </div>
    `;
    
    return element;
}

// 初始化时间范围选择器
function initTimeRangeSelector() {
    const timeRangeSelect = document.getElementById('time-range');
    
    timeRangeSelect.addEventListener('change', function() {
        const days = parseInt(this.value);
        updateTimeRangeData(days);
    });
}

// 更新时间范围数据
async function updateTimeRangeData(days) {
    try {
        // 显示加载状态
        showLoadingState();
        
        // 模拟API请求
        const data = await mockGetTimeRangeData(days);
        
        // 更新概览数据
        document.getElementById('total-visits').textContent = formatNumber(data.totalVisits);
        document.getElementById('unique-visitors').textContent = formatNumber(data.uniqueVisitors);
        document.getElementById('page-views').textContent = formatNumber(data.pageViews);
        document.getElementById('avg-duration').textContent = formatDuration(data.avgDuration);
        
        // 重新初始化图表
        initCharts();
        
    } catch (error) {
        console.error('更新时间范围数据失败:', error);
    } finally {
        hideLoadingState();
    }
}

// 初始化导出功能
function initExportFeature() {
    const exportBtn = document.getElementById('export-btn');
    
    exportBtn.addEventListener('click', function() {
        exportAnalyticsReport();
    });
}

// 导出分析报告
function exportAnalyticsReport() {
    // 这里可以实现实际的导出功能
    authUtils.showMessage('报告导出功能正在开发中', 'info');
}

// 初始化实时数据更新
function initRealTimeUpdates() {
    // 每30秒更新一次实时数据
    setInterval(updateRealTimeData, 30000);
}

// 更新实时数据
async function updateRealTimeData() {
    try {
        // 模拟API请求
        const data = await mockGetRealTimeData();
        
        // 更新实时数据显示
        document.getElementById('online-users').textContent = data.onlineUsers;
        document.getElementById('today-visits').textContent = formatNumber(data.todayVisits);
        document.getElementById('today-pageviews').textContent = formatNumber(data.todayPageViews);
        document.getElementById('today-avg-duration').textContent = formatDuration(data.todayAvgDuration);
        
    } catch (error) {
        console.error('更新实时数据失败:', error);
    }
}

// 显示加载状态
function showLoadingState() {
    // 可以添加加载动画
    console.log('Loading data...');
}

// 隐藏加载状态
function hideLoadingState() {
    // 可以隐藏加载动画
    console.log('Data loaded');
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

// 格式化时长
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// 模拟获取概览数据API
async function mockGetOverviewData() {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        totalVisits: 24500,
        uniqueVisitors: 8200,
        pageViews: 52800,
        avgDuration: 222 // 秒
    };
}

// 模拟获取热门页面API
async function mockGetPopularPages() {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
        {
            title: '首页',
            path: '/',
            views: 8500,
            avgDuration: '2:45'
        },
        {
            title: '设计系统的原则',
            path: '/article/design-systems',
            views: 3200,
            avgDuration: '5:12'
        },
        {
            title: '文章列表',
            path: '/articles',
            views: 2800,
            avgDuration: '3:30'
        },
        {
            title: 'AI时代的用户体验导航',
            path: '/article/ai-ux',
            views: 2100,
            avgDuration: '4:15'
        },
        {
            title: '关于我们',
            path: '/about',
            views: 1500,
            avgDuration: '1:45'
        }
    ];
}

// 模拟获取地理位置分布API
async function mockGetGeoDistribution() {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
        {
            country: '中国',
            city: '北京',
            visitors: 3200,
            percentage: 39
        },
        {
            country: '中国',
            city: '上海',
            visitors: 2100,
            percentage: 26
        },
        {
            country: '中国',
            city: '深圳',
            visitors: 1500,
            percentage: 18
        },
        {
            country: '美国',
            city: '纽约',
            visitors: 800,
            percentage: 10
        },
        {
            country: '日本',
            city: '东京',
            visitors: 600,
            percentage: 7
        }
    ];
}

// 模拟获取时间范围数据API
async function mockGetTimeRangeData(days) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 根据天数返回不同的数据
    const multiplier = days / 30; // 以30天为基准
    
    return {
        totalVisits: Math.floor(24500 * multiplier),
        uniqueVisitors: Math.floor(8200 * multiplier),
        pageViews: Math.floor(52800 * multiplier),
        avgDuration: Math.floor(222 + (Math.random() * 60 - 30)) // 随机波动
    };
}

// 模拟获取实时数据API
async function mockGetRealTimeData() {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
        onlineUsers: Math.floor(Math.random() * 50) + 100, // 100-150
        todayVisits: Math.floor(Math.random() * 100) + 400, // 400-500
        todayPageViews: Math.floor(Math.random() * 300) + 1700, // 1700-2000
        todayAvgDuration: Math.floor(Math.random() * 60) + 150 // 150-210秒
    };
}