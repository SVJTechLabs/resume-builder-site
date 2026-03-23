// ========================================
// ResumeForge v1.0 - Storage Manager
// Handles localStorage persistence and multiple resume management
// ========================================

const STORAGE_KEY = 'resumeforge_v1_data';
const CURRENT_RESUME_KEY = 'resumeforge_v1_current';
const AUTOSAVE_DELAY = 1000;

/**
 * Default resume data structure
 */
const DEFAULT_RESUME_DATA = {
  id: null,
  name: 'Untitled Resume',
  createdAt: null,
  updatedAt: null,
  basics: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: ''
  },
  photo: null,
  work: [],
  education: [],
  skills: [],
  projects: [],
  certificates: [],
  languages: [],
  references: [],
  settings: {
    template: 'modern',
    color: 'slate',
    fontHeading: 'Georgia',
    fontBody: 'Inter',
    showPhoto: true,
    showPageNumbers: false,
    showSectionLines: true,
    visibleSections: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certificates: false,
      languages: false,
      references: false
    }
  }
};

/**
 * Popular skills for quick-add
 */
const POPULAR_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
  'SQL', 'AWS', 'Docker', 'Git', 'Java', 'C++', 'MongoDB',
  'REST APIs', 'GraphQL', 'Kubernetes', 'Machine Learning',
  'Excel', 'Figma', 'Communication', 'Leadership', 'Agile/Scrum',
  'Project Management', 'Data Analysis', 'Photoshop', 'Illustrator',
  'HTML/CSS', 'Vue.js', 'Angular', 'PHP', 'Ruby', 'Go',
  'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native'
];

class StorageManager {
  constructor() {
    this.autosaveTimer = null;
    this.onAutosave = null;
  }

  /**
   * Get all stored resumes
   */
  getAllResumes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return [];
    }
  }

  /**
   * Save all resumes
   */
  saveAllResumes(resumes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
      return true;
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      return false;
    }
  }

  /**
   * Get a specific resume by ID
   */
  getResume(id) {
    const resumes = this.getAllResumes();
    return resumes.find(r => r.id === id) || null;
  }

  /**
   * Create a new resume
   */
  createResume(name = 'Untitled Resume') {
    const now = new Date().toISOString();
    const newResume = deepClone(DEFAULT_RESUME_DATA);
    newResume.id = generateId();
    newResume.name = name;
    newResume.createdAt = now;
    newResume.updatedAt = now;

    const resumes = this.getAllResumes();
    resumes.push(newResume);
    this.saveAllResumes(resumes);
    this.setCurrentResumeId(newResume.id);

    return newResume;
  }

  /**
   * Update an existing resume
   */
  updateResume(id, updates) {
    const resumes = this.getAllResumes();
    const index = resumes.findIndex(r => r.id === id);
    
    if (index === -1) return null;

    resumes[index] = {
      ...resumes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveAllResumes(resumes);
    return resumes[index];
  }

  /**
   * Save resume data (full replacement)
   */
  saveResume(resumeData) {
    const resumes = this.getAllResumes();
    const index = resumes.findIndex(r => r.id === resumeData.id);
    
    if (index === -1) {
      resumes.push(resumeData);
    } else {
      resumes[index] = {
        ...resumeData,
        updatedAt: new Date().toISOString()
      };
    }

    return this.saveAllResumes(resumes);
  }

  /**
   * Delete a resume
   */
  deleteResume(id) {
    const resumes = this.getAllResumes();
    const filtered = resumes.filter(r => r.id !== id);
    
    if (filtered.length === resumes.length) return false;
    
    this.saveAllResumes(filtered);
    
    // If we deleted the current resume, clear it
    if (this.getCurrentResumeId() === id) {
      localStorage.removeItem(CURRENT_RESUME_KEY);
    }
    
    return true;
  }

  /**
   * Get current resume ID
   */
  getCurrentResumeId() {
    return localStorage.getItem(CURRENT_RESUME_KEY);
  }

  /**
   * Set current resume ID
   */
  setCurrentResumeId(id) {
    localStorage.setItem(CURRENT_RESUME_KEY, id);
  }

  /**
   * Get current resume or create new one
   */
  getCurrentResume() {
    const currentId = this.getCurrentResumeId();
    
    if (currentId) {
      const resume = this.getResume(currentId);
      if (resume) return resume;
    }

    // Create default resume if none exists
    return this.createResume('My Resume');
  }

  /**
   * Duplicate a resume
   */
  duplicateResume(id) {
    const original = this.getResume(id);
    if (!original) return null;

    const copy = deepClone(original);
    copy.id = generateId();
    copy.name = `${original.name} (Copy)`;
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = copy.createdAt;

    const resumes = this.getAllResumes();
    resumes.push(copy);
    this.saveAllResumes(resumes);

    return copy;
  }

  /**
   * Rename a resume
   */
  renameResume(id, newName) {
    return this.updateResume(id, { name: newName });
  }

  /**
   * Export resume as JSON
   */
  exportResume(id) {
    const resume = this.getResume(id);
    if (!resume) return null;
    return JSON.stringify(resume, null, 2);
  }

  /**
   * Import resume from JSON
   */
  importResume(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      // Validate required fields
      if (!data.basics || !data.settings) {
        throw new Error('Invalid resume format');
      }

      // Assign new ID and timestamps
      data.id = generateId();
      data.createdAt = new Date().toISOString();
      data.updatedAt = data.createdAt;
      data.name = data.name || 'Imported Resume';

      const resumes = this.getAllResumes();
      resumes.push(data);
      this.saveAllResumes(resumes);

      return data;
    } catch (e) {
      console.error('Error importing resume:', e);
      return null;
    }
  }

  /**
   * Schedule autosave
   */
  scheduleAutosave(resumeData) {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
    }

    this.autosaveTimer = setTimeout(() => {
      this.saveResume(resumeData);
      if (this.onAutosave) {
        this.onAutosave();
      }
    }, AUTOSAVE_DELAY);
  }

  /**
   * Clear all data (for testing)
   */
  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_RESUME_KEY);
  }

  /**
   * Get storage stats
   */
  getStats() {
    const resumes = this.getAllResumes();
    return {
      totalResumes: resumes.length,
      totalSize: new Blob([JSON.stringify(resumes)]).size,
      lastSaved: resumes.length > 0 
        ? Math.max(...resumes.map(r => new Date(r.updatedAt).getTime()))
        : null
    };
  }
}

// Create global instance
const storage = new StorageManager();
