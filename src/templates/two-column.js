// ========================================
// ResumeForge v1.0 - Two-Column Template Renderer
// ========================================

const TwoColumnTemplate = {
  name: 'two-column',
  label: 'Two-Column',
  
  render(data) {
    const basics = data.basics || {};
    const settings = data.settings || {};
    const visible = settings.visibleSections || {};
    
    let html = '<div class="template-two-column">';
    
    // Left column - personal info, skills, languages
    html += '<div class="r-left-col">';
    html += this.renderLeftColumn(basics, data, visible);
    html += '</div>';
    
    // Right column - main content
    html += '<div class="r-right-col">';
    
    // Summary
    if (visible.summary !== false && basics.summary) {
      html += this.renderRightSection('Professional Summary', `<p style="line-height:1.7;font-size:10.5pt">${escapeHtml(basics.summary)}</p>`);
    }
    
    // Work Experience
    if (visible.experience !== false && data.work?.length > 0) {
      html += this.renderRightSection('Work Experience', this.renderWork(data.work));
    }
    
    // Education
    if (visible.education !== false && data.education?.length > 0) {
      html += this.renderRightSection('Education', this.renderEducation(data.education));
    }
    
    // Projects
    if (visible.projects !== false && data.projects?.length > 0) {
      html += this.renderRightSection('Projects', this.renderProjects(data.projects));
    }
    
    // Certifications
    if (visible.certificates !== false && data.certificates?.length > 0) {
      html += this.renderRightSection('Certifications', this.renderCertificates(data.certificates));
    }
    
    // References
    if (visible.references !== false && data.references?.length > 0) {
      html += this.renderRightSection('References', this.renderReferences(data.references));
    }
    
    html += '</div>';
    html += '</div>';
    return html;
  },

  renderLeftColumn(basics, data, visible) {
    let html = '';
    
    // Name
    html += `<div class="r-name">${escapeHtml(basics.name) || 'Your Name'}</div>`;
    if (basics.title) {
      html += `<div class="r-title">${escapeHtml(basics.title)}</div>`;
    }
    
    // Contact info
    html += '<div class="r-contact-left">';
    if (basics.email) {
      html += `<div class="r-contact-item">${escapeHtml(basics.email)}</div>`;
    }
    if (basics.phone) {
      html += `<div class="r-contact-item">${escapeHtml(basics.phone)}</div>`;
    }
    if (basics.location) {
      html += `<div class="r-contact-item">${escapeHtml(basics.location)}</div>`;
    }
    if (basics.linkedin) {
      html += `<div class="r-contact-item">${escapeHtml(basics.linkedin)}</div>`;
    }
    if (basics.github) {
      html += `<div class="r-contact-item">${escapeHtml(basics.github)}</div>`;
    }
    if (basics.website) {
      html += `<div class="r-contact-item">${escapeHtml(basics.website)}</div>`;
    }
    if (basics.github) {
      html += `<div class="r-contact-item">${escapeHtml(basics.github)}</div>`;
    }
    html += '</div>';
    
    // Skills in left column
    if (visible.skills !== false && data.skills?.length > 0) {
      html += '<div class="r-skills-left">';
      html += '<div class="r-skills-title">Skills</div>';
      data.skills.forEach(skill => {
        const skillName = typeof skill === 'string' ? skill : skill.name;
        const level = typeof skill === 'object' && skill.level ? `<small style="opacity:0.7;font-size:0.85em;margin-left:3px"> — ${escapeHtml(skill.level)}</small>` : '';
        html += `<div class="r-skill-left">${escapeHtml(skillName)}${level}</div>`;
      });
      html += '</div>';
    }
    
    // Languages in left column
    if (visible.languages !== false && data.languages?.length > 0) {
      html += '<div class="r-skills-left">';
      html += '<div class="r-skills-title">Languages</div>';
      data.languages.forEach(lang => {
        html += `<div class="r-skill-left">${escapeHtml(lang.name)}`;
        if (lang.level) {
          html += `<span style="color:#64748b;font-size:8.5pt"> — ${escapeHtml(lang.level)}</span>`;
        }
        html += '</div>';
      });
      html += '</div>';
    }
    
    return html;
  },

  renderRightSection(title, content) {
    return `
      <div class="r-section-right">
        <div class="r-section-title">${escapeHtml(title)}</div>
        ${content}
      </div>
    `;
  },

  renderWork(workItems) {
    return workItems.map(job => {
      const dateRange = formatDateRange(job.startDate, job.endDate);
      const bullets = parseBullets(job.description);
      
      let html = '<div style="margin-bottom:14px">';
      html += `<div style="font-size:11pt;font-weight:700;color:#1e293b">${escapeHtml(job.title) || 'Position'}</div>`;
      html += `<div style="font-size:10pt;color:#475569">${escapeHtml(job.company) || 'Company'}`;
      if (job.location) {
        html += ` — ${escapeHtml(job.location)}`;
      }
      html += '</div>';
      
      if (dateRange) {
        html += `<div style="font-size:9pt;color:#64748b;font-family:monospace">${escapeHtml(dateRange)}</div>`;
      }
      
      if (bullets.length > 0) {
        html += '<ul style="margin-top:6px;padding-left:18px">';
        bullets.forEach(bullet => {
          html += `<li style="font-size:9.5pt;line-height:1.5;color:#334155;margin-bottom:2px">${escapeHtml(bullet)}</li>`;
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
      
      let html = '<div style="margin-bottom:12px">';
      html += `<div style="font-size:11pt;font-weight:700;color:#1e293b">${escapeHtml(edu.degree) || 'Degree'}`;
      if (edu.field) {
        html += ` — ${escapeHtml(edu.field)}`;
      }
      html += '</div>';
      html += `<div style="font-size:10pt;color:#475569">${escapeHtml(edu.school) || 'Institution'}</div>`;
      if (dateRange || edu.gpa) {
        html += `<div style="font-size:9pt;color:#64748b;font-family:monospace">`;
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

  renderProjects(projects) {
    return projects.map(proj => {
      let html = '<div style="margin-bottom:12px">';
      html += `<div style="font-size:10.5pt;font-weight:700;color:#1e293b">${escapeHtml(proj.name) || 'Project'}`;
      if (proj.link) {
        html += ` <span style="font-size:8.5pt;font-weight:400;color:#64748b">${escapeHtml(proj.link)}</span>`;
      }
      html += '</div>';
      if (proj.tech) {
        html += `<div style="font-size:9pt;color:#475569">${escapeHtml(proj.tech)}</div>`;
      }
      if (proj.description) {
        html += `<div style="font-size:9.5pt;line-height:1.5;color:#334155">${escapeHtml(proj.description)}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderCertificates(certs) {
    return certs.map(cert => {
      let html = '<div style="display:flex;justify-content:space-between;margin-bottom:8px;align-items:baseline">';
      html += `<div><div style="font-size:10pt;font-weight:600;color:#1e293b">${escapeHtml(cert.name)}</div>`;
      if (cert.issuer) {
        html += `<div style="font-size:9pt;color:#475569">${escapeHtml(cert.issuer)}</div>`;
      }
      html += '</div>';
      if (cert.date) {
        html += `<div style="font-size:9pt;color:#64748b;font-family:monospace;white-space:nowrap">${escapeHtml(cert.date)}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  },

  renderReferences(refs) {
    return refs.map(ref => {
      let html = '<div style="margin-bottom:12px">';
      html += `<div style="font-size:10.5pt;font-weight:700;color:#1e293b">${escapeHtml(ref.name)}</div>`;
      if (ref.title || ref.company) {
        html += `<div style="font-size:9.5pt;color:#475569">${[ref.title, ref.company].filter(Boolean).join(', ')}</div>`;
      }
      if (ref.email || ref.phone) {
        html += `<div style="font-size:9pt;color:#64748b">${[ref.email, ref.phone].filter(Boolean).join(' · ')}</div>`;
      }
      html += '</div>';
      return html;
    }).join('');
  }
};
