export const exportToCSV = (
    data,
    filename = "export",
    headers = null,
    fields = null,
) => {
    // If headers and fields not provided, use object keys
    const actualHeaders =
        headers || (data.length > 0 ? Object.keys(data[0]) : []);
    const actualFields = fields || actualHeaders;

    // Prepare CSV data
    const csvData = data.map((item) =>
        actualFields.map((field) => {
            const value = item[field];
            // Handle special cases
            if (value instanceof Date) {
                return value.toLocaleDateString();
            }
            if (typeof value === "object" && value !== null) {
                return JSON.stringify(value);
            }
            return value;
        }),
    );

    let csvContent = actualHeaders.join(",") + "\n";
    csvData.forEach((row) => {
        csvContent += row.join(",") + "\n";
    });

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
};

/**
 * Print table with professional layout
 */
export const printTable = (config) => {
    const {
        title,
        data,
        currentUser,
        totalRecords,
        lastPage,
        companyName = "Almas Jewelry",
        columns,
        summaryData = null,
    } = config;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Get current date and time
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    // Generate table headers and rows
    const tableHeaders = columns
        .map((col) => `<th>${col.header}</th>`)
        .join("");
    const tableRows = data
        .map((item) => {
            const rowCells = columns
                .map((col) => {
                    let value = item[col.field];

                    // Handle special field types
                    if (col.type === "date" && value) {
                        value = new Date(value).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        });
                    }

                    if (col.type === "badge") {
                        const isVerified = value;
                        return `<td><span class="badge ${isVerified ? "badge-success" : "badge-warning"}">${isVerified ? "Verified" : "Pending"}</span></td>`;
                    }

                    if (
                        col.field === "name" &&
                        currentUser &&
                        item.id === currentUser.id
                    ) {
                        return `
                    <td>
                        ${value}
                        <span class="you-indicator">YOU</span>
                    </td>
                `;
                    }

                    return `<td>${value || ""}</td>`;
                })
                .join("");

            return `<tr>${rowCells}</tr>`;
        })
        .join("");

    // Create HTML content with fixed print styles
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>${title} - ${companyName}</title>
        <style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #fff;
        padding: 15px;
        color: #333;
        line-height: 1.4;
        font-size: 12px;
    }
    
    .report-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .report-header {
        text-align: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid #00002D;
    }
    
    .report-title {
        font-size: 20px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 5px;
        text-transform: uppercase;
    }
    
    .company-name {
        font-size: 16px;
        color: #00002D;
        margin-bottom: 10px;
        font-weight: 500;
    }
    
    .report-meta {
        display: flex;
        justify-content: space-between;
        background: #f8f9fa;
        padding: 8px 12px;
        border-radius: 5px;
        font-size: 11px;
        color: #666;
        margin-top: 10px;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .summary-cards {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }
    
    .summary-card {
        flex: 1;
        min-width: 150px;
        background: linear-gradient(135deg, #667eea 0%, #16002c 100%);
        color: white;
        padding: 12px;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .summary-card:nth-child(2) {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .summary-card:nth-child(3) {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    .summary-label {
        font-size: 11px;
        opacity: 0.9;
        margin-bottom: 5px;
        text-transform: uppercase;
    }
    
    .summary-value {
        font-size: 22px;
        font-weight: bold;
        line-height: 1.2;
    }
    
    .summary-sub {
        font-size: 10px;
        opacity: 0.8;
        margin-top: 3px;
    }
    
    .table-container {
        margin-top: 20px;
        overflow-x: auto;
        width: 100%;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border: 1px solid #dee2e6;
        table-layout: auto;
        font-size: 11px;
    }
    
    th {
        background: #34495e;
        color: white;
        font-weight: 600;
        padding: 8px 6px;
        text-align: left;
        font-size: 11px;
        text-transform: uppercase;
        white-space: nowrap;
    }
    
    td {
        padding: 6px;
        border-bottom: 1px solid #e9ecef;
        font-size: 11px;
        word-break: break-word;
    }
    
    tr:nth-child(even) {
        background-color: #f8f9fa;
    }
    
    .badge {
        display: inline-block;
        padding: 3px 6px;
        border-radius: 3px;
        font-size: 9px;
        font-weight: 600;
        text-transform: uppercase;
        white-space: nowrap;
    }
    
    .badge-success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .badge-warning {
        background: #fff3cd;
        color: #856404;
        border: 1px solid #ffeeba;
    }
    
    .you-indicator {
        background: #4CAF50;
        color: white;
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 8px;
        margin-left: 3px;
        display: inline-block;
    }
    
    .report-footer {
        margin-top: 25px;
        padding-top: 12px;
        border-top: 1px dashed #dee2e6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 10px;
        color: #6c757d;
    }
    
    .signature-area {
        display: flex;
        gap: 30px;
        margin-top: 20px;
        justify-content: flex-end;
    }
    
    .signature {
        text-align: center;
        font-size: 10px;
    }
    
    .signature div:first-child {
        width: 120px;
        border-top: 1px solid #333;
        margin-top: 5px;
        padding-top: 5px;
    }
    
    .watermark {
        position: fixed;
        bottom: 320px;
        right: 180px;
        opacity: 0.05;
        font-size: 70px;
        transform: rotate(-15deg);
        pointer-events: none;
        z-index: 11000;
        color: #00002d;
    }
    
    @media print {
        /* Force color printing */
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        
        @page {
            size: landscape;
            margin: 0.5in;
        }
        
        body {
            padding: 0;
            font-size: 10pt;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .report-container {
            max-width: 100%;
        }
        
        table {
            font-size: 9pt;
        }
        
        th {
            background: #34495e !important;
            color: white !important;
            font-size: 9pt;
            padding: 4pt;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        td {
            padding: 4pt;
            font-size: 9pt;
        }
        
        .summary-card {
            break-inside: avoid;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .badge-success {
            background: #d4edda !important;
            color: #155724 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .badge-warning {
            background: #fff3cd !important;
            color: #856404 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .you-indicator {
            background: #4CAF50 !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .watermark {
            opacity: 0.03;
        }
    }
    
    /* Responsive table */
    @media screen and (max-width: 768px) {
        table {
            font-size: 10px;
        }
        
        th, td {
            padding: 4px;
        }
    }
</style>
            </head>
            <body>
                <div class="watermark">${companyName}</div>
                
                <div class="report-container">
                    <!-- Report Header -->
                    <div class="report-header">
                        <div class="report-title">${title}</div>
                        <div class="company-name">${companyName}</div>
                        <div class="report-meta">
                            <span><strong>Generated:</strong> ${currentDate} at ${currentTime}</span>
                            <span><strong>Report ID:</strong> ${title.replace(/\s+/g, "-").toUpperCase()}-${Date.now().toString().slice(-6)}</span>
                            <span><strong>By:</strong> ${currentUser?.name || "System"}</span>
                        </div>
                    </div>
                    
                    ${
                        summaryData
                            ? `
                    <div class="summary-cards">
                        ${summaryData
                            .map(
                                (item) => `
                            <div class="summary-card">
                                <div class="summary-label">${item.label}</div>
                                <div class="summary-value">${item.value}</div>
                                <div class="summary-sub">${item.subtext || ""}</div>
                            </div>
                        `,
                            )
                            .join("")}
                    </div>
                    `
                            : ""
                    }
                    
                    <!-- Data Table -->
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    ${tableHeaders}
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Summary -->
                    <div style="margin-top: 20px; padding: 12px; background: #f8f9fa; border-radius: 5px;">
                        <h3 style="margin-bottom: 8px; font-size: 12px;">Summary</h3>
                        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                            <div><strong>Total Records:</strong> ${totalRecords}</div>
                            <div><strong>Pages:</strong> ${lastPage}</div>
                            <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <!-- Signature -->
                    <div class="signature-area">
                        <div class="signature">
                            <div>Generated By</div>
                        </div>
                        <div class="signature">
                            <div>Authorized Signature</div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="report-footer">
                        <span>© ${new Date().getFullYear()} ${companyName}</span>
                        <span>Page 1 of 1</span>
                    </div>
                </div>
                
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            }
                        }, 500);
                    }
                </script>
            </body>
        </html>
    `);

    printWindow.document.close();
};
