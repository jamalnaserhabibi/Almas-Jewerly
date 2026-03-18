import React from "react";
import { exportToCSV, printTable } from "./exportLayout.jsx";
import { Button } from "primereact/button";

const ExportToolbar = ({
    data,
    filename,
    title,
    currentUser,
    totalRecords,
    lastPage,
    columns,
    summaryData = null,
    onNewClick = null,
    newButtonLabel = null,
    newButtonIcon = "pi pi-plus",
    showNewButton = false,
}) => {
    const handleExportCSV = () => {
        const headers = columns.map((col) => col.header);
        const fields = columns.map((col) => col.field);
        exportToCSV(data, filename, headers, fields);
    };

    const handlePrint = () => {
        printTable({
            title,
            data,
            currentUser,
            totalRecords,
            lastPage,
            columns,
            summaryData,
        });
    };

    return (
        <div className="flex flex-wrap gap-2">
            {showNewButton && onNewClick && (
                <Button
                    label={newButtonLabel}
                    icon={newButtonIcon}
                    severity="success"
                    onClick={onNewClick}
                />
            )}
            <Button
                label="CSV"
                icon="pi pi-file"
                severity="info"
                outlined
                onClick={handleExportCSV}
            />
            <Button
                label="Print"
                icon="pi pi-print"
                severity="info"
                outlined
                onClick={handlePrint}
            />
        </div>
    );
};

export default ExportToolbar;
