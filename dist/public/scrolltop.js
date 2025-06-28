(() => {
  const STORAGE_KEY_TOP = 'scrollTopEnabled';
  const STORAGE_KEY_CYCLE = 'smartScrollCycle';
  const IDLE_TIMEOUT = 20000; // 20秒
  let idleTimer, atTop = true, lastScroll = 0;

  const isLocalStorageSupported = () => {
    try {
      localStorage.setItem('test', '1');
      localStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  };

  const getState = (key) => {
    if (!isLocalStorageSupported()) return false;
    const val = localStorage.getItem(key);
    return val === null ? true : val !== 'false';
  };

  const scrollToTop = () => {
    if (!getState(STORAGE_KEY_TOP)) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    atTop = true;
  };

  const scrollToHeader = () => {
    if (!getState(STORAGE_KEY_CYCLE)) return;
    const banner = document.getElementById('banner');
    const targetY = banner ? banner.offsetTop + banner.offsetHeight : 0;
    if (Math.abs(window.scrollY - targetY) > 5) {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
    atTop = false;
  };

  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      scrollToTop();
    }, IDLE_TIMEOUT);
  };

let lastHeaderScroll = 0;

const handleInteraction = () => {
  const now = Date.now();
  if (atTop && now - lastHeaderScroll > 3500) {
    scrollToHeader();
    lastHeaderScroll = now;
  }
  resetIdleTimer();
};


  ['mousemove', 'click', 'keydown', 'touchstart'].forEach(evt =>
    window.addEventListener(evt, handleInteraction, { passive: true })
  );

  // 實時更新 scroll 狀態
  window.addEventListener('scroll', () => {
    atTop = window.scrollY < 10;
    lastScroll = window.scrollY;
  });

  resetIdleTimer();

  // 插入 UI 控制選項
  const insertToggle = () => {
    const themeSelect = document.getElementById('option-theme');
    if (!themeSelect || document.getElementById('scroll-top-toggle')) return;

    const createToggle = (id, label, defaultChecked) => `
      <label style="display:block;margin-top:1em">
        <input type="checkbox" id="${id}" ${defaultChecked ? 'checked' : ''}>
        ${label}
      </label>`;

    themeSelect.insertAdjacentHTML('afterend',
      createToggle('scroll-top-toggle', 'Enable auto scroll to top', getState(STORAGE_KEY_TOP)) +
      createToggle('smart-scroll-toggle', 'Enable smart scroll loop', getState(STORAGE_KEY_CYCLE))
    );

    document.getElementById('scroll-top-toggle').addEventListener('change', e => {
      localStorage.setItem(STORAGE_KEY_TOP, e.target.checked);
      resetIdleTimer();
    });

    document.getElementById('smart-scroll-toggle').addEventListener('change', e => {
      localStorage.setItem(STORAGE_KEY_CYCLE, e.target.checked);
    });
  };

  const observer = new MutationObserver(insertToggle);
  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertToggle);
  } else {
    insertToggle();
  }
})();
