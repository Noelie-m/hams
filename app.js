// グローバル変数
let fileHandle = null;
let appliances = [];
let nextId = 1;

// DOM要素
const loadFileBtn = document.getElementById('loadFileBtn');
const saveFileBtn = document.getElementById('saveFileBtn');
const createNewBtn = document.getElementById('createNewBtn');
const noFileMessage = document.getElementById('noFileMessage');
const appContent = document.getElementById('appContent');
const applianceForm = document.getElementById('applianceForm');
const applianceList = document.getElementById('applianceList');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

// イベントリスナー
loadFileBtn.addEventListener('click', loadFile);
saveFileBtn.addEventListener('click', saveFile);
createNewBtn.addEventListener('click', createNewFile);
applianceForm.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', cancelEdit);

// ファイルを開く
async function loadFile() {
    try {
        const [handle] = await window.showOpenFilePicker({
            types: [{
                description: 'JSON Files',
                accept: { 'application/json': ['.json'] }
            }],
            multiple: false
        });

        fileHandle = handle;
        const file = await handle.getFile();
        const contents = await file.text();
        const data = JSON.parse(contents);

        appliances = data.appliances || [];
        nextId = data.nextId || 1;

        showAppContent();
        renderAppliances();
        saveFileBtn.disabled = false;
    } catch (error) {
        if (error.name !== 'AbortError') {
            alert('ファイルの読み込みに失敗しました: ' + error.message);
        }
    }
}

// ファイルを保存
async function saveFile() {
    if (!fileHandle) {
        alert('ファイルが選択されていません');
        return;
    }

    try {
        const writable = await fileHandle.createWritable();
        const data = {
            appliances,
            nextId
        };
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();
        alert('保存しました');
    } catch (error) {
        alert('保存に失敗しました: ' + error.message);
    }
}

// 新規作成
async function createNewFile() {
    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: 'data.json',
            types: [{
                description: 'JSON Files',
                accept: { 'application/json': ['.json'] }
            }]
        });

        fileHandle = handle;
        appliances = [];
        nextId = 1;

        const writable = await handle.createWritable();
        const data = {
            appliances: [],
            nextId: 1
        };
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();

        showAppContent();
        renderAppliances();
        saveFileBtn.disabled = false;
        alert('新しいファイルを作成しました');
    } catch (error) {
        if (error.name !== 'AbortError') {
            alert('ファイルの作成に失敗しました: ' + error.message);
        }
    }
}

// アプリコンテンツを表示
function showAppContent() {
    noFileMessage.style.display = 'none';
    appContent.style.display = 'block';
}

// フォーム送信
function handleSubmit(e) {
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
    } else {
        appliances.push(appliance);
    }

    resetForm();
    renderAppliances();
    saveFile();
}

// 編集
function editAppliance(id) {
    const appliance = appliances.find(a => a.id === id);
    if (!appliance) return;

    document.getElementById('editId').value = appliance.id;
    document.getElementById('name').value = appliance.name;
    document.getElementById('modelNumber').value = appliance.modelNumber || '';
    document.getElementById('purchasedDate').value = appliance.purchasedDate || '';
    document.getElementById('disposedDate').value = appliance.disposedDate || '';
    document.getElementById('price').value = appliance.price || '';
    document.getElementById('memo').value = appliance.memo || '';

    submitBtn.textContent = '更新';
    cancelBtn.style.display = 'inline-block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 削除
function deleteAppliance(id) {
    if (!confirm('本当に削除しますか？')) return;

    appliances = appliances.filter(a => a.id !== id);
    renderAppliances();
    saveFile();
}

// 編集キャンセル
function cancelEdit() {
    resetForm();
}

// フォームリセット
function resetForm() {
    applianceForm.reset();
    document.getElementById('editId').value = '';
    submitBtn.textContent = '追加';
    cancelBtn.style.display = 'none';
}

// 家電一覧を表示
function renderAppliances() {
    if (appliances.length === 0) {
        applianceList.innerHTML = '<p style="color: #999; text-align: center;">家電が登録されていません</p>';
        return;
    }

    applianceList.innerHTML = appliances.map(appliance => `
        <div class="appliance-card">
            <div class="appliance-header">
                <div class="appliance-name">${escapeHtml(appliance.name)}</div>
                <div class="appliance-actions">
                    <button class="btn btn-warning" onclick="editAppliance(${appliance.id})">編集</button>
                    <button class="btn btn-danger" onclick="deleteAppliance(${appliance.id})">削除</button>
                </div>
            </div>
            <div class="appliance-details">
                <div class="detail-item">
                    <span class="detail-label">型番</span>
                    <span class="detail-value ${!appliance.modelNumber ? 'empty' : ''}">${escapeHtml(appliance.modelNumber) || '未設定'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">購入日</span>
                    <span class="detail-value ${!appliance.purchasedDate ? 'empty' : ''}">${appliance.purchasedDate || '未設定'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">破棄日</span>
                    <span class="detail-value ${!appliance.disposedDate ? 'empty' : ''}">${appliance.disposedDate || '未設定'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">参考価格</span>
                    <span class="detail-value ${!appliance.price ? 'empty' : ''}">${appliance.price ? `¥${appliance.price.toLocaleString()}` : '未設定'}</span>
                </div>
                ${appliance.memo ? `
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <span class="detail-label">メモ</span>
                    <span class="detail-value">${escapeHtml(appliance.memo)}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// HTML エスケープ
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// File System Access API サポートチェック
if (!('showOpenFilePicker' in window)) {
    alert('このブラウザはFile System Access APIに対応していません。Chrome、Edge、Operaの最新版をご利用ください。');
}
