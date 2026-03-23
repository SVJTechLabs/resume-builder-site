// ========================================
// ResumeForge v1.0 - Main Application
// ========================================

// Global instances
let resumeManager;
let formManager;
let previewManager;
let designManager;

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
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active panel
      panels.forEach(p => {
        p.classList.toggle('active', p.id === `panel-${targetTab}`);
      });

      // Save current tab to URL hash
      window.location.hash = targetTab;
    });
  });

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
  // Initialize managers
  resumeManager = new ResumeManager();
  formManager = new FormManager();
  previewManager = new PreviewManager();
  designManager = new DesignManager();

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
    // Reset history when switching resumes
    history.init(resumeData);
  };

  // Set up history undo/redo callback
  history.onUndoRedo = (state, action) => {
    // Update form with restored state
    formManager.setData(state);
    // Update design manager with restored settings
    designManager.settings = state.settings;
    designManager.updateUI();
    // Re-render preview
    previewManager.render(state);
    // Save to storage
    resumeManager.saveCurrentResume(state);
  };

  // Bind undo/redo buttons
  document.getElementById('btn-undo')?.addEventListener('click', () => {
    history.undo();
  });
  
  document.getElementById('btn-redo')?.addEventListener('click', () => {
    history.redo();
  });

  // Initialize
  const resumeData = resumeManager.init();
  
  formManager.init(resumeData);
  designManager.init(resumeData.settings);
  previewManager.init();
  previewManager.render(resumeData);
  
  // Initialize history with starting state
  history.init(resumeData);
  
  initTabs();

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
  // Ctrl/Cmd + Z - Undo
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    history?.undo();
  }

  // Ctrl/Cmd + Y - Redo
  if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault();
    history?.redo();
  }

  // Ctrl/Cmd + Shift + Z - Redo (alternative)
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
    e.preventDefault();
    history?.redo();
  }

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
