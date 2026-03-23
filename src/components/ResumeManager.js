// ========================================
// ResumeForge v1.0 - Resume Manager
// Handles multiple resume CRUD operations
// ========================================

class ResumeManager {
  constructor() {
    this.currentResume = null;
    this.onResumeChange = null;
    this.onResumeListChange = null;
  }

  init() {
    // Load or create initial resume
    this.currentResume = storage.getCurrentResume();
    this.renderResumeList();
    this.bindEvents();
    return this.currentResume;
  }

  bindEvents() {
    // New resume button
    document.getElementById('btn-new-resume')?.addEventListener('click', () => {
      this.showNewResumeModal();
    });

    // Create resume confirm
    document.getElementById('btn-create-resume')?.addEventListener('click', () => {
      this.createNewResume();
    });


    // Dropdown toggle
    const dropdown = document.querySelector('.dropdown');
    dropdown?.querySelector('.dropdown-toggle')?.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Close dropdown on click outside
    document.addEventListener('click', () => {
      dropdown?.classList.remove('open');
    });

    // Mobile resume selector
    document.getElementById('mobile-resume-select')?.addEventListener('change', (e) => {
      if (e.target.value) {
        this.switchResume(e.target.value);
      }
    });

    // Modal close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        modal?.classList.remove('open');
      });
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });
  }

  showNewResumeModal() {
    const modal = document.getElementById('modal-new-resume');
    const input = document.getElementById('new-resume-name');
    input.value = '';
    modal?.classList.add('open');
    input.focus();
  }

  createNewResume() {
    const name = document.getElementById('new-resume-name')?.value?.trim();
    if (!name) return;

    const newResume = storage.createResume(name);
    this.currentResume = newResume;
    
    document.getElementById('modal-new-resume')?.classList.remove('open');
    
    this.renderResumeList();
    this.updateMobileSelector();
    
    if (this.onResumeChange) {
      this.onResumeChange(this.currentResume);
    }
    
    showToast('New resume created', 'success');
  }

  switchResume(id) {
    const resume = storage.getResume(id);
    if (!resume) return;

    storage.setCurrentResumeId(id);
    this.currentResume = resume;
    
    this.renderResumeList();
    this.updateMobileSelector();
    
    if (this.onResumeChange) {
      this.onResumeChange(this.currentResume);
    }
    
    showToast(`Switched to: ${resume.name}`, 'success');
  }

  duplicateResume(id) {
    const copy = storage.duplicateResume(id);
    if (copy) {
      this.renderResumeList();
      this.updateMobileSelector();
      showToast('Resume duplicated', 'success');
    }
  }

  deleteResume(id) {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    
    const success = storage.deleteResume(id);
    if (success) {
      // If we deleted the current resume, switch to another one
      if (this.currentResume?.id === id) {
        const resumes = storage.getAllResumes();
        if (resumes.length > 0) {
          this.switchResume(resumes[0].id);
        } else {
          // Create a new default resume
          this.currentResume = storage.createResume('My Resume');
          if (this.onResumeChange) {
            this.onResumeChange(this.currentResume);
          }
        }
      }
      
      this.renderResumeList();
      this.updateMobileSelector();
      showToast('Resume deleted', 'success');
    }
  }

  renameResume(id, newName) {
    const updated = storage.renameResume(id, newName);
    if (updated) {
      this.renderResumeList();
      this.updateMobileSelector();
      showToast('Resume renamed', 'success');
    }
  }

  saveCurrentResume(resumeData) {
    if (!resumeData.id) return;
    
    storage.saveResume(resumeData);
    this.currentResume = resumeData;
    
    // Update the list to show new name if changed
    this.renderResumeList();
    this.updateMobileSelector();
  }

  exportCurrentResume() {
    if (!this.currentResume) return;
    
    const json = storage.exportResume(this.currentResume.id);
    if (json) {
      const filename = `${this.currentResume.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      downloadFile(json, filename);
      showToast('Resume exported', 'success');
    }
  }

  async handleImport(file) {
    if (!file) return;
    
    try {
      const content = await readFileAsText(file);
      const imported = storage.importResume(content);
      
      if (imported) {
        storage.setCurrentResumeId(imported.id);
        this.currentResume = imported;
        
        this.renderResumeList();
        this.updateMobileSelector();
        
        if (this.onResumeChange) {
          this.onResumeChange(this.currentResume);
        }
        
        showToast('Resume imported successfully', 'success');
      } else {
        showToast('Invalid resume file', 'error');
      }
    } catch (e) {
      showToast('Error importing file', 'error');
      console.error(e);
    } finally {
      // Reset file input to allow re-importing same file
      const fileInput = document.getElementById('import-file-input');
      if (fileInput) fileInput.value = '';
    }
  }

  renderResumeList() {
    const container = document.getElementById('saved-resumes-list');
    if (!container) return;
    
    const resumes = storage.getAllResumes();
    
    if (resumes.length === 0) {
      container.innerHTML = '<div class="dropdown-empty">No saved resumes</div>';
      return;
    }
    
    container.innerHTML = resumes.map(resume => {
      const isActive = resume.id === this.currentResume?.id;
      return `
        <div class="dropdown-item ${isActive ? 'active' : ''}" data-resume-id="${resume.id}">
          <span>${escapeHtml(truncate(resume.name, 25))}</span>
          ${!isActive ? `<button class="delete-btn" data-delete-id="${resume.id}" title="Delete">×</button>` : ''}
        </div>
      `;
    }).join('');
    
    // Bind click events
    container.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
          e.stopPropagation();
          this.deleteResume(item.dataset.resumeId);
        } else {
          this.switchResume(item.dataset.resumeId);
        }
      });
    });
  }

  updateMobileSelector() {
    const select = document.getElementById('mobile-resume-select');
    if (!select) return;
    
    const resumes = storage.getAllResumes();
    
    select.innerHTML = resumes.map(resume => {
      const isSelected = resume.id === this.currentResume?.id;
      return `<option value="${resume.id}" ${isSelected ? 'selected' : ''}>${escapeHtml(resume.name)}</option>`;
    }).join('');
  }

  getCurrentResume() {
    return this.currentResume;
  }
}

// Create global instance
const resumeManager = new ResumeManager();
