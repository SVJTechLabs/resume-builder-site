// ========================================
// ResumeForge v1.0 - Modern Template Renderer
// ========================================

const ModernTemplate = {
  name: 'modern',
  label: 'Modern',
  
  render(data) {
    const basics = data.basics || {};
    const settings = data.settings || {};
    const visible = settings.visibleSections || {};
    
    let html = '<div class="template-modern">';
    
    // Header
    html += this.renderHeader(basics, data.photo, settings);
    
    // Summary
    if (visible.summary !== false && basics.summary) {
      html += this.renderSummary(basics.summary);
    }
    
    // Work Experience
    if (visible.experience !== false && data.work?.length > 0) {
      html += this.renderWork(data.work);
    }
    
    // Education
    if (visible.education !== false && data.education?.length > 0) {
      html += this.renderEducation(data.education);
    }
    
    // Skills
    if (visible.skills !== false && data.skills?.length > 0) {
      html += this.renderSkills(data.skills);
    }
    
    // Projects
    if (visible.projects !== false && data.projects?.length > 0) {
      html += this.renderProjects(data.projects);
    }
    
    // Certificates
    if (visible.certificates !== false && data.certificates?.length > 0) {
      html += this.renderCertificates(data.certificates);
    }
    
    // Languages
    if (visible.languages !== false && data.languages?.length > 0) {
      html += this.renderLanguages(data.languages);
    }
    
    // References
    if (visible.references !== false && data.references?.length > 0) {
      html += this.renderReferences(data.references);
    }
    
    html += '</div>';
    return html;
  },

  renderHeader(basics, photo, settings) {
    let html = '<div class="r-header">';
    html += '<div class="r-header-left">';
    html += `<div class="r-name">${escapeHtml(basics.name) || 'Your Name'}</div>`;
    if (basics.title) {
      html += `<div class="r-title">${escapeHtml(basics.title)}</div>`;
    }
    
    // Contact info
    const contacts = [];
    if (basics.email) contacts.push(`<span>✉ ${escapeHtml(basics.email)}</span>`);
    if (basics.phone) contacts.push(`<span>☎ ${escapeHtml(basics.phone)}</span>`);
    if (basics.location) contacts.push(`<span>📍 ${escapeHtml(basics.location)}</span>`);
    if (basics.linkedin) contacts.push(`<span>💼 ${escapeHtml(basics.linkedin)}</span>`);
    if (basics.github) contacts.push(`<span>⚙ ${escapeHtml(basics.github)}</span>`);
    if (basics.website) contacts.push(`<span>🌐 ${escapeHtml(basics.website)}</span>`);
    
    if (contacts.length > 0) {
      html += `<div class="r-contact">${contacts.join('')}</div>`;
    }
    html += '</div>';
    
    // Photo
    if (settings.showPhoto !== false && photo) {
      html += `<img src="${escapeAttr(photo)}" class="r-photo" alt="Profile">`;
    }
    
    html += '</div>';
    return html;
  },

  renderSummary(summary) {
    return `
      <div class="r-section">
        <div class="r-section-title">Professional Summary</div>
        <div class="r-summary">${escapeHtml(summary)}</div>
      </div>
    `;
  },

  renderWork(workItems) {
    let html = '<div class="r-section">';
    html += '<div class="r-section-title">Work Experience</div>';
    
    workItems.forEach(job => {
      const dateRange = formatDateRange(job.startDate, job.endDate);
      const bullets = parseBullets(job.description);
      
      html += '<div class="r-job">';
      html += '<div class="r-job-header">';
      html += `<div class="r-job-title">${escapeHtml(job.title) || 'Position'}</div>`;
      if (dateRange) {
        html += `<div class="r-job-date">${escapeHtml(dateRange)}</div>`;
      }
      html += '</div>';
      
      if (job.company) {
        const location = job.location ? ` · ${escapeHtml(job.location)}` : '';
        html += `<div class="r-job-company">${escapeHtml(job.company)}${location}</div>`;
      }
      
      if (bullets.length > 0) {
        html += '<ul class="r-job-desc">';
        bullets.forEach(bullet => {
          html += `<li>${escapeHtml(bullet)}</li>`;
        });
        html += '</ul>';
      }
      html += '</div>';
    });
    
    html += '</div>';
    return html;
  },

  renderEducation(eduItems) {
    let html = '<div class="r-section">';
    html += '<div class="r-section-title">Education</div>';
    
    eduItems.forEach(edu => {
      const dateRange = formatDateRange(edu.startDate, edu.endDate);
      
      html += '<div class="r-edu-item">';
      html += `<div class="r-edu-degree">${escapeHtml(edu.degree) || 'Degree'}`;
      if (edu.field) {
        html += ` in ${escapeHtml(edu.field)}`;
      }
      html += '</div>';
      html += `<div class="r-edu-school">${escapeHtml(edu.school) || 'Institution'}</div>`;
      
      let meta = [];
      if (dateRange) meta.push(dateRange);
      if (edu.gpa) meta.push(`GPA: ${escapeHtml(edu.gpa)}`);
      
      if (meta.length > 0) {
        html += `<div class="r-edu-meta">${escapeHtml(meta.join(' · '))}</div>`;
      }
      html += '</div>';
    });
    
    html += '</div>';
    return html;
  },

  renderSkills(skills) {
    let html = '<div class="r-section">';
    html += '<div class="r-section-title">Skills & Technologies</div>';
    html += '<div class="r-skills-grid">';
    
    skills.forEach(skill => {
      const skillName = typeof skill === 'string' ? skill : skill.name;
      html += `<span class="r-skill">${escapeHtml(skillName)}</span>`;
    });
    
    html += '</div></div>';
    return html;
  },

  renderProjects(projects) {
    let html = '<div class="r-section">';
    html += '<div class="r-section-title">Projects</div>';
    
    projects.forEach(proj => {
      html += '<div class="r-project">';
      html += `<div class="r-project-name">${escapeHtml(proj.name) || 'Project Name'}`;
      if (proj.link) {
        html += ` <span style="font-size:9pt;font-weight:400;color:#888">· ${escapeHtml(proj.link)}</span>`;
      }
      html += '</div>';
      
      if (proj.tech) {
        html += `<div class="r-project-tech">${escapeHtml(proj.tech)}</div>`;
      }
      
      if (proj.description) {
        html += `<div class="r-project-desc">${escapeHtml(proj.description)}</div>`;
      }
      html += '</div>';
    });
    
    html += '</div>';
    return html;
  },

  renderCertificates(certs) {
    let html = '<div class="r-section">';
    html += '<div class="r-section-title">Certifications & Awards</div>';
    
    certs.forEach(cert => {
      html += '<div class="r-cert">';
      html += '<div>';
      html += `<div class="r-cert-name">${escapeHtml(cert.name) || 'Certification'}</div>`;
      if (cert.issuer) {
        html += `<div class="r-cert-issuer">${escapeHtml(cert.issuer)}</div>`;
      }
      html += '</div>';
      if (cert.date) {
        html += `<div class="r-cert-date">${escapeHtml(cert.date)}</div>`;
      }
      html += '</div>';
    });
    
    html += '</div>';
    return html;
  },

  renderLanguages(languages) {
    let html = '<div class="r-section">';
    html += '<div class="r-section-title">Languages</div>';
    
    languages.forEach(lang => {
      html += '<div class="r-lang">';
      html += `<span>${escapeHtml(lang.name) || 'Language'}</span>`;
      if (lang.level) {
        html += `<span style="color:#64748b">${escapeHtml(lang.level)}</span>`;
      }
      html += '</div>';
    });
    
    html += '</div>';
    return html;
  },

  renderReferences(refs) {
    let html = '<div class="r-section">';
    html += '<div class="r-section-title">References</div>';
    
    refs.forEach(ref => {
      html += '<div class="r-ref">';
      html += `<div class="r-ref-name">${escapeHtml(ref.name) || 'Reference Name'}</div>`;
      if (ref.title) {
        html += `<div class="r-ref-title">${escapeHtml(ref.title)}`;
        if (ref.company) {
          html += `, ${escapeHtml(ref.company)}`;
        }
        html += '</div>';
      }
      if (ref.email) {
        html += `<div style="font-size:10pt;color:#64748b">${escapeHtml(ref.email)}</div>`;
      }
      if (ref.phone) {
        html += `<div style="font-size:10pt;color:#64748b">${escapeHtml(ref.phone)}</div>`;
      }
      html += '</div>';
    });
    
    html += '</div>';
    return html;
  }
};
