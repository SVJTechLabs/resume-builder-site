// ========================================
// ResumeForge v1.0 - Preview Manager
// Handles resume rendering, zoom, and progress
// ========================================

class PreviewManager {
  constructor() {
    this.zoom = 1;
    this.templates = {
      modern: ModernTemplate,
      classic: ClassicTemplate,
      minimal: MinimalTemplate,
      executive: ExecutiveTemplate,
      creative: CreativeTemplate,
      'two-column': TwoColumnTemplate
    };
  }

  init() {
    this.bindZoomControls();
    this.bindPrintButton();
  }

  render(resumeData) {
    const container = document.getElementById('resume-document');
    if (!container) return;

    const templateName = resumeData.settings?.template || 'modern';
    const template = this.templates[templateName];
    
    if (!template) {
      console.error(`Template "${templateName}" not found`);
      return;
    }

    // Update container attributes for styling
    container.dataset.template = templateName;
    container.dataset.color = resumeData.settings?.color || 'slate';
    container.style.fontFamily = resumeData.settings?.fontBody || 'Inter, system-ui, sans-serif';

    // Render the resume
    const html = template.render(resumeData);
    container.innerHTML = html;

    // Update progress
    this.updateProgress(resumeData);

    // Apply custom fonts
    this.applyFonts(resumeData.settings);
  }

  applyFonts(settings) {
    const container = document.getElementById('resume-document');
    if (!container || !settings) return;

    // Create style element for fonts
    let styleEl = document.getElementById('resume-fonts');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'resume-fonts';
      document.head.appendChild(styleEl);
    }

    const headingFont = settings.fontHeading || 'Georgia';
    const bodyFont = settings.fontBody || 'Inter';

    styleEl.textContent = `
      #resume-document {
        font-family: ${bodyFont}, system-ui, sans-serif;
      }
      #resume-document .r-name,
      #resume-document .r-section-title,
      #resume-document .r-job-title,
      #resume-document .r-edu-degree,
      #resume-document .r-project-name,
      #resume-document .r-cert-name {
        font-family: ${headingFont}, serif;
      }
    `;
  }

  updateProgress(resumeData) {
    const percentEl = document.getElementById('progress-percent');
    const fillEl = document.getElementById('progress-fill');
    const hintsEl = document.getElementById('progress-hints');

    let score = 0;
    let hints = [];

    // Name (15 points)
    if (resumeData.basics?.name?.trim()) {
      score += 15;
    } else {
      hints.push('Add your name');
    }

    // Email (10 points)
    if (resumeData.basics?.email?.trim()) {
      score += 10;
    } else {
      hints.push('Add your email');
    }

    // Title (10 points)
    if (resumeData.basics?.title?.trim()) {
      score += 10;
    }

    // Summary (15 points)
    if (resumeData.basics?.summary?.trim()?.length > 50) {
      score += 15;
    } else if (!resumeData.basics?.summary?.trim()) {
      hints.push('Add a professional summary');
    }

    // Work experience (20 points)
    if (resumeData.work?.some(w => w.title?.trim())) {
      score += 20;
    } else {
      hints.push('Add work experience');
    }

    // Education (15 points)
    if (resumeData.education?.some(e => e.degree?.trim())) {
      score += 15;
    } else {
      hints.push('Add education');
    }

    // Skills (10 points)
    if (resumeData.skills?.length >= 3) {
      score += 10;
    } else {
      hints.push('Add at least 3 skills');
    }

    // Projects (5 points)
    if (resumeData.projects?.some(p => p.name?.trim())) {
      score += 5;
    }

    // Cap at 100
    score = Math.min(score, 100);

    // Update UI
    if (percentEl) percentEl.textContent = `${score}%`;
    if (fillEl) fillEl.style.width = `${score}%`;

    // Update hints
    if (hintsEl) {
      if (hints.length > 0) {
        hintsEl.innerHTML = hints.slice(0, 3).map(h => 
          `<div class="hint">${escapeHtml(h)}</div>`
        ).join('');
      } else {
        hintsEl.innerHTML = '<div class="hint" style="color:#16a34a">✓ Your resume looks complete!</div>';
      }
    }

    return score;
  }

  bindZoomControls() {
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnFit = document.getElementById('btn-fit');
    const zoomLevel = document.getElementById('zoom-level');
    const container = document.getElementById('resume-document');

    btnZoomOut?.addEventListener('click', () => {
      this.zoom = Math.max(0.5, this.zoom - 0.1);
      this.applyZoom();
    });

    btnZoomIn?.addEventListener('click', () => {
      this.zoom = Math.min(1.5, this.zoom + 0.1);
      this.applyZoom();
    });

    btnFit?.addEventListener('click', () => {
      this.zoom = 1;
      this.applyZoom();
    });

    // Mouse wheel zoom with Ctrl
    container?.parentElement?.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.zoom = Math.max(0.5, Math.min(1.5, this.zoom + delta));
        this.applyZoom();
      }
    });
  }

  applyZoom() {
    const container = document.getElementById('resume-document');
    const zoomLevel = document.getElementById('zoom-level');
    
    if (container) {
      container.style.transform = `scale(${this.zoom})`;
    }
    
    if (zoomLevel) {
      zoomLevel.textContent = `${Math.round(this.zoom * 100)}%`;
    }
  }

  bindPrintButton() {
    const btnPrint = document.getElementById('btn-print');
    const btnDownload = document.getElementById('btn-download');
    const btnPreviewOnly = document.getElementById('btn-preview-only');

    btnPrint?.addEventListener('click', () => {
      this.print();
    });

    btnDownload?.addEventListener('click', () => {
      this.print();
    });

    btnPreviewOnly?.addEventListener('click', () => {
      this.togglePreviewOnly();
    });

    // Keyboard shortcut for print
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        this.print();
      }
    });
  }

  print() {
    // Validate before print
    const ready = validator.isReadyForExport(formManager.getData());
    
    if (!ready.ready) {
      const missing = ready.missing.join(', ');
      showToast(`Please complete required fields: ${missing}`, 'error');
      return;
    }

    showToast('Preparing print view...', 'success');
    setTimeout(() => {
      window.print();
    }, 300);
  }

  togglePreviewOnly() {
    const sidebar = document.querySelector('.sidebar');
    const previewArea = document.querySelector('.preview-area');
    const appBody = document.querySelector('.app-body');
    const isFullscreen = previewArea?.classList.contains('fullscreen');

    if (isFullscreen) {
      previewArea.classList.remove('fullscreen');
      sidebar?.style.display = '';
      appBody.style.gridTemplateColumns = '';
      document.getElementById('btn-preview-only').textContent = 'Preview Only';
    } else {
      previewArea.classList.add('fullscreen');
      sidebar.style.display = 'none';
      appBody.style.gridTemplateColumns = '1fr';
      document.getElementById('btn-preview-only').textContent = 'Exit Preview';
    }
  }
}

// ========================================
// Design Manager
// Handles template and design customization
// ========================================

class DesignManager {
  constructor() {
    this.onSettingsChange = null;
  }

  init(settings) {
    this.settings = settings;
    this.bindTemplateSelection();
    this.bindColorSelection();
    this.bindFontSelection();
    this.bindToggles();
    this.updateUI();
  }

  bindTemplateSelection() {
    const grid = document.getElementById('template-grid');
    if (!grid) return;

    grid.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        const template = card.dataset.template;
        this.setTemplate(template);
        
        // Save to history
        if (history && formManager?.resumeData) {
          history.saveState(formManager.resumeData, `change template to ${template}`);
        }
        
        // Update UI
        grid.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }

  bindColorSelection() {
    const grid = document.getElementById('color-grid');
    if (!grid) return;

    grid.querySelectorAll('.color-card').forEach(card => {
      card.addEventListener('click', () => {
        const color = card.dataset.color;
        this.setColor(color);
        
        // Save to history
        if (history && formManager?.resumeData) {
          history.saveState(formManager.resumeData, `change color to ${color}`);
        }
        
        // Update UI
        grid.querySelectorAll('.color-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }

  bindFontSelection() {
    const headingSelect = document.getElementById('font-heading');
    const bodySelect = document.getElementById('font-body');

    headingSelect?.addEventListener('change', (e) => {
      this.settings.fontHeading = e.target.value;
      this.triggerChange();
      if (history && formManager?.resumeData) {
        history.saveState(formManager.resumeData, 'change heading font');
      }
    });

    bodySelect?.addEventListener('change', (e) => {
      this.settings.fontBody = e.target.value;
      this.triggerChange();
      if (history && formManager?.resumeData) {
        history.saveState(formManager.resumeData, 'change body font');
      }
    });
  }

  bindToggles() {
    // Photo toggle
    document.getElementById('toggle-photo')?.addEventListener('change', (e) => {
      this.settings.showPhoto = e.target.checked;
      this.triggerChange();
      if (history && formManager?.resumeData) {
        history.saveState(formManager.resumeData, e.target.checked ? 'show photo' : 'hide photo');
      }
    });

    // Page numbers toggle
    document.getElementById('toggle-page-numbers')?.addEventListener('change', (e) => {
      this.settings.showPageNumbers = e.target.checked;
      this.triggerChange();
    });

    // Section lines toggle
    document.getElementById('toggle-section-lines')?.addEventListener('change', (e) => {
      this.settings.showSectionLines = e.target.checked;
      this.triggerChange();
    });

    // Section visibility toggles
    document.querySelectorAll('.section-toggle-grid input[data-section]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const section = e.target.dataset.section;
        this.settings.visibleSections[section] = e.target.checked;
        this.triggerChange();
        if (history && formManager?.resumeData) {
          history.saveState(formManager.resumeData, `${e.target.checked ? 'show' : 'hide'} ${section}`);
        }
      });
    });
  }

  updateUI() {
    // Update template selection
    const templateCard = document.querySelector(`[data-template="${this.settings.template}"]`);
    if (templateCard) {
      document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
      templateCard.classList.add('active');
    }

    // Update color selection
    const colorCard = document.querySelector(`[data-color="${this.settings.color}"]`);
    if (colorCard) {
      document.querySelectorAll('.color-card').forEach(c => c.classList.remove('active'));
      colorCard.classList.add('active');
    }

    // Update font selections
    const headingSelect = document.getElementById('font-heading');
    const bodySelect = document.getElementById('font-body');
    if (headingSelect) headingSelect.value = this.settings.fontHeading || 'Georgia';
    if (bodySelect) bodySelect.value = this.settings.fontBody || 'Inter';

    // Update toggles
    const photoToggle = document.getElementById('toggle-photo');
    const pageNumToggle = document.getElementById('toggle-page-numbers');
    const linesToggle = document.getElementById('toggle-section-lines');
    
    if (photoToggle) photoToggle.checked = this.settings.showPhoto !== false;
    if (pageNumToggle) pageNumToggle.checked = this.settings.showPageNumbers === true;
    if (linesToggle) linesToggle.checked = this.settings.showSectionLines !== false;

    // Update section visibility toggles
    document.querySelectorAll('.section-toggle-grid input[data-section]').forEach(checkbox => {
      const section = checkbox.dataset.section;
      checkbox.checked = this.settings.visibleSections?.[section] !== false;
    });
  }

  setTemplate(template) {
    this.settings.template = template;
    this.triggerChange();
  }

  setColor(color) {
    this.settings.color = color;
    this.triggerChange();
  }

  triggerChange() {
    if (this.onSettingsChange) {
      this.onSettingsChange(this.settings);
    }
  }

  getSettings() {
    return this.settings;
  }
}
