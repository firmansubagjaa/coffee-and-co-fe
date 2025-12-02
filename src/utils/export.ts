
export type ExportFormat = 'csv' | 'json';

/**
 * Converts an array of objects to a CSV string.
 * Handles commas and quotes within data.
 */
const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const headerRow = headers.join(',');

  const rows = data.map(row => {
    return headers.map(fieldName => {
      const value = row[fieldName] || '';
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      
      // Escape quotes and wrap in quotes if contains comma or newline
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  return [headerRow, ...rows].join('\r\n');
};

/**
 * Triggers a browser download for the given data and format.
 */
export const exportData = (data: any[], filenamePrefix: string, format: ExportFormat) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${filenamePrefix}_${timestamp}.${format}`;
  
  let content = '';
  let mimeType = '';

  if (format === 'csv') {
    content = convertToCSV(data);
    mimeType = 'text/csv;charset=utf-8;';
  } else {
    content = JSON.stringify(data, null, 2);
    mimeType = 'application/json;charset=utf-8;';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
