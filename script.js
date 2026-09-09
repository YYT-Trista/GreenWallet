let currentKg = 45;
let hamiPoints = 150;
let etfValue = 1250;
let isScanning = false;

// 自動更新手機頂部狀態列時間
function updateStatusBarTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeEl = document.getElementById('statusBarTime');
    if (timeEl) {
        timeEl.innerText = `${hours}:${minutes}`;
    }
}
updateStatusBarTime();
setInterval(updateStatusBarTime, 10000);

// 切換底部 Tab 分頁
function switchTab(tabId, index) {
    // 隱藏所有 tab-page
    const pages = document.querySelectorAll('.tab-page');
    pages.forEach(p => p.classList.remove('active'));

    // 顯示目標 tab-page
    const target = document.getElementById(tabId);
    if (target) {
        target.classList.add('active');
    }

    // 更新底部導覽列高亮狀態
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // 切換分頁時同步最新數據 UI
    updateUI();
}

// 模擬掃描綠色消費發票
function simulateScan() {
    if (isScanning) return;
    
    if (currentKg >= 60) {
        alert("🎉 恭喜！本月減碳目標已達成，次月 3.0% 高利活存已解鎖！");
        return;
    }

    const overlay = document.getElementById('scanOverlay');
    isScanning = true;
    overlay.classList.add('active');

    // 模擬 1.2 秒相機發票對焦掃描過程
    setTimeout(() => {
        overlay.classList.remove('active');
        isScanning = false;

        // 掃描後減碳 +0.5kg，點數 +15點，股票 (0050) 不增加
        currentKg += 0.5;
        hamiPoints += 15;

        // 更新畫面 UI
        updateUI();

        // 更新進度條長度
        let percentage = Math.min((currentKg / 60) * 100, 100);
        document.getElementById('progressBar').style.width = percentage + "%";

        // 動態新增至首頁減碳動態與回饋明細列表
        addNewTimelineItem();
        addNewRewardDetailItem();

        // 更新提示文字與達標樣式
        let remaining = parseFloat((60 - currentKg).toFixed(1));
        if (remaining > 0) {
            document.getElementById('progressHint').innerText = `再減少 ${remaining} 公斤即可解鎖次月 3.0% 活存！`;
        } else {
            document.getElementById('progressHint').innerText = "✅ 目標達成！次月升級 3.0% 高利活存！";
            document.getElementById('progressHintBox').style.backgroundColor = "rgba(245, 158, 11, 0.4)";
            document.getElementById('progressBar').style.background = "linear-gradient(90deg, #fef08a, #fbbf24)";
        }
    }, 1200);
}

// 全局數字 UI 同步更新
function updateUI() {
    const formattedKg = Number(currentKg.toFixed(1));

    // 首頁數值
    document.getElementById('currentKg').innerText = formattedKg;
    document.getElementById('hamiPoints').innerText = hamiPoints + " 點";
    document.getElementById('etfValue').innerText = "$" + etfValue.toLocaleString() + " TWD";

    // 兌換頁面點數同步
    const redeemPtsEl = document.getElementById('redeemHamiPoints');
    const redeemNtEl = document.getElementById('redeemNtVal');
    if (redeemPtsEl) redeemPtsEl.innerText = hamiPoints;
    if (redeemNtEl) redeemNtEl.innerText = hamiPoints;

    // 回饋頁面數據同步
    const rKgEl = document.getElementById('rewardsCurrentKg');
    const rPtsEl = document.getElementById('rewardsTotalPoints');
    if (rKgEl) rKgEl.innerText = formattedKg;
    if (rPtsEl) rPtsEl.innerText = hamiPoints + " 點";
}

// 兌換選項 1: 購買 0050 零股
function buyFractionalShares() {
    if (hamiPoints <= 0) {
        alert("目前 Hami Point 點數不足，請掃描綠色消費發票累積點數！");
        return;
    }

    const redeemedAmount = hamiPoints;
    etfValue += redeemedAmount;
    hamiPoints = 0;

    updateUI();
    alert(`🎉 成功以 ${redeemedAmount} Hami Points 兌換並購入 $${redeemedAmount} TWD 的元大台灣50 (0050) 零股資產！`);
}

// 兌換選項 2: 導回 Hami Pay 頁面兌換商品
function redirectToHamiPay() {
    const confirmRedirect = confirm("即將為您開啟中華電信 Hami Pay 點數兌換頁面，是否前往？");
    if (confirmRedirect) {
        window.open("https://hamipay.cht.com.tw/", "_blank");
    }
}

// 首頁動態列表新增項目
function addNewTimelineItem() {
    const list = document.getElementById('timelineList');
    if (!list) return;

    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.style.opacity = '0';
    item.style.transform = 'translateY(-8px)';
    item.style.transition = 'all 0.4s ease';

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    item.innerHTML = `
        <div class="timeline-left">
            <div class="timeline-dot" style="background-color: #10b981;"></div>
            <div>
                <div class="timeline-title">掃描綠色消費發票</div>
                <div class="timeline-time">剛剛 ${timeStr}</div>
            </div>
        </div>
        <div class="timeline-reward" style="color: #059669;">-0.5 kg (+15點)</div>
    `;

    list.insertBefore(item, list.firstChild);

    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, 50);
}

// 回饋頁面明細列表動態新增項目
function addNewRewardDetailItem() {
    const list = document.getElementById('rewardsDetailList');
    if (!list) return;

    const item = document.createElement('div');
    item.className = 'reward-detail-item';
    item.style.opacity = '0';
    item.style.transform = 'translateY(-8px)';
    item.style.transition = 'all 0.4s ease';

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    item.innerHTML = `
        <div class="reward-detail-left">
            <div class="reward-icon-box scan">🧾</div>
            <div>
                <div class="reward-detail-title">綠色消費發票回饋</div>
                <div class="reward-detail-sub">減碳 -0.5 kg • 今天 ${timeStr}</div>
            </div>
        </div>
        <div class="reward-detail-right">
            <div class="reward-amount-tag">+15 點</div>
            <span class="reward-status-badge issued">已發放</span>
        </div>
    `;

    list.insertBefore(item, list.firstChild);

    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, 50);
}
