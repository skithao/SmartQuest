const ZHIPU_API_KEY = '1be3a7964e95470e9a3aa181e2472403.klHkoXaE2ZRaMNpZ'; // 请替换为你的智谱 API Key
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v3/model-api/chatglm_std/sse-invoke';

// 新增滚动导航功能
function scrollToLab(section) {
    const labSection = document.getElementById('lab');
    if (section) {
        const target = document.getElementById(section);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else {
        labSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 更新模型展示函数
function showModelDiagram() {
    const modal = document.getElementById('modelDiagramModal');
    modal.style.display = 'block';
    // 3秒后自动显示引导
    setTimeout(() => {
        modal.insertAdjacentHTML('beforeend', `
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                        text-center text-orange-400 animate-pulse">
                滚动下方开始实验 →
            </div>
        `);
    }, 3000);
}

// 改进后的进度管理
let progressState = {
    modules: new Set(['text-generation', 'chat-interaction', 'text-summary']), // 初始已完成的模块
    totalModules: 5,
    addModule(moduleId) {
        if (!this.modules.has(moduleId)) {
            this.modules.add(moduleId);
            this.updateProgress();
        }
    },
    updateProgress() {
        const progress = document.querySelector('.progress-track');
        const width = (this.modules.size / this.totalModules) * 100;
        progress.style.width = `${width}%`;
        document.querySelector('.progress-text').textContent = 
            `当前进度：${this.modules.size}/${this.totalModules} 个模块`;
    }
};

// 在DOM加载和每个实验成功后更新进度
document.addEventListener('DOMContentLoaded', () => progressState.updateProgress());

function closeModelDiagram() {
    const modal = document.getElementById('modelDiagramModal');
    modal.style.display = 'none';
}

// 更新细节切换函数
function toggleDetails(detailsId, button) {
    const details = document.getElementById(detailsId);
    const isExpanded = details.style.maxHeight !== '0px';
    
    // 切换内容高度
    details.style.maxHeight = isExpanded ? '0' : `${details.scrollHeight}px`;
    
    // 切换按钮图标
    const icon = button.querySelector('i');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
    
    // 添加动效类
    details.classList.toggle('opacity-100', !isExpanded);
    details.classList.toggle('opacity-0', isExpanded);
}

// 更新章节切换函数
// 在showSection函数中补充微调逻辑
function showSection(sectionId) {
    // 移除所有按钮激活状态
    document.querySelectorAll('#explanation button').forEach(btn => {
        btn.classList.remove('bg-blue-900/20');
    });
    
    // 设置当前激活状态
    const activeBtn = document.querySelector(`#explanation button[onclick*="${sectionId}"]`);
    if(activeBtn) activeBtn.classList.add('bg-blue-900/20');

    // 原有切换逻辑保持不变
    const sections = ['pretraining', 'fine-tuning', 'inference'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        element.classList.toggle('hidden', id !== sectionId);
        if(id === sectionId) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 50);
        }
    });
}

function toggleAccordion(button) {
    const content = button.nextElementSibling;
    content.classList.toggle('hidden');
}

window.showModelDiagram = showModelDiagram;
window.closeModelDiagram = closeModelDiagram;
window.showSection = showSection;
window.toggleAccordion = toggleAccordion;

// 添加在progressState下方
let isMusicPlaying = true;

function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const icon = document.getElementById('musicIcon');
    
    if (isMusicPlaying) {
        music.pause();
        icon.classList.replace('fa-music', 'fa-volume-mute');
    } else {
        music.play();
        icon.classList.replace('fa-volume-mute', 'fa-music');
    }
    isMusicPlaying = !isMusicPlaying;
}

// 在DOMContentLoaded事件中添加
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('bgMusic').play().catch(() => {
        console.log('需要用户交互后才能自动播放音乐');
    });
});


function toggleCaseDetails(button) {
    const dropdown = button.nextElementSibling;
    const isExpanded = dropdown.style.maxHeight && dropdown.style.maxHeight !== '0px';
    
    // 关闭所有已打开的菜单
    document.querySelectorAll('.details-dropdown').forEach(d => {
        d.style.maxHeight = '0';
        d.previousElementSibling.querySelector('.fa-caret-down').style.transform = 'rotate(0deg)';
    });

    if (!isExpanded) {
        dropdown.style.maxHeight = `${dropdown.scrollHeight}px`;
        button.querySelector('.fa-caret-down').style.transform = 'rotate(180deg)';
    }
}

// 点击外部关闭菜单
document.addEventListener('click', (e) => {
    if (!e.target.closest('.show-details-btn')) {
        document.querySelectorAll('.details-dropdown').forEach(d => {
            d.style.maxHeight = '0';
            d.previousElementSibling.querySelector('.fa-caret-down').style.transform = 'rotate(0deg)';
        });
    }
});
    const details = button.getAttribute('data-details');
    const tooltip = document.createElement('div');
    
    tooltip.className = 'case-tooltip bg-gray-800 p-4 rounded-lg absolute z-10';
    tooltip.innerHTML = `
        <div class="text-sm leading-relaxed">${details}</div>
        <div class="absolute w-3 h-3 bg-gray-800 transform rotate-45 -bottom-1.5 left-4"></div>
    `;

    const rect = button.getBoundingClientRect();
    tooltip.style.top = `${rect.top - 100}px`;
    tooltip.style.left = `${rect.left}px`;
    
    document.body.appendChild(tooltip);
    
    // 点击外部区域关闭提示
    const closeTooltip = (e) => {
        if (!tooltip.contains(e.target)) {
            tooltip.remove();
            document.removeEventListener('click', closeTooltip);
        }
    };
    
    document.addEventListener('click', closeTooltip);