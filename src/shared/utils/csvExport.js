
/**
 * Utility to export JSON data to CSV and trigger download
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the file to download
 */
export const exportToCSV = (data, fileName = 'report.csv') => {
  if (!data || !data.length) {
    console.error('No data available for export');
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);

  // Create CSV rows
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      // Escape quotes and wrap in quotes if contains comma
      const escaped = ('' + val).replace(/"/g, '""');
      return escaped.includes(',') ? `"${escaped}"` : escaped;
    });
    csvRows.push(values.join(','));
  }

  // Create Blob
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  // Trigger download
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default exportToCSV;
