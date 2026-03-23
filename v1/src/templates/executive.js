// ========================================
// ResumeForge v1.0 - Executive Template Renderer
// ========================================

const ExecutiveTemplate = {
  name: 'executive',
  label: 'Executive',
  
  render(data) {
    const basics = data.basics || {};
    const settings = data.settings || {};
    const visible = settings.visibleSections || {};
    
    let html = '<div class="template-executive">';
    
    // Sidebar
    html += '<div class="r-sidebar">';
    html += this.renderSidebar(basics, data, visible);
    html += '</div>';
    
    // Main content
    html += '<div class="r-main">';
    
    // Summary
    if (visible.summary !== false && basics.summary) {
      html += this.renderSection('Executive Summary', `<p style="line-height:1.7">${escapeHtml(basics.summary)}</p>`);
    }
    
    // Core Competencies
    if (visible.skills !== false && data.skills?.length > 0) {
      html += this.renderSection('Core Competencies', this.renderCompetencies(data.skills));
    }
    
    // Work Experience
    if (visible.experience !== false && data.work?.length > 0) {
      html += this.renderSection('Professional Experience', this.renderWork(data.work));
    }
    
    // Education
    if (visible.education !== false && data.education?.length > 0) {
      html += this.renderSection('Education', this.renderEducation(data.education));
    }
    
    // Certifications
    if (visible.certificates !== false && data.certificates?.length > 0) {
      html += this.renderSection('Certifications', this.renderCertificates(data.certificates));
    }
    
    // Projects
    if (visible.projects !== false && data.projects?.length > 0) {
      html += this.renderSection('Key Projects', this.renderProjects(data.projects));
    }
    
    html += '</div>';
    html += '</div>';
    return html;
  },

  renderSidebar(basics, data, visible) {
    let html = '';
    
    // Name and title
    html += `<div class="r-name">${escapeHtml(basics.name) || 'Your Name'}</div>`;
    if (basics.title) {
      html += `<div class="r-title">${escapeHtml(basics.title)}</div>`;
    }
    
    // Contact info
    html += '<div class="r-contact-sidebar">';
    if (basics.email) {
      html += `<div class="r-contact-item"><div class="r-contact-label">Email</div>${escapeHtml(basics.email)}</div>`;
    }
    if (basics.phone) {
      html += `<div class="r-contact-item"><div class="r-contact-label">Phone</div>${escapeHtml(basics.phone)}</div>`;
    }
    if (basics.location) {
      html += `<div class="r-contact-item"><div class="r-contact-label">Location</div>${escapeHtml(basics.location)}</div>`;
    }
    if (basics.linkedin) {
      html += `<div class="r-contact-item"><div class="r-contact-label">LinkedIn</div>${escapeHtml(basics.linkedin)}</div>`;
    }
    if (basics.website) {
      html += `<div class="r-contact-item"><div class="r-contact-label">Website</div>${escapeHtml(basics.website)}</div>`;
    }
    html += '</div>';
    
    // Languages in sidebar
    if (visible.languages !== false && data.languages?.length > 0) {
      html += '<div style="margin-top:30px">';
      html += '<div style="font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#1e3a5f;border-bottom:1px solid #cbd5e1;padding-bottom:6px;margin-bottom:10px">Languages</div>';
      data.languages.forEach(lang => {
        html += `<div style="font-size:9.5pt;margin-bottom:6px;color:#334155">${escapeHtml(lang.name)}`;
        if (lang.level) {
          html += `<span style="color:#64748b;font-size:8.5pt"> — ${escapeHtml(lang.level)}</span>`;
        }
        html += '</div>';
      });
      html += '</div>';
    }
    
    return html;
  },

  renderSection(title, content) {
    return `
      <div class="r-section-main">
        <div class="r-section-title">${escapeHtml(title)}</div>
        ${content}
      </div>
    `;
  },

  renderCompetencies(skills) {
    const skillNames = skills.map(s => typeof s === 'string' ? s : s.name);
    return `<div style="display:flex;flex-wrap:wrap;gap:8px">
      ${skillNames.map(s => `<span style="background:#f1f5f9;padding:4px 12px;border-radius:4px;font-size:9.5pt">${escapeHtml(s)}</span>`).join('')}
    </div>`;
  },

  renderWork(workItems) {
    return workItems.map(job => {
      const dateRange = formatDateRange(job.startDate, job.endDate);
      const bullets = parseBullets(job.description);
      
      let html = '<div style="margin-bottom:20px">';
      html += `<div style="font-size:12pt;font-weight:700;color:#1e293b;margin-bottom:2px">${escapeHtml(job.title) || 'Position'}</div>`;
      html += `<div style="font-size:10pt;color:#475569;font-weight:600">${escapeHtml(job.company) || 'Company'}`;
      if (job.location) {
        html += ` · ${escapeHtml(job.location)}`;
      }
      html += '</div>';
      if (dateRange) {
        html += `<div style="font-size:9pt;color:#64748b;font-family:monospace;margin-top:2px">${escapeHtml(dateRange)}</div>`;
      }
      
      if (bullets.length > 0) {
        html += '<ul style="margin-top:8px;padding-left:20px">';
        bullets.forEach(bullet => {
          html += `<li style="font-size:10.5pt;line-height:1.6;color:#334155;margin-bottom:3px">${escapeHtml(bullet)}</li>`;
        });
        html += '</ul>';
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderEducation(eduItems) {
    return eduItems.map(edu => {
      const dateRange = formatDateRange(edu.startDate, edu.endDate);
      
      let html = '<div style="margin-bottom:14px">';
      html += `<div style="font-size:11pt;font-weight:700;color:#1e293b">${escapeHtml(edu.degree) || 'Degree'}`;
      if (edu.field) {
        html += ` in ${escapeHtml(edu.field)}`;
      }
      html += '</div>';
      html += `<div style="font-size:10pt;color:#475569">${escapeHtml(edu.school) || 'Institution'}</div>`;
      if (dateRange || edu.gpa) {
        html += `<div style="font-size:9pt;color:#64748b;font-family:monospace">`;
        if (dateRange) html += escapeHtml(dateRange);
        if (dateRange && edu.gpa) html += ' · ';
        if (edu.gpa) html += `GPA: ${escapeHtml(edu.gpa)}`;
        html += '</div>';
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderCertificates(certs) {
    return certs.map(cert => {
      let html = '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px">';
      html += `<div><div style="font-size:10.5pt;font-weight:600;color:#1e293b">${escapeHtml(cert.name)}</div>`;
      if (cert.issuer) {
        html += `<div style="font-size:9.5pt;color:#475569">${escapeHtml(cert.issuer)}</div>`;
      }
      html += '</div>';
      if (cert.date) {
        html += `<div style="font-size:9pt;color:#64748b;font-family:monospace;white-space:nowrap">${escapeHtml(cert.date)}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderProjects(projects) {
    return projects.map(proj => {
      let html = '<div style="margin-bottom:14px">';
      html += `<div style="font-size:11pt;font-weight:700;color:#1e293b">${escapeHtml(proj.name) || 'Project'}</div>`;
      if (proj.tech) {
        html += `<div style="font-size:9pt;color:#b84c2e;text-transform:uppercase;letter-spacing:0.03em">${escapeHtml(proj.tech)}</div>`;
      }
      if (proj.description) {
        html += `<div style="font-size:10pt;line-height:1.6;color:#334155;margin-top:4px">${escapeHtml(proj.description)}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  }
};
