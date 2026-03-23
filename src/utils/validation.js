// ========================================
// ResumeForge v1.0 - Validation
// ========================================

const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Name is required (2-100 characters)'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    required: false,
    pattern: /^[\d\s\-\+\(\)\.]+$/,
    message: 'Please enter a valid phone number'
  },
  website: {
    required: false,
    pattern: /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
    message: 'Please enter a valid URL'
  },
  linkedin: {
    required: false,
    message: 'LinkedIn profile'
  },
  title: {
    required: false,
    maxLength: 100,
    message: 'Professional title'
  }
};

class Validator {
  /**
   * Validate a single field
   */
  validateField(fieldName, value) {
    const rule = VALIDATION_RULES[fieldName];
    if (!rule) return { valid: true };

    // Required check
    if (rule.required && (!value || value.trim() === '')) {
      return { valid: false, message: rule.message };
    }

    // Skip further validation if empty and not required
    if (!value || value.trim() === '') {
      return { valid: true };
    }

    // Min length check
    if (rule.minLength && value.length < rule.minLength) {
      return { valid: false, message: `Minimum ${rule.minLength} characters required` };
    }

    // Max length check
    if (rule.maxLength && value.length > rule.maxLength) {
      return { valid: false, message: `Maximum ${rule.maxLength} characters allowed` };
    }

    // Pattern check
    if (rule.pattern && !rule.pattern.test(value)) {
      return { valid: false, message: rule.message };
    }

    return { valid: true };
  }

  /**
   * Validate all basics fields
   */
  validateBasics(basics) {
    const errors = {};
    
    for (const [field, value] of Object.entries(basics)) {
      const result = this.validateField(field, value);
      if (!result.valid) {
        errors[field] = result.message;
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate a work experience entry
   */
  validateWorkEntry(entry) {
    const errors = {};

    if (!entry.title || entry.title.trim() === '') {
      errors.title = 'Job title is required';
    }

    if (!entry.company || entry.company.trim() === '') {
      errors.company = 'Company name is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate an education entry
   */
  validateEducationEntry(entry) {
    const errors = {};

    if (!entry.degree || entry.degree.trim() === '') {
      errors.degree = 'Degree is required';
    }

    if (!entry.school || entry.school.trim() === '') {
      errors.school = 'Institution is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Check if resume is ready for export
   */
  isReadyForExport(resumeData) {
    const hasName = !!resumeData.basics?.name?.trim();
    const hasEmail = !!resumeData.basics?.email?.trim();
    const hasMinContent = this.hasMinimumContent(resumeData);
    
    const settings = resumeData.settings || {};
    const visible = settings.visibleSections || {};
    
    // Check if visible sections are empty
    const emptySections = [];
    if (visible.experience && (!resumeData.work || resumeData.work.length === 0)) emptySections.push('Experience');
    if (visible.education && (!resumeData.education || resumeData.education.length === 0)) emptySections.push('Education');
    if (visible.skills && (!resumeData.skills || resumeData.skills.length === 0)) emptySections.push('Skills');

    const checks = { hasName, hasEmail, hasMinContent };
    const missing = [];
    if (!hasName) missing.push('Full Name');
    if (!hasEmail) missing.push('Email');
    if (!hasMinContent) missing.push('At least one resume section');

    return {
      ready: hasName && hasEmail,
      warn: emptySections.length > 0,
      checks,
      missing,
      emptySections
    };
  }

  /**
   * Check if resume has minimum content
   */
  hasMinimumContent(resumeData) {
    const basics = resumeData.basics || {};
    const hasBasicInfo = basics.name?.trim() && basics.title?.trim();
    const hasWork = (resumeData.work?.length || 0) > 0;
    const hasEducation = (resumeData.education?.length || 0) > 0;
    const hasSkills = (resumeData.skills?.length || 0) >= 3;
    const hasSummary = basics.summary?.trim()?.length > 50;

    return hasBasicInfo || hasWork || hasEducation || hasSkills || hasSummary;
  }
}

// Create global instance
const validator = new Validator();
