// ========================================
// ResumeForge v1.0 - Creative Template Renderer
// ========================================

const CreativeTemplate = {
  name: 'creative',
  label: 'Creative',
  
  render(data) {
    const basics = data.basics || {};
    const settings = data.settings || {};
    const visible = settings.visibleSections || {};
    
    let html = '<div class="template-creative">';
    
    // Creative header with accent border
    html += this.renderHeader(basics, data.photo, settings);
    
    // Summary
    if (visible.summary !== false && basics.summary) {
      html += this.renderSection('About', `<p style="line-height:1.8;font-size:11pt">${escapeHtml(basics.summary)}</p>`);
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
    
    // Certifications
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

  renderHeader(basics, photo, settings) {
    let html = '<div class="r-header">';
    if (settings.showPhoto !== false && photo) {
      html += `<img src="${escapeAttr(photo)}" class="r-photo" alt="Profile" style="width:90px;height:90px;border-radius:12px;object-fit:cover;position:absolute;right:0;top:-10px;border:3px solid var(--t-primary);box-shadow:var(--shadow-lg)">`;
    }
    html += `<div class="r-name">${escapeHtml(basics.name) || 'Your Name'}</div>`;
    if (basics.title) {
      html += `<div class="r-title">${escapeHtml(basics.title)}</div>`;
    }
    
    const contacts = [];
    if (basics.email) contacts.push(`<span>${escapeHtml(basics.email)}</span>`);
    if (basics.phone) contacts.push(`<span>${escapeHtml(basics.phone)}</span>`);
    if (basics.location) contacts.push(`<span>${escapeHtml(basics.location)}</span>`);
    if (basics.website) contacts.push(`<span>${escapeHtml(basics.website)}</span>`);
    if (basics.linkedin) contacts.push(`<span>${escapeHtml(basics.linkedin)}</span>`);
    if (basics.github) contacts.push(`<span>${escapeHtml(basics.github)}</span>`);
    
    if (contacts.length > 0) {
      html += `<div class="r-contact">${contacts.join(' · ')}</div>`;
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

  renderWork(workItems) {
    return workItems.map(job => {
      const dateRange = formatDateRange(job.startDate, job.endDate);
      const bullets = parseBullets(job.description);
      
      let html = '<div style="margin-bottom:18px">';
      html += `<div style="font-size:13pt;font-weight:800;color:#1c1c2e;letter-spacing:-0.01em">${escapeHtml(job.title) || 'Position'}</div>`;
      html += `<div style="font-size:11pt;color:#7f1d1d;font-weight:600;margin-top:2px">${escapeHtml(job.company) || 'Company'}`;
      if (job.location) {
        html += ` · ${escapeHtml(job.location)}`;
      }
      html += '</div>';
      
      if (dateRange) {
        html += `<div style="font-size:9.5pt;color:#737373;font-family:monospace;letter-spacing:0.02em">${escapeHtml(dateRange)}</div>`;
      }
      
      if (bullets.length > 0) {
        html += '<div style="margin-top:8px;padding-left:0">';
        bullets.forEach(bullet => {
          html += `<div style="font-size:10.5pt;line-height:1.7;color:#404040;margin-bottom:4px;padding-left:16px;position:relative">
            <span style="position:absolute;left:0;color:#7f1d1d">▸</span>
            ${escapeHtml(bullet)}
          </div>`;
        });
        html += '</div>';
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderEducation(eduItems) {
    return eduItems.map(edu => {
      const dateRange = formatDateRange(edu.startDate, edu.endDate);
      
      let html = '<div style="margin-bottom:14px">';
      html += `<div style="font-size:12pt;font-weight:700;color:#1c1c2e">${escapeHtml(edu.degree) || 'Degree'}`;
      if (edu.field) {
        html += ` <span style="font-weight:400">in</span> ${escapeHtml(edu.field)}`;
      }
      html += '</div>';
      html += `<div style="font-size:10.5pt;color:#7f1d1d;font-weight:500">${escapeHtml(edu.school) || 'Institution'}</div>`;
      if (dateRange || edu.gpa) {
        html += `<div style="font-size:9pt;color:#737373;font-family:monospace">`;
        const parts = [];
        if (dateRange) parts.push(escapeHtml(dateRange));
        if (edu.gpa) parts.push(`GPA: ${escapeHtml(edu.gpa)}`);
        html += parts.join(' · ');
        html += '</div>';
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderSkills(skills) {
    return `<div style="display:flex;flex-wrap:wrap;gap:8px">
      ${skills.map(skill => {
        const name = typeof skill === 'string' ? skill : skill.name;
        const level = typeof skill === 'object' && skill.level ? `<small style="opacity:0.8;font-weight:400;margin-left:5px"> — ${escapeHtml(skill.level)}</small>` : '';
        return `<span style="background:var(--t-primary);color:white;padding:6px 14px;border-radius:20px;font-size:9.5pt;font-weight:500">${escapeHtml(name)}${level}</span>`;
      }).join('')}
    </div>`;
  },

  renderProjects(projects) {
    return projects.map(proj => {
      let html = '<div style="margin-bottom:14px">';
      html += `<div style="font-size:12pt;font-weight:700;color:#1c1c2e">${escapeHtml(proj.name) || 'Project'}`;
      if (proj.link) {
        html += ` <span style="font-size:9pt;font-weight:400;color:#737373">— ${escapeHtml(proj.link)}</span>`;
      }
      html += '</div>';
      if (proj.tech) {
        html += `<div style="font-size:9pt;color:#7f1d1d;text-transform:uppercase;letter-spacing:0.05em">${escapeHtml(proj.tech)}</div>`;
      }
      if (proj.description) {
        html += `<div style="font-size:10.5pt;line-height:1.6;color:#404040;margin-top:4px">${escapeHtml(proj.description)}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderCertificates(certs) {
    return certs.map(cert => {
      let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">';
      html += `<div><div style="font-size:11pt;font-weight:600;color:#1c1c2e">${escapeHtml(cert.name)}</div>`;
      if (cert.issuer) {
        html += `<div style="font-size:9.5pt;color:#525252">${escapeHtml(cert.issuer)}</div>`;
      }
      html += '</div>';
      if (cert.date) {
        html += `<div style="font-size:9pt;color:#737373;font-family:monospace">${escapeHtml(cert.date)}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderLanguages(languages) {
    return languages.map(lang => {
      let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:11pt">';
      html += `<span style="color:#1c1c2e;font-weight:500">${escapeHtml(lang.name)}</span>`;
      if (lang.level) {
        html += `<span style="color:#737373;font-size:9.5pt">${escapeHtml(lang.level)}</span>`;
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderReferences(refs) {
    return refs.map(ref => {
      let html = '<div style="margin-bottom:14px">';
      html += `<div style="font-size:11.5pt;font-weight:700;color:#1c1c2e">${escapeHtml(ref.name)}</div>`;
      if (ref.title || ref.company) {
        html += `<div style="font-size:10pt;color:#7f1d1d;font-weight:600">${[ref.title, ref.company].filter(Boolean).join(', ')}</div>`;
      }
      if (ref.email || ref.phone) {
        html += `<div style="font-size:10pt;color:#525252">${[ref.email, ref.phone].filter(Boolean).join(' · ')}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  }
};
