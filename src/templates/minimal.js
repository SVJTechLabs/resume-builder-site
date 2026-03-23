// ========================================
// ResumeForge v1.0 - Minimal Template Renderer
// ========================================

const MinimalTemplate = {
  name: 'minimal',
  label: 'Minimal',
  
  render(data) {
    const basics = data.basics || {};
    const settings = data.settings || {};
    const visible = settings.visibleSections || {};
    
    let html = '<div class="template-minimal">';
    
    // Simple header
    html += this.renderHeader(basics);
    
    // Summary
    if (visible.summary !== false && basics.summary) {
      html += `<p style="margin-bottom:20px;line-height:1.7">${escapeHtml(basics.summary)}</p>`;
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
    
    // References
    if (visible.references !== false && data.references?.length > 0) {
      html += this.renderSection('References', this.renderReferences(data.references));
    }
    
    html += '</div>';
    return html;
  },

  renderHeader(basics) {
    let html = '<div class="r-header">';
    html += `<h1 class="r-name">${escapeHtml(basics.name) || 'Your Name'}</h1>`;
    if (basics.title) {
      html += `<div class="r-title">${escapeHtml(basics.title)}</div>`;
    }
    
    const contacts = [];
    if (basics.email) contacts.push(escapeHtml(basics.email));
    if (basics.phone) contacts.push(escapeHtml(basics.phone));
    if (basics.location) contacts.push(escapeHtml(basics.location));
    if (basics.website) contacts.push(escapeHtml(basics.website));
    if (basics.linkedin) contacts.push(escapeHtml(basics.linkedin));
    if (basics.github) contacts.push(escapeHtml(basics.github));
    
    if (contacts.length > 0) {
      html += `<div class="r-contact">${contacts.join(' · ')}</div>`;
    }
    html += '</div>';
    return html;
  },

  renderSection(title, content) {
    return `
      <div class="r-section">
        <h2 class="r-section-title">${escapeHtml(title)}</h2>
        ${content}
      </div>
    `;
  },

  renderWork(workItems) {
    return workItems.map(job => {
      const dateRange = formatDateRange(job.startDate, job.endDate);
      
      let html = '<div class="r-job">';
      html += `<div class="r-job-title">${escapeHtml(job.title) || 'Position'}`;
      if (dateRange) {
        html += `<span class="r-job-date">${escapeHtml(dateRange)}</span>`;
      }
      html += '</div>';
      
      if (job.company) {
        html += `<div class="r-job-company">${escapeHtml(job.company)}`;
        if (job.location) {
          html += `, ${escapeHtml(job.location)}`;
        }
        html += '</div>';
      }
      
      if (job.description) {
        html += `<div style="font-size:10pt;color:#404040;margin-top:6px;line-height:1.5">${escapeHtml(job.description)}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderEducation(eduItems) {
    return eduItems.map(edu => {
      const dateRange = formatDateRange(edu.startDate, edu.endDate);
      
      let html = '<div class="r-job">';
      html += `<div class="r-job-title">${escapeHtml(edu.degree) || 'Degree'}`;
      if (dateRange) {
        html += `<span class="r-job-date">${escapeHtml(dateRange)}</span>`;
      }
      html += '</div>';
      html += `<div class="r-job-company">${escapeHtml(edu.school) || 'Institution'}`;
      if (edu.field) {
        html += ` — ${escapeHtml(edu.field)}`;
      }
      html += '</div>';
      html += '</div>';
      return html;
    }).join('');
  },

  renderSkills(skills) {
    const skillsText = skills.map(skill => {
      const name = typeof skill === 'string' ? skill : skill.name;
      const level = typeof skill === 'object' && skill.level ? ` (${skill.level})` : '';
      return escapeHtml(name + level);
    }).join(', ');
    return `<p style="font-size:10.5pt;line-height:1.6">${skillsText}</p>`;
  },

  renderProjects(projects) {
    return projects.map(proj => {
      let html = '<div class="r-job">';
      html += `<div class="r-job-title">${escapeHtml(proj.name) || 'Project'}`;
      if (proj.link) {
        html += ` <span style="font-size:9pt;font-weight:400;color:#737373">(${escapeHtml(proj.link)})</span>`;
      }
      html += '</div>';
      if (proj.tech) {
        html += `<div style="font-size:9.5pt;color:#525252">${escapeHtml(proj.tech)}</div>`;
      }
      if (proj.description) {
        html += `<div style="font-size:10pt;color:#404040;margin-top:4px">${escapeHtml(proj.description)}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderCertificates(certs) {
    return certs.map(cert => {
      let html = '<div class="r-job">';
      html += `<div class="r-job-title">${escapeHtml(cert.name)}`;
      if (cert.date) {
        html += `<span class="r-job-date">${escapeHtml(cert.date)}</span>`;
      }
      html += '</div>';
      if (cert.issuer) {
        html += `<div class="r-job-company">${escapeHtml(cert.issuer)}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderLanguages(languages) {
    return languages.map(lang => {
      let text = escapeHtml(lang.name);
      if (lang.level) {
        text += ` — ${escapeHtml(lang.level)}`;
      }
      return `<div style="font-size:10.5pt;margin-bottom:4px">${text}</div>`;
    }).join('');
  },

  renderReferences(refs) {
    return refs.map(ref => {
      let html = '<div class="r-job">';
      html += `<div class="r-job-title">${escapeHtml(ref.name) || 'Reference Name'}</div>`;
      if (ref.title || ref.company) {
        let info = [];
        if (ref.title) info.push(escapeHtml(ref.title));
        if (ref.company) info.push(escapeHtml(ref.company));
        html += `<div class="r-job-company">${info.join(', ')}</div>`;
      }
      if (ref.email || ref.phone) {
        let contact = [];
        if (ref.email) contact.push(escapeHtml(ref.email));
        if (ref.phone) contact.push(escapeHtml(ref.phone));
        html += `<div style="font-size:9pt;color:#737373">${contact.join(' · ')}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  }
};
