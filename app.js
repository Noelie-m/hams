// ======================================
// HAMS - Home Appliance Management System
// with GitHub Gist Sync
// ======================================

const GIST_FILENAME = 'hams_data.json';
const STORAGE_KEY = 'hams_data';

let appliances = [];
let nextId = 1;
let gistId = null;
let isSyncing = false;

// DOM要素
const applianceForm = document.getElementById('applianceForm');
const applianceList = document.getElementById('applianceList');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const addNewBtn = document.getElementById('addNewBtn');
const formModal = document.getElementById('formModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const formTitle = document.getElementById('formTitle');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const filterStatus = document.getElementById('filterStatus');
const sortBy = document.getElementById('sortBy');
const syncStatus = document.getElementById('syncStatus');

// イベントリスナー
applianceForm.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);
addNewBtn.addEventListener('click', () => openModal());
searchInput.addEventListener('input', handleSearch);
clearSearchBtn.addEventListener('click', clearSearch);
filterStatus.addEventListener('change', renderAppliances);
sortBy.addEventListener('change', renderAppliances);

formModal.addEventListener('click', (e) => {
    if (e.target === formModal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && formModal.classList.contains('show')) closeModal();
});

// ======================================
// 同期ステータス表示
// ======================================

function setSyncStatus(status, text) {
    const icons = {
        loading: '⏳',
        synced: '☁️',
        error: '⚠️',
        offline: '💾'
    };

    let link = '';
    if (status === 'synced' && gistId) {
        link = `<a href="https://gist.github.com/${gistId}" target="_blank" class="sync-link">🔗</a>`;
    } else if (status === 'synced') {
        link = `<a href="https://gist.github.com/" target="_blank" class="sync-link">🔗</a>`;
    }

    syncStatus.innerHTML = `
        <span class="sync-icon">${icons[status] || '❓'}</span>
        <span class="sync-text">${text}</span>
        ${link}
    `;
    syncStatus.className = `sync-status sync-${status}`;
}

// ======================================
// GitHub Gist API
// ======================================

function hasGistConfig() {
    return typeof CONFIG !== 'undefined' && CONFIG.GITHUB_TOKEN;
}

async function loadFromGist() {
    if (!hasGistConfig()) {
        setSyncStatus('offline', 'ローカル保存');
        return false;
    }

    setSyncStatus('loading', '読み込み中...');

    try {
        // Gist IDがあれば直接取得
        if (CONFIG.GIST_ID) {
            const res = await fetch(`https://api.github.com/gists/${CONFIG.GIST_ID}`, {
                headers: { 'Authorization': `token ${CONFIG.GITHUB_TOKEN}` }
            });

            if (res.ok) {
                const gist = await res.json();
                gistId = gist.id;

                if (gist.files[GIST_FILENAME]) {
                    const data = JSON.parse(gist.files[GIST_FILENAME].content);
                    appliances = data.appliances || [];
                    nextId = data.nextId || 1;
                    saveToLocalStorage(); // バックアップ
                    setSyncStatus('synced', 'Gist同期中');
                    return true;
                }
            }
        }

        // Gist IDがない場合は、既存のGistを検索
        const res = await fetch('https://api.github.com/gists', {
            headers: { 'Authorization': `token ${CONFIG.GITHUB_TOKEN}` }
        });

        if (res.ok) {
            const gists = await res.json();
            const existing = gists.find(g => g.files[GIST_FILENAME]);

            if (existing) {
                gistId = existing.id;
                const data = JSON.parse(existing.files[GIST_FILENAME].content);
                appliances = data.appliances || [];
                nextId = data.nextId || 1;
                saveToLocalStorage();
                setSyncStatus('synced', 'Gist同期中');
                console.log('既存のGistを発見:', gistId);
                return true;
            }
        }

        // 既存がなければ新規作成
        setSyncStatus('synced', 'Gist同期中');
        return false;

    } catch (error) {
        console.error('Gist読み込みエラー:', error);
        setSyncStatus('error', 'Gistエラー');
        return false;
    }
}

async function saveToGist() {
    if (!hasGistConfig() || isSyncing) return;

    isSyncing = true;
    setSyncStatus('loading', '保存中...');

    const data = { appliances, nextId };
    const content = JSON.stringify(data, null, 2);

    try {
        if (gistId) {
            // 既存のGistを更新
            const res = await fetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: { [GIST_FILENAME]: { content } }
                })
            });

            if (res.ok) {
                setSyncStatus('synced', 'Gist同期中');
            } else {
                throw new Error('Gist更新失敗');
            }
        } else {
            // 新規Gist作成
            const res = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: 'HAMS - Home Appliance Management System Data',
                    public: false,
                    files: { [GIST_FILENAME]: { content } }
                })
            });

            if (res.ok) {
                const gist = await res.json();
                gistId = gist.id;
                setSyncStatus('synced', 'Gist同期中');
                console.log('新規Gist作成:', gistId);
                console.log('config.jsのGIST_IDを更新してください:', gistId);
                showNotification(`Gist作成完了！ ID: ${gistId}`);
            } else {
                throw new Error('Gist作成失敗');
            }
        }
    } catch (error) {
        console.error('Gist保存エラー:', error);
        setSyncStatus('error', 'Gist保存エラー');
    } finally {
        isSyncing = false;
    }
}

// ======================================
// ローカルストレージ (バックアップ)
// ======================================

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            appliances = data.appliances || [];
            nextId = data.nextId || 1;
        }
    } catch (e) {
        appliances = [];
        nextId = 1;
    }
}

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ appliances, nextId }));
}

// ======================================
// データ管理
// ======================================

async function loadData() {
    // まずローカルから読み込み（高速表示のため）
    loadFromLocalStorage();
    updateStats();
    renderAppliances();

    // Gistから読み込み（非同期）
    const loaded = await loadFromGist();
    if (loaded) {
        updateStats();
        renderAppliances();
    }
}

async function saveData() {
    saveToLocalStorage();
    await saveToGist();
}

// ======================================
// UI
// ======================================

function openModal(id = null) {
    resetForm();

    if (id) {
        const a = appliances.find(x => x.id === id);
        if (a) {
            document.getElementById('editId').value = a.id;
            document.getElementById('name').value = a.name;
            document.getElementById('modelNumber').value = a.modelNumber || '';
            document.getElementById('purchasedDate').value = a.purchasedDate || '';
            document.getElementById('disposedDate').value = a.disposedDate || '';
            document.getElementById('price').value = a.price || '';
            document.getElementById('memo').value = a.memo || '';
            formTitle.textContent = '家電を編集';
            submitBtn.textContent = '更新';
        }
    } else {
        formTitle.textContent = '家電を追加';
        submitBtn.textContent = '追加';
    }

    formModal.classList.add('show');
    document.getElementById('name').focus();
}

function closeModal() {
    formModal.classList.remove('show');
    resetForm();
}

function resetForm() {
    applianceForm.reset();
    document.getElementById('editId').value = '';
}

// ======================================
// 検索・フィルター
// ======================================

function handleSearch() {
    clearSearchBtn.style.display = searchInput.value.trim() ? 'block' : 'none';
    renderAppliances();
}

function clearSearch() {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    renderAppliances();
}

function getFilteredAppliances() {
    let filtered = [...appliances];

    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        filtered = filtered.filter(a =>
            a.name.toLowerCase().includes(query) ||
            (a.modelNumber && a.modelNumber.toLowerCase().includes(query))
        );
    }

    const status = filterStatus.value;
    if (status === 'active') filtered = filtered.filter(a => !a.disposedDate);
    else if (status === 'disposed') filtered = filtered.filter(a => a.disposedDate);

    const sort = sortBy.value;
    filtered.sort((a, b) => {
        switch (sort) {
            case 'name': return a.name.localeCompare(b.name, 'ja');
            case 'purchasedDate':
                if (!a.purchasedDate && !b.purchasedDate) return 0;
                if (!a.purchasedDate) return 1;
                if (!b.purchasedDate) return -1;
                return new Date(b.purchasedDate) - new Date(a.purchasedDate);
            case 'price':
                if (!a.price && !b.price) return 0;
                if (!a.price) return 1;
                if (!b.price) return -1;
                return b.price - a.price;
            case 'createdAt': return new Date(b.createdAt) - new Date(a.createdAt);
            default: return 0;
        }
    });

    return filtered;
}

// ======================================
// フォーム
// ======================================

async function handleSubmit(e) {
    e.preventDefault();

    const editId = document.getElementById('editId').value;
    const appliance = {
        id: editId ? parseInt(editId) : nextId++,
        name: document.getElementById('name').value,
        modelNumber: document.getElementById('modelNumber').value || null,
        purchasedDate: document.getElementById('purchasedDate').value || null,
        disposedDate: document.getElementById('disposedDate').value || null,
        price: document.getElementById('price').value ? parseInt(document.getElementById('price').value) : null,
        memo: document.getElementById('memo').value || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (editId) {
        const index = appliances.findIndex(a => a.id === parseInt(editId));
        if (index !== -1) {
            appliance.createdAt = appliances[index].createdAt;
            appliances[index] = appliance;
        }
        showNotification('更新しました');
    } else {
        appliances.push(appliance);
        showNotification('追加しました');
    }

    closeModal();
    await saveData();
    updateStats();
    renderAppliances();
}

function editAppliance(id) { openModal(id); }

async function deleteAppliance(id) {
    if (!confirm('削除しますか？')) return;
    appliances = appliances.filter(a => a.id !== id);
    await saveData();
    updateStats();
    renderAppliances();
    showNotification('削除しました');
}

// ======================================
// 統計
// ======================================

function updateStats() {
    document.getElementById('totalCount').textContent = appliances.length;
    document.getElementById('activeCount').textContent = appliances.filter(a => !a.disposedDate).length;
    document.getElementById('disposedCount').textContent = appliances.filter(a => a.disposedDate).length;
    document.getElementById('totalPrice').textContent = formatPrice(
        appliances.filter(a => !a.disposedDate && a.price).reduce((s, a) => s + a.price, 0)
    );
}

// ======================================
// 一覧表示
// ======================================

function renderAppliances() {
    const filtered = getFilteredAppliances();
    const resultCount = document.getElementById('resultCount');

    resultCount.textContent = (searchInput.value.trim() || filterStatus.value !== 'all')
        ? `${filtered.length}件` : '';

    if (filtered.length === 0) {
        applianceList.innerHTML = `
            <div class="empty-list">
                <div class="empty-list-icon">📭</div>
                <p>${appliances.length === 0 ? '家電が登録されていません' : '検索結果がありません'}</p>
            </div>`;
        return;
    }

    applianceList.innerHTML = filtered.map(a => {
        const disposed = !!a.disposedDate;
        return `
        <div class="appliance-card ${disposed ? 'disposed' : ''}">
            <div class="appliance-row">
                <span class="appliance-name">${escapeHtml(a.name)}</span>
                <span class="appliance-status ${disposed ? 'disposed' : 'active'}">${disposed ? '破棄済み' : '使用中'}</span>
                <span class="appliance-info"><span class="info-label">型番</span> ${escapeHtml(a.modelNumber) || '-'}</span>
                <span class="appliance-info"><span class="info-label">購入日</span> ${formatDate(a.purchasedDate) || '-'}</span>
                <span class="appliance-info"><span class="info-label">破棄日</span> ${formatDate(a.disposedDate) || '-'}</span>
                <span class="appliance-info price">${a.price ? '<span class="info-label">参考価格</span> ' + formatPrice(a.price) : ''}</span>
                <div class="appliance-actions">
                    <button class="btn btn-warning" onclick="editAppliance(${a.id})">編集</button>
                    ${disposed ? `<button class="btn btn-danger" onclick="deleteAppliance(${a.id})">削除</button>` : ''}
                </div>
            </div>
        </div>`;
    }).join('');
}

// ======================================
// ユーティリティ
// ======================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function formatPrice(price) {
    return price ? '¥' + price.toLocaleString() : '¥0';
}

function showNotification(message) {
    const n = document.createElement('div');
    n.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; padding: 16px 24px;
        background: linear-gradient(135deg, #11998e, #38ef7d);
        color: white; border-radius: 12px; font-size: 14px; font-weight: 500;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 2000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    `;
    n.textContent = message;

    if (!document.getElementById('notif-style')) {
        const s = document.createElement('style');
        s.id = 'notif-style';
        s.textContent = `
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        `;
        document.head.appendChild(s);
    }

    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

// ======================================
// 初期化
// ======================================

loadData();
