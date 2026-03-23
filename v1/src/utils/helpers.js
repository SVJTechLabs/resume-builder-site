// ========================================
// ResumeForge v1.0 - Utility Helpers
// ========================================

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escape attribute values for safe HTML insertion
 */
function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;');
}

/**
 * Format date range from start and end dates
 */
function formatDateRange(start, end) {
  const parts = [];
  if (start) parts.push(start);
  if (end) parts.push(end);
  return parts.join(' – ');
}

/**
 * Parse bullet points from text (handles •, -, *, and newlines)
 */
function parseBullets(text) {
  if (!text) return [];
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^[•\-\*]\s*/, ''));
}

/**
 * Generate a unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounce function calls
 */
function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Deep clone an object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Download data as a file
 */
function downloadFile(data, filename, type = 'application/json') {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Read a file as text
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Read a file as data URL
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Format phone number (basic formatting)
 */
function formatPhone(phone) {
  if (!phone) return '';
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  // Basic formatting for Indian and US numbers
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  if (cleaned.length > 10) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{5})/, '+$1 $2 $3');
  }
  return phone;
}

/**
 * Truncate text with ellipsis
 */
function truncate(str, maxLength = 50) {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

/**
 * Get initials from name
 */
function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Calculate years of experience from work history
 */
function calculateYearsExperience(workItems) {
  if (!workItems || workItems.length === 0) return 0;
  
  let totalMonths = 0;
  workItems.forEach(job => {
    const start = parseDate(job.startDate);
    const end = job.endDate && job.endDate.toLowerCase() !== 'present' 
      ? parseDate(job.endDate) 
      : new Date();
    
    if (start && end) {
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                     (end.getMonth() - start.getMonth());
      totalMonths += Math.max(0, months);
    }
  });
  
  return Math.round(totalMonths / 12);
}

/**
 * Parse a date string (handles various formats)
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  // Try parsing as year
  if (/^\d{4}$/.test(dateStr)) {
    return new Date(parseInt(dateStr), 0, 1);
  }
  
  // Try parsing as month year
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const monthYearMatch = dateStr.toLowerCase().match(/^([a-z]{3})\s*(\d{4})$/);
  if (monthYearMatch) {
    const monthIndex = months.indexOf(monthYearMatch[1]);
    if (monthIndex !== -1) {
      return new Date(parseInt(monthYearMatch[2]), monthIndex, 1);
    }
  }
  
  // Fallback to native parsing
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Get relative time string
 */
function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
}
