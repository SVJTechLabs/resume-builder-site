// ========================================
// ResumeForge v1.0 - Form Manager
// Handles all form inputs and data collection
// ========================================

class FormManager {
  constructor() {
    this.onDataChange = null;
    this.resumeData = null;
    this.historySaveTimer = null;
    this.lastAction = 'edit';
  }

  init(resumeData) {
    this.resumeData = resumeData;
    this.bindBasics();
    this.bindPhotoUpload();
    this.bindLists();
    this.bindSkills();
    this.renderAllLists();
    this.updateBasicsInputs();
    this.updatePhotoPreview();
  }

  // ============ HISTORY INTEGRATION ============
  
  /**
   * Save current state to history (debounced)
   */
  saveToHistory(action = 'edit') {
    // Clear any pending save
    if (this.historySaveTimer) {
      clearTimeout(this.historySaveTimer);
    }
    
    // Debounce history saves to avoid capturing every keystroke
    this.historySaveTimer = setTimeout(() => {
      if (history && this.resumeData) {
        history.saveState(this.resumeData, action);
      }
    }, 500);
  }

  /**
   * Immediate history save for significant actions (add/remove)
   */
  saveToHistoryImmediate(action) {
    if (this.historySaveTimer) {
      clearTimeout(this.historySaveTimer);
    }
    if (history && this.resumeData) {
      history.saveState(this.resumeData, action);
    }
  }

  // ============ BASICS FORM ============
  bindBasics() {
    const inputs = document.querySelectorAll('#panel-basics [data-field]');
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const field = e.target.dataset.field;
        this.resumeData.basics[field] = e.target.value;
        this.triggerChange();
        this.validateField(field, e.target);
        this.saveToHistory(`edit ${field}`);
      });
    });
  }

  updateBasicsInputs() {
    const inputs = document.querySelectorAll('#panel-basics [data-field]');
    inputs.forEach(input => {
      const field = input.dataset.field;
      input.value = this.resumeData.basics[field] || '';
    });
  }

  validateField(field, input) {
    const result = validator.validateField(field, input.value);
    const errorMsg = input.parentElement.querySelector('.error-msg');
    
    if (!result.valid) {
      input.classList.add('error');
      if (errorMsg) errorMsg.textContent = result.message;
    } else {
      input.classList.remove('error');
      if (errorMsg) errorMsg.textContent = '';
    }
    
    return result.valid;
  }

  // ============ PHOTO UPLOAD ============
  bindPhotoUpload() {
    const uploadBtn = document.getElementById('btn-upload-photo');
    const removeBtn = document.getElementById('btn-remove-photo');
    const fileInput = document.getElementById('photo-input');

    uploadBtn?.addEventListener('click', () => fileInput?.click());
    
    fileInput?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      if (file.size > 2 * 1024 * 1024) {
        showToast('Photo must be under 2MB', 'error');
        return;
      }
      
      try {
        const dataUrl = await readFileAsDataURL(file);
        this.resumeData.photo = dataUrl;
        this.updatePhotoPreview();
        this.triggerChange();
        this.saveToHistoryImmediate('upload photo');
        showToast('Photo uploaded', 'success');
      } catch (err) {
        showToast('Error uploading photo', 'error');
      }
    });

    removeBtn?.addEventListener('click', () => {
      this.resumeData.photo = null;
      this.updatePhotoPreview();
      this.triggerChange();
      this.saveToHistoryImmediate('remove photo');
      showToast('Photo removed', 'success');
    });
  }

  updatePhotoPreview() {
    const preview = document.getElementById('photo-preview');
    const removeBtn = document.getElementById('btn-remove-photo');
    
    if (!preview) return;
    
    if (this.resumeData.photo) {
      preview.innerHTML = `<img src="${this.resumeData.photo}" alt="Profile">`;
      if (removeBtn) removeBtn.disabled = false;
    } else {
      preview.innerHTML = `
        <div class="photo-placeholder">
          <svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span>No photo selected</span>
        </div>
      `;
      if (removeBtn) removeBtn.disabled = true;
    }
  }

  // ============ DYNAMIC LISTS ============
  bindLists() {
    // Work Experience
    document.getElementById('btn-add-work')?.addEventListener('click', () => {
      this.addItem('work', { title: '', company: '', location: '', startDate: '', endDate: '', description: '' });
    });

    // Education
    document.getElementById('btn-add-education')?.addEventListener('click', () => {
      this.addItem('education', { degree: '', field: '', school: '', startDate: '', endDate: '', gpa: '' });
    });

    // Projects
    document.getElementById('btn-add-project')?.addEventListener('click', () => {
      this.addItem('projects', { name: '', tech: '', link: '', description: '' });
    });

    // Certificates
    document.getElementById('btn-add-cert')?.addEventListener('click', () => {
      this.addItem('certificates', { name: '', issuer: '', date: '' });
    });

    // Languages
    document.getElementById('btn-add-language')?.addEventListener('click', () => {
      this.addItem('languages', { name: '', level: '' });
    });

    // References
    document.getElementById('btn-add-reference')?.addEventListener('click', () => {
      this.addItem('references', { name: '', title: '', company: '', email: '', phone: '' });
    });
  }

  addItem(type, defaultData) {
    if (!this.resumeData[type]) this.resumeData[type] = [];
    
    const newItem = { id: generateId(), ...defaultData };
    this.resumeData[type].push(newItem);
    
    this.renderList(type);
    this.triggerChange();
    this.saveToHistoryImmediate(`add ${type}`);
  }

  removeItem(type, id) {
    if (!confirm(`Are you sure you want to remove this ${type} item?`)) return;
    this.resumeData[type] = this.resumeData[type].filter(item => item.id !== id);
    this.renderList(type);
    this.triggerChange();
    this.saveToHistoryImmediate(`remove ${type}`);
  }

  updateItem(type, id, field, value) {
    const item = this.resumeData[type].find(i => i.id === id);
    if (item) {
      item[field] = value;
      this.triggerChange();
      this.saveToHistory(`edit ${type}`);
    }
  }

  renderAllLists() {
    ['work', 'education', 'projects', 'certificates', 'languages', 'references'].forEach(type => {
      this.renderList(type);
    });
  }

  renderList(type) {
    const container = document.getElementById(`${type}-list`);
    if (!container) return;
    
    const items = this.resumeData[type] || [];
    
    if (items.length === 0) {
      container.innerHTML = '<p style="color:#64748b;font-size:0.85rem;text-align:center;padding:20px">No items added yet</p>';
      return;
    }
    
    container.innerHTML = items.map((item, index) => this.renderItemCard(type, item, index)).join('');
    
    // Bind inputs after rendering
    container.querySelectorAll('[data-item-id]').forEach(input => {
      input.addEventListener('input', (e) => {
        const id = e.target.dataset.itemId;
        const field = e.target.dataset.field;
        this.updateItem(type, id, field, e.target.value);
      });
    });
    
    // Bind remove buttons
    container.querySelectorAll('.item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('[data-item-id]').dataset.itemId;
        this.removeItem(type, id);
      });
    });
  }

  renderItemCard(type, item, index) {
    const labels = {
      work: { title: 'Job Title', company: 'Company', location: 'Location', startDate: 'Start Date', endDate: 'End Date', description: 'Description' },
      education: { degree: 'Degree', field: 'Field of Study', school: 'Institution', startDate: 'Start Year', endDate: 'End Year', gpa: 'GPA' },
      projects: { name: 'Project Name', tech: 'Technologies', link: 'Link', description: 'Description' },
      certificates: { name: 'Certificate Name', issuer: 'Issuer', date: 'Date' },
      languages: { name: 'Language', level: 'Proficiency Level' },
      references: { name: 'Name', title: 'Title', company: 'Company', email: 'Email', phone: 'Phone' }
    };
    
    const fields = Object.keys(labels[type]);
    
    let html = `<div class="item-card" data-item-id="${item.id}">`;
    html += `<div class="item-header">`;
    html += `<span class="item-label">${type.charAt(0).toUpperCase() + type.slice(1)} #${index + 1}</span>`;
    html += `<button class="item-remove" title="Remove">×</button>`;
    html += `</div>`;
    html += `<div class="item-form">`;
    
    fields.forEach(field => {
      const isWide = field === 'description';
      const isTextarea = field === 'description';
      
      html += `<div class="${isWide ? 'wide' : ''}">`;
      
      if (isTextarea) {
        html += `<textarea 
          placeholder="${labels[type][field]}"
          data-item-id="${item.id}"
          data-field="${field}"
          style="min-height:80px;resize:vertical;padding:8px;width:100%;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:0.85rem;font-family:inherit;"
        >${escapeHtml(item[field] || '')}</textarea>`;
      } else {
        html += `<input type="text" 
          placeholder="${labels[type][field]}"
          value="${escapeAttr(item[field] || '')}"
          data-item-id="${item.id}"
          data-field="${field}">`;
      }
      
      html += `</div>`;
    });
    
    html += `</div></div>`;
    return html;
  }

  // ============ SKILLS ============
  bindSkills() {
    // Add skill button
    document.getElementById('btn-add-skill')?.addEventListener('click', () => {
      this.addSkill();
    });
    
    // Enter key on skill input
    document.getElementById('skill-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addSkill();
      }
    });

    // Render quick skills
    const quickSkillsGrid = document.getElementById('quick-skills-grid');
    if (quickSkillsGrid) {
      quickSkillsGrid.innerHTML = POPULAR_SKILLS.map(skill => 
        `<span class="quick-skill" data-skill="${escapeAttr(skill)}">${escapeHtml(skill)}</span>`
      ).join('');
      
      quickSkillsGrid.querySelectorAll('.quick-skill').forEach(el => {
        el.addEventListener('click', () => {
          this.addSkillByName(el.dataset.skill);
        });
      });
    }

    // Use event delegation for skill removal
    const tagsContainer = document.getElementById('skills-tags');
    if (tagsContainer) {
      tagsContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove');
        if (removeBtn) {
          e.stopPropagation();
          const name = removeBtn.getAttribute('data-skill');
          if (name) this.removeSkill(name);
        }
      });
    }
  }

  addSkill() {
    const input = document.getElementById('skill-input');
    const levelSelect = document.getElementById('skill-level');
    const name = input?.value?.trim();
    
    if (!name) return;
    
    const level = levelSelect?.value || '';
    const skill = level ? { name, level } : name;
    
    if (!this.resumeData.skills) this.resumeData.skills = [];
    
    // Check for duplicates
    const exists = this.resumeData.skills.some(s => 
      (typeof s === 'string' ? s : s.name).toLowerCase() === name.toLowerCase()
    );
    
    if (exists) {
      showToast('Skill already added', 'warning');
      return;
    }
    
    this.resumeData.skills.push(skill);
    input.value = '';
    if (levelSelect) levelSelect.value = '';
    
    this.renderSkills();
    this.triggerChange();
    this.saveToHistoryImmediate('add skill');
  }

  addSkillByName(name) {
    if (!this.resumeData.skills) this.resumeData.skills = [];
    
    const exists = this.resumeData.skills.some(s => 
      (typeof s === 'string' ? s : s.name).toLowerCase() === name.toLowerCase()
    );
    
    if (exists) {
      showToast('Skill already added', 'warning');
      return;
    }
    
    this.resumeData.skills.push(name);
    this.renderSkills();
    this.triggerChange();
    this.saveToHistoryImmediate('add skill');
    showToast(`Added: ${name}`, 'success');
  }

  removeSkill(name) {
    if (!confirm(`Remove skill: ${name}?`)) return;
    this.resumeData.skills = this.resumeData.skills.filter(s => {
      const skillName = typeof s === 'string' ? s : s.name;
      return skillName !== name;
    });
    this.renderSkills();
    this.triggerChange();
    this.saveToHistoryImmediate('remove skill');
  }

  renderSkills() {
    const container = document.getElementById('skills-tags');
    if (!container) return;
    
    const skills = this.resumeData.skills || [];
    
    container.innerHTML = skills.map(skill => {
      const name = typeof skill === 'string' ? skill : skill.name;
      const level = typeof skill === 'object' ? skill.level : '';
      
      return `<span class="skill-tag">
        ${escapeHtml(name)}
        ${level ? `<span class="level">${escapeHtml(level)}</span>` : ''}
        <span class="remove" data-skill="${escapeAttr(name)}">×</span>
      </span>`;
    }).join('');
  }

  // ============ UTILITY ============
  triggerChange() {
    if (this.onDataChange) {
      if (this.changeTimer) clearTimeout(this.changeTimer);
      this.changeTimer = setTimeout(() => {
        this.onDataChange(this.resumeData);
      }, 250);
    }
  }

  getData() {
    return this.resumeData;
  }

  setData(data) {
    this.resumeData = data;
    this.updateBasicsInputs();
    this.updatePhotoPreview();
    this.renderAllLists();
    this.renderSkills();
  }
}

// Create global instance
const formManager = new FormManager();
