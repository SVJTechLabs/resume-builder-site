// ========================================
// ResumeForge v1.0 - Main Application
// ========================================

// Global instances are created in their respective files (ResumeManager.js, etc.)
// and are accessible here because they are loaded in the global scope.

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, duration);
}

// ========================================
// Tab Navigation
// ========================================
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Update active tab
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update active panel
      panels.forEach(p => {
        p.classList.toggle('active', p.id === `panel-${targetTab}`);
      });

      // Save current tab to URL hash
      window.location.hash = targetTab;
    });
  });
  
  // Mobile section navigation
  const mobileSelect = document.getElementById('mobile-section-select');
  if (mobileSelect) {
    mobileSelect.addEventListener('change', (e) => {
      const targetTab = e.target.value;
      const tabBtn = document.querySelector(`.tab[data-tab="${targetTab}"]`);
      if (tabBtn) tabBtn.click();
    });
  }

  // Check URL hash on load
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const targetTab = document.querySelector(`.tab[data-tab="${hash}"]`);
    if (targetTab) targetTab.click();
  }
}

// ========================================
// Main App Initialization
// ========================================
function initApp() {
  // Use existing global instances
  // resumeManager, formManager, previewManager, designManager are already created globally

  // Set up callbacks
  formManager.onDataChange = (data) => {
    resumeManager.saveCurrentResume(data);
    previewManager.render(data);
  };

  designManager.onSettingsChange = (settings) => {
    const data = formManager.getData();
    data.settings = settings;
    resumeManager.saveCurrentResume(data);
    previewManager.render(data);
  };

  resumeManager.onResumeChange = (resumeData) => {
    formManager.setData(resumeData);
    designManager.init(resumeData.settings);
    previewManager.render(resumeData);
  };

  // Initialize
  try {
    const resumeData = resumeManager.init();
    formManager.init(resumeData);
    designManager.init(resumeData.settings);
    previewManager.init();
    
    // Instantiate and initialize SidebarResizer
    sidebarResizer = new SidebarResizer();
    sidebarResizer.init();

    previewManager.render(resumeData);
    
    initTabs();
  } catch (err) {
    console.error('Error during app initialization:', err);
    showToast('App initialization error. Check console.', 'error');
  }

  // Setup autosave
  storage.onAutosave = () => {
    showToast('Auto-saved', 'success', 1500);
  };

  console.log('ResumeForge v1.0 initialized');
}

// ========================================
// Global Keyboard Shortcuts
// ========================================
document.addEventListener('keydown', (e) => {

  // Ctrl/Cmd + S - Save
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    const data = formManager?.getData();
    if (data) {
      resumeManager?.saveCurrentResume(data);
      showToast('Saved!', 'success');
    }
  }

  // Ctrl/Cmd + Shift + N - New Resume
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
    e.preventDefault();
    resumeManager?.showNewResumeModal();
  }

  // Esc - Close modals
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(modal => {
      modal.classList.remove('open');
    });
  }
});

// ========================================
// Before unload warning
// ========================================
window.addEventListener('beforeunload', (e) => {
  // Check if there are unsaved changes
  const currentData = formManager?.getData();
  if (currentData) {
    const saved = storage.getResume(currentData.id);
    if (saved && JSON.stringify(saved) !== JSON.stringify(currentData)) {
      e.preventDefault();
      e.returnValue = '';
    }
  }
});

// ========================================
// Start the app when DOM is ready
// ========================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
