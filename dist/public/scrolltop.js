(() => {
  const STORAGE_KEY = 'scrollTopEnabled';
  const delay = 30000; // 30秒
  
  // 檢查 localStorage 支援情況
  const isLocalStorageSupported = () => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // 檢查 MutationObserver 支援情況
  const isMutationObserverSupported = typeof MutationObserver !== 'undefined';
  
  const getState = () => {
    if (!isLocalStorageSupported()) return false; // 默認禁用
    const localSetting = localStorage.getItem(STORAGE_KEY);
    if (localSetting === null) return true; // 如果沒有本地設置，使用默認啟用
    return localSetting !== 'false';
  };
  
  let timer;
  
  function triggerScrollTop() {
    if (!getState()) return; // 如果禁用則不執行
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  function resetTimer() {
    clearTimeout(timer);
    if (getState()) { // 只有啟用時才設置計時器
      timer = setTimeout(triggerScrollTop, delay);
    }
  }
  
  // 監聽互動事件，每次互動都重設計時器
  ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, resetTimer);
  });
  
  // 初始化倒數
  resetTimer();
  
  const insertToggle = () => {
    if (!isMutationObserverSupported) return;
    
    const themeSelect = document.getElementById('option-theme');
    if (!themeSelect || document.getElementById('scroll-top-toggle')) return;
    
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.marginTop = '1em';
    label.innerHTML = `
      <input type="checkbox" id="scroll-top-toggle" ${
        getState() ? 'checked' : ''
      }>
      Enable auto scroll to top
    `;
    
    themeSelect.parentNode.insertBefore(label, themeSelect.nextSibling);
    
    document.getElementById('scroll-top-toggle').addEventListener('change', e => {
      localStorage.setItem(STORAGE_KEY, e.target.checked);
      resetTimer(); // 更新計時器狀態
    });
  };
  
  // 插入時機：DOM ready 或 MutationObserver 偵測到 options 顯示
  const observer = new MutationObserver(() => insertToggle());
  observer.observe(document.body, { childList: true, subtree: true });
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => insertToggle());
  } else {
    insertToggle();
  }
})();