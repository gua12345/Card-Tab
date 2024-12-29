const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Card Tab</title>
<style>
body {
  font-family: Arial, sans-serif;
  background-color: #d8eac4;
  margin: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s ease;
}

/* 密码输入界面样式 */
#password-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.numpad-container {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
}

.numpad-title {
  margin-bottom: 20px;
  font-size: 18px;
}

.password-dots {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ddd;
  display: inline-block;
}

.dot.active {
  background: #007bff;
}

.numpad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 0 auto;
}

.num-btn {
  padding: 15px;
  font-size: 20px;
  border: 1px solid #ddd;
  background: #f8f9fa;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.num-btn:hover {
  background: #e9ecef;
}

.clear-btn {
  background: #ffc107;
  color: #000;
}

.delete-btn {
  background: #dc3545;
  color: #fff;
}

/* 原有的样式保持不变 */
.card-container {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
  }
  
  .card {
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: #a0c9e5;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: grab;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    width: 200px;
    height: auto;
  }
  
  .card-top {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .card-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: bold;
  }
  
  .card-url {
    color: #555;
    font-size: 12px;
    word-break: break-all;
  }
  
  .card.dragging {
    opacity: 0.8;
    transform: scale(1.05);
    cursor: grabbing;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .delete-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    display: none;
  }
  
  .admin-controls {
    position: fixed;
    top: 10px;
    right: 10px;
    font-size: 60%;
  }
  
  .admin-controls input {
    padding: 5px;
    font-size: 60%;
  }
  
  .admin-controls button {
    padding: 5px 10px;
    font-size: 60%;
    margin-left: 10px;
  }
  
  .add-remove-controls {
    display: none;
    margin-top: 10px;
  }
  
  .round-btn {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    text-align: center;
    font-size: 24px;
    line-height: 40px;
    cursor: pointer;
    margin: 0 10px;
  }
  
  #theme-toggle {
    position: fixed;
    bottom: 10px;
    left: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    text-align: center;
    font-size: 24px;
    line-height: 40px;
    cursor: pointer;
  }
  
  #dialog-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
  }
  
  #dialog-box {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  #dialog-box label {
    display: block;
    margin-bottom: 5px;
  }
  
  #dialog-box input, #dialog-box select {
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
  }
  
  #dialog-box button {
    padding: 5px 10px;
    margin-right: 10px;
  }
  
  .section {
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
</style>
</head>
<body>
<!-- 密码输入界面 -->
<div id="password-overlay">
  <div class="numpad-container">
    <div class="numpad-title">请输入密码</div>
    <div class="password-dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <div class="numpad-grid">
      <button class="num-btn" data-num="1">1</button>
      <button class="num-btn" data-num="2">2</button>
      <button class="num-btn" data-num="3">3</button>
      <button class="num-btn" data-num="4">4</button>
      <button class="num-btn" data-num="5">5</button>
      <button class="num-btn" data-num="6">6</button>
      <button class="num-btn" data-num="7">7</button>
      <button class="num-btn" data-num="8">8</button>
      <button class="num-btn" data-num="9">9</button>
      <button class="num-btn clear-btn">清除</button>
      <button class="num-btn" data-num="0">0</button>
      <button class="num-btn delete-btn">←</button>
    </div>
  </div>
</div>

<!-- 原有的HTML内容 -->
<h1>我的导航</h1>

<div class="admin-controls">
<input type="password" id="admin-password" placeholder="输入密码">
<button id="admin-mode-btn" onclick="toggleAdminMode()">进入管理模式</button>
</div>

<div class="add-remove-controls">
<button class="round-btn" onclick="showAddDialog()">+</button>
<button class="round-btn" onclick="toggleRemoveMode()">-</button>
</div>

<div id="sections-container">
<!-- 分类将在这里动态生成 -->
</div>

<button id="theme-toggle" onclick="toggleTheme()">&#9681;</button>

<div id="dialog-overlay">
<div id="dialog-box">
<label for="name-input">名称</label>
<input type="text" id="name-input">
<label for="url-input">地址</label>
<input type="text" id="url-input">
<label for="category-select">选择分类</label>
<select id="category-select">
<!-- 分类选项将在这里动态生成 -->
</select>
<button onclick="addLink()">确定</button>
<button onclick="hideAddDialog()">取消</button>
</div>
</div>
<div class="copyright">
    <!--    请不要删除 -->
    <p>   项目地址： <a href="https://github.com/hmhm2022/Card-Tab" target="_blank">GitHub</a>   烦请点个star！
</div>

<script>
// 密码验证相关代码
let currentPassword = '';
const PASSWORD_LENGTH = 4;

function initNumpad() {
  const numButtons = document.querySelectorAll('.num-btn');
  numButtons.forEach(button => {
    button.addEventListener('click', handleNumpadClick);
  });
}

function handleNumpadClick(e) {
  const button = e.target;
  
  if (button.classList.contains('clear-btn')) {
    clearPassword();
  } else if (button.classList.contains('delete-btn')) {
    deleteLastDigit();
  } else {
    const num = button.dataset.num;
    if (num !== undefined) {
      addDigit(num);
    }
  }
}

function addDigit(digit) {
  if (currentPassword.length < PASSWORD_LENGTH) {
    currentPassword += digit;
    updatePasswordDots();
    
    if (currentPassword.length === PASSWORD_LENGTH) {
      verifyPassword();
    }
  }
}

function deleteLastDigit() {
  currentPassword = currentPassword.slice(0, -1);
  updatePasswordDots();
}

function clearPassword() {
  currentPassword = '';
  updatePasswordDots();
}

function updatePasswordDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index < currentPassword.length);
  });
}

async function verifyPassword() {
  try {
    const response = await fetch('/api/verifyNumPassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: currentPassword })
    });
    
    const result = await response.json();
    if (result.valid) {
      document.getElementById('password-overlay').style.display = 'none';
    } else {
      alert('密码错误，请重试');
      clearPassword();
    }
  } catch (error) {
    console.error('验证密码时出错:', error);
    alert('验证失败，请重试');
    clearPassword();
  }
}

// 页面加载时初始化数字键盘
document.addEventListener('DOMContentLoaded', initNumpad);

// 原有的JavaScript代码
let isAdmin = false; 
let removeMode = false; 
let isDarkTheme = false; 
let links = []; 
const categories = {
"常用网站": [],                   // **编辑自己的网站分类**
"工具导航": [],
"游戏娱乐": [],
"影音视听": [],
"技术论坛": []
};

async function loadLinks() {
const response = await fetch('/api/getLinks?userId=testUser');
links = await response.json();

Object.keys(categories).forEach(key => {
categories[key] = [];
});

links.forEach(link => {
if (categories[link.category]) {
categories[link.category].push(link);
}
});

loadSections();
updateCategorySelect();
// applyTheme();
}

function loadSections() {
const container = document.getElementById('sections-container');
container.innerHTML = '';

Object.keys(categories).forEach(category => {
const section = document.createElement('div');
section.className = 'section';

const title = document.createElement('div');
title.className = 'section-title';
title.textContent = category;

const cardContainer = document.createElement('div');
cardContainer.className = 'card-container';
cardContainer.id = category;

section.appendChild(title);
section.appendChild(cardContainer);

categories[category].forEach(link => {
createCard(link, cardContainer);
});

container.appendChild(section);
});
}

function createCard(link, container) {
const card = document.createElement('div');
card.className = 'card';
card.setAttribute('draggable', isAdmin);

const cardTop = document.createElement('div');
cardTop.className = 'card-top';

const icon = document.createElement('img');
icon.className = 'card-icon';
// icon.src = 'https://www.google.com/s2/favicons?domain=' + link.url;
icon.src = 'https://favicon.zhusl.com/ico?url=' + link.url;
icon.alt = 'Website Icon';

const title = document.createElement('div');
title.className = 'card-title';
title.textContent = link.name;

cardTop.appendChild(icon);
cardTop.appendChild(title);

const url = document.createElement('div');
url.className = 'card-url';
url.textContent = link.url;

card.appendChild(cardTop);
card.appendChild(url);

//  URL 检查和修正
function correctUrl(url) {
if (url.startsWith('http://') || url.startsWith('https://')) {
return url;
} else {
return 'http://' + url;
}
}

let correctedUrl = correctUrl(link.url);

if (!isAdmin) {
card.addEventListener('click', () => {
window.open(correctedUrl, '_blank');
});
}

const deleteBtn = document.createElement('button');
deleteBtn.textContent = '–';
deleteBtn.className = 'delete-btn';
deleteBtn.onclick = function (event) {
event.stopPropagation();
removeCard(card);
};
card.appendChild(deleteBtn);

if (isDarkTheme) {
card.style.backgroundColor = '#1e1e1e';
card.style.color = '#ffffff';
card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
} else {
card.style.backgroundColor = '#a0c9e5';
card.style.color = '#333';
card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
}

card.addEventListener('dragstart', dragStart);
card.addEventListener('dragover', dragOver);
card.addEventListener('dragend', dragEnd);
card.addEventListener('drop', drop);

if (isAdmin && removeMode) {
deleteBtn.style.display = 'block';
}

container.appendChild(card);
}

function updateCategorySelect() {
const categorySelect = document.getElementById('category-select');
categorySelect.innerHTML = '';

Object.keys(categories).forEach(category => {
const option = document.createElement('option');
option.value = category;
option.textContent = category;
categorySelect.appendChild(option);
});
}

async function saveLinks() {
let links = [];
for (const category in categories) {
links = links.concat(categories[category]);
}

await fetch('/api/saveOrder', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ userId: 'testUser', links }),
});
}

function addLink() {
const name = document.getElementById('name-input').value;
const url = document.getElementById('url-input').value;
const category = document.getElementById('category-select').value;

if (name && url && category) {
const newLink = { name, url, category };

if (!categories[category]) {
categories[category] = [];
}
categories[category].push(newLink);

const container = document.getElementById(category);
createCard(newLink, container);

saveLinks();

document.getElementById('name-input').value = '';
document.getElementById('url-input').value = '';
hideAddDialog();
}
}

function removeCard(card) {
const url = card.querySelector('.card-url').textContent;
let category;
for (const key in categories) {
const index = categories[key].findIndex(link => link.url === url);
if (index !== -1) {
categories[key].splice(index, 1);
category = key;
break;
}
}
card.remove();

saveLinks();
}

let draggedCard = null;

function dragStart(event) {
if (!isAdmin) return;
draggedCard = event.target;
draggedCard.classList.add('dragging');
event.dataTransfer.effectAllowed = "move";
}

function dragOver(event) {
if (!isAdmin) return;
event.preventDefault();
const target = event.target.closest('.card');
if (target && target !== draggedCard) {
const container = target.parentElement;
const mousePositionX = event.clientX;
const targetRect = target.getBoundingClientRect();

if (mousePositionX < targetRect.left + targetRect.width / 2) {
container.insertBefore(draggedCard, target);
} else {
container.insertBefore(draggedCard, target.nextSibling);
}
}
}

function drop(event) {
if (!isAdmin) return;
event.preventDefault();
draggedCard.classList.remove('dragging');
draggedCard = null;
saveCardOrder();
}

// function dragEnd(event) {
// draggedCard.classList.remove('dragging');
function dragEnd(event) {
if (draggedCard) {
draggedCard.classList.remove('dragging');
}
}

async function saveCardOrder() {
if (!isAdmin) return;
const containers = document.querySelectorAll('.card-container');
let newLinks = [];

containers.forEach(container => {
const category = container.id;
categories[category] = [];
[...container.children].forEach(card => {
const url = card.querySelector('.card-url').textContent;
const name = card.querySelector('.card-title').textContent;
const link = { name, url, category };
categories[category].push(link);
newLinks.push(link);
});
});

links = newLinks;

await fetch('/api/saveOrder', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ userId: 'testUser', links: newLinks }),
});
}


function toggleAdminMode() {
const passwordInput = document.getElementById('admin-password');
const adminBtn = document.getElementById('admin-mode-btn');
const addRemoveControls = document.querySelector('.add-remove-controls');

if (!isAdmin) {
verifyPassword(passwordInput.value)
.then(isValid => {
if (isValid) {
isAdmin = true;
adminBtn.textContent = "退出管理模式";
alert('已进入管理模式');
addRemoveControls.style.display = 'block';
reloadCardsAsAdmin();
} else {
alert('密码错误');
}
});
} else {
isAdmin = false;
removeMode = false;
adminBtn.textContent = "进入管理模式";
alert('已退出管理模式');
addRemoveControls.style.display = 'none';
const deleteButtons = document.querySelectorAll('.delete-btn');
deleteButtons.forEach(btn => btn.style.display = 'none');
reloadCardsAsAdmin();
}

passwordInput.value = '';
}

function reloadCardsAsAdmin() {
document.querySelectorAll('.card-container').forEach(container => {
container.innerHTML = '';
});
loadLinks().then(() => {
if (isDarkTheme) {
applyDarkTheme();
}
});
}

function applyDarkTheme() {
document.body.style.backgroundColor = '#121212';
document.body.style.color = '#ffffff';
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
card.style.backgroundColor = '#1e1e1e';
card.style.color = '#ffffff';
card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
});
}

function showAddDialog() {
document.getElementById('dialog-overlay').style.display = 'flex';
}

function hideAddDialog() {
document.getElementById('dialog-overlay').style.display = 'none';
}


function toggleRemoveMode() {
removeMode = !removeMode;
const deleteButtons = document.querySelectorAll('.delete-btn');
deleteButtons.forEach(btn => {
btn.style.display = removeMode ? 'block' : 'none';
});
}

function toggleTheme() {
isDarkTheme = !isDarkTheme;
// 设置暗色主题和亮色主题的背景色
document.body.style.backgroundColor = isDarkTheme ? '#121212' : '#d8eac4';
// 设置暗色主题和亮色主题的文本颜色
document.body.style.color = isDarkTheme ? '#ffffff' : '#333';

const cards = document.querySelectorAll('.card');
cards.forEach(card => {
// 卡片背景和文本颜色设置
card.style.backgroundColor = isDarkTheme ? '#1e1e1e' : '#a0c9e5';
card.style.color = isDarkTheme ? '#ffffff' : '#333';
// 卡片阴影的设置，增强暗色主题的阴影
card.style.boxShadow = isDarkTheme
? '0 4px 8px rgba(0, 0, 0, 0.5)'
: '0 4px 8px rgba(0, 0, 0, 0.1)';
});

const dialogBox = document.getElementById('dialog-box');
// 对话框背景和文本颜色设置
dialogBox.style.backgroundColor = isDarkTheme ? '#1e1e1e' : '#ffffff';
dialogBox.style.color = isDarkTheme ? '#ffffff' : '#333';

const inputs = dialogBox.querySelectorAll('input, select');
inputs.forEach(input => {
// 输入框背景和文本颜色设置
input.style.backgroundColor = isDarkTheme ? '#333333' : '#ffffff';
input.style.color = isDarkTheme ? '#ffffff' : '#333';
});
}


async function verifyPassword(inputPassword) {
const response = await fetch('/api/verifyPassword', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ password: inputPassword }),
});
const result = await response.json();
return result.valid;
}

loadLinks();
</script>
</body>
</html>`;

// Worker代码
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      
      // 处理根路径请求
      if (url.pathname === '/') {
        return new Response(HTML_CONTENT, {
          headers: { 
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // 处理密码验证请求
      if (url.pathname === '/api/verifyNumPassword' && request.method === 'POST') {
        try {
          const { password } = await request.json();
          const correctPassword = env.NUM_PASSWORD || '123456'; // 添加默认密码
          const isValid = password === correctPassword;
          
          return new Response(JSON.stringify({ valid: isValid }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Invalid request body' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      }

      // 处理链接获取请求
      if (url.pathname === '/api/getLinks') {
        const userId = url.searchParams.get('userId') || 'testUser';
        try {
          const links = await env.CARD_ORDER.get(userId);
          return new Response(links || '[]', {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        } catch (error) {
          return new Response('[]', {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      }

      // 处理保存顺序请求
      if (url.pathname === '/api/saveOrder' && request.method === 'POST') {
        try {
          const { userId, links } = await request.json();
          await env.CARD_ORDER.put(userId || 'testUser', JSON.stringify(links));
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Failed to save order' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      }

      // 处理管理员密码验证请求
      if (url.pathname === '/api/verifyPassword' && request.method === 'POST') {
        try {
          const { password } = await request.json();
          const isValid = password === (env.ADMIN_PASSWORD || 'admin'); // 添加默认管理员密码
          return new Response(JSON.stringify({ valid: isValid }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Invalid request body' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      }

      // 处理 OPTIONS 请求（CORS预检请求）
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        });
      }

      // 处理未知路径
      return new Response('Not Found', { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      // 处理所有未捕获的错误
      return new Response(JSON.stringify({ error: 'Internal Server Error', message: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
