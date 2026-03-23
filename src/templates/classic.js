// ========================================
// ResumeForge v1.0 - Classic Template Renderer
// ========================================

const ClassicTemplate = {
  name: 'classic',
  label: 'Classic',
  
  render(data) {
    const basics = data.basics || {};
    const settings = data.settings || {};
    const visible = settings.visibleSections || {};
    
    let html = '<div class="template-classic">';
    
    // Header with centered layout
    html += this.renderHeader(basics, settings);
    
    // Summary
    if (visible.summary !== false && basics.summary) {
      html += this.renderSection('Professional Summary', this.renderText(basics.summary));
    }
    
    // Work Experience
    if (visible.experience !== false && data.work?.length > 0) {
      html += this.renderSection('Experience', this.renderWork(data.work));
    }
    
    // Education
    if (visible.education !== false && data.education?.length > 0) {
      html += this.renderSection('Education', this.renderEducation(data.education));
    }
    
    // Skills
    if (visible.skills !== false && data.skills?.length > 0) {
      html += this.renderSection('Skills', this.renderSkills(data.skills));
    }
    
    // Projects
    if (visible.projects !== false && data.projects?.length > 0) {
      html += this.renderSection('Projects', this.renderProjects(data.projects));
    }
    
    // Certificates
    if (visible.certificates !== false && data.certificates?.length > 0) {
      html += this.renderSection('Certifications', this.renderCertificates(data.certificates));
    }
    
    // Languages
    if (visible.languages !== false && data.languages?.length > 0) {
      html += this.renderSection('Languages', this.renderLanguages(data.languages));
    }
    
    html += '</div>';
    return html;
  },

  renderHeader(basics, settings) {
    let html = '<div class="r-header">';
    html += `<div class="r-name">${escapeHtml(basics.name) || 'Your Name'}</div>`;
    if (basics.title) {
      html += `<div class="r-title">${escapeHtml(basics.title)}</div>`;
    }
    
    // Contact info in header
    const contacts = [];
    if (basics.email) contacts.push(`<span>${escapeHtml(basics.email)}</span>`);
    if (basics.phone) contacts.push(`<span>${escapeHtml(basics.phone)}</span>`);
    if (basics.location) contacts.push(`<span>${escapeHtml(basics.location)}</span>`);
    if (basics.website) contacts.push(`<span>${escapeHtml(basics.website)}</span>`);
    
    if (contacts.length > 0) {
      html += `<div class="r-contact">${contacts.join('')}</div>`;
    }
    html += '</div>';
    return html;
  },

  renderSection(title, content) {
    return `
      <div class="r-section">
        <div class="r-section-title">${escapeHtml(title)}</div>
        ${content}
      </div>
    `;
  },

  renderText(text) {
    return `<div class="r-summary">${escapeHtml(text)}</div>`;
  },

  renderWork(workItems) {
    return workItems.map(job => {
      const dateRange = formatDateRange(job.startDate, job.endDate);
      const bullets = parseBullets(job.description);
      
      let html = '<div class="r-job">';
      html += `<div class="r-job-title">${escapeHtml(job.title) || 'Position'}`;
      if (dateRange) {
        html += `<span class="r-job-date">${escapeHtml(dateRange)}</span>`;
      }
      html += '</div>';
      
      if (job.company) {
        html += `<div class="r-job-company">${escapeHtml(job.company)}`;
        if (job.location) {
          html += ` — ${escapeHtml(job.location)}`;
        }
        html += '</div>';
      }
      
      if (bullets.length > 0) {
        html += '<ul class="r-job-desc">';
        bullets.forEach(bullet => {
          html += `<li>${escapeHtml(bullet)}</li>`;
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
      
      let html = '<div class="r-edu-item">';
      html += `<div class="r-edu-degree">${escapeHtml(edu.degree) || 'Degree'}`;
      if (edu.field) {
        html += ` in ${escapeHtml(edu.field)}`;
      }
      if (dateRange) {
        html += `<span class="r-job-date">${escapeHtml(dateRange)}</span>`;
      }
      html += '</div>';
      html += `<div class="r-edu-school">${escapeHtml(edu.school) || 'Institution'}`;
      if (edu.gpa) {
        html += ` — GPA: ${escapeHtml(edu.gpa)}`;
      }
      html += '</div>';
      html += '</div>';
      return html;
    }).join('');
  },

  renderSkills(skills) {
    const skillNames = skills.map(s => typeof s === 'string' ? s : s.name);
    return `<p style="text-align:center;font-size:11pt">${escapeHtml(skillNames.join(' • '))}</p>`;
  },

  renderProjects(projects) {
    return projects.map(proj => {
      let html = '<div class="r-job">';
      html += `<div class="r-job-title">${escapeHtml(proj.name) || 'Project'}`;
      if (proj.link) {
        html += ` <span style="font-size:10pt;font-weight:400">(${escapeHtml(proj.link)})</span>`;
      }
      html += '</div>';
      if (proj.tech) {
        html += `<div style="font-size:10pt;color:#475569;font-style:italic">${escapeHtml(proj.tech)}</div>`;
      }
      if (proj.description) {
        html += `<div class="r-job-desc">${escapeHtml(proj.description)}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderCertificates(certs) {
    return certs.map(cert => {
      let html = '<div class="r-job">';
      html += `<div class="r-job-title">${escapeHtml(cert.name) || 'Certification'}`;
      if (cert.date) {
        html += `<span class="r-job-date">${escapeHtml(cert.date)}</span>`;
      }
      html += '</div>';
      if (cert.issuer) {
        html += `<div style="font-size:10pt;font-style:italic">${escapeHtml(cert.issuer)}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderLanguages(languages) {
    return languages.map(lang => {
      let text = escapeHtml(lang.name);
      if (lang.level) {
        text += ` (${escapeHtml(lang.level)})`;
      }
      return `<span style="margin-right:20px;font-size:11pt">${text}</span>`;
    }).join('');
  }
};
