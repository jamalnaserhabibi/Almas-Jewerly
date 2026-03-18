import React, { useState, useRef, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import ExportToolbar from "../../Components/Export.jsx";

export default function Index({ sales, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [photoVisible, setPhotoVisible] = useState(false); // Add this
    const [selectedPhoto, setSelectedPhoto] = useState(null); // Add this
    const [selectedPhotoAlt, setSelectedPhotoAlt] = useState(""); // Add this
    const [selectedSales, setSelectedSales] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    route("sales.index"),
                    {
                        search: search,
                        page: 1,
                    },
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true,
                    },
                );
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "AFN",
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Handle delete
    const confirmDelete = (sale) => {
        confirmDialog({
            message: `Are you sure you want to delete sale #${sale.id}?`,
            header: "Delete Confirmation",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: () => {
                router.delete(route("sales.destroy", sale.id), {
                    onSuccess: () => {
                        toast.current.show({
                            severity: "success",
                            summary: "Success",
                            detail: "Sale deleted successfully",
                            life: 3000,
                        });
                    },
                    onError: (errors) => {
                        toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail: errors.error || "Failed to delete sale",
                            life: 3000,
                        });
                    },
                });
            },
        });
    };

    // Template for karat
    const karatBodyTemplate = (rowData) => {
        return rowData.gold_item?.karat?.name || "N/A";
    };

    // Template for weight
    const weightBodyTemplate = (rowData) => {
        return rowData.gold_item
            ? `${parseFloat(rowData.gold_item.weight).toFixed(2)}g`
            : "N/A";
    };

    // Template for unit price
    const unitPriceBodyTemplate = (rowData) => {
        return rowData.unit_price ? formatCurrency(rowData.unit_price) : "N/A";
    };

    // Template for total
    const totalBodyTemplate = (rowData) => {
        if (!rowData.gold_item) return "N/A";
        const total = rowData.gold_item.weight * rowData.unit_price;
        return (
            <span className="font-bold text-primary">
                {formatCurrency(total)}
            </span>
        );
    };

    // Template for sale date
    const saleDateBodyTemplate = (rowData) => {
        return new Date(rowData.sale_date).toLocaleDateString();
    };

    // Template for customer name
    const customerNameBodyTemplate = (rowData) => {
        return rowData.customer?.name || "N/A";
    };

    // Template for company/source
    const sourceBodyTemplate = (rowData) => {
        const item = rowData.gold_item;
        if (!item) return "N/A";

        if (item.source_type === "company") {
            return (
                <Tag value={item.company?.name || "Company"} severity="info" />
            );
        } else {
            return (
                <Tag
                    value={item.individual_name || "Individual"}
                    severity="warning"
                />
            );
        }
    };

    // Template for photo
    // Template for photo
    const photoBodyTemplate = (rowData) => {
        const photoUrl = rowData.gold_item?.photo
            ? `/storage/${rowData.gold_item.photo}`
            : null;

        // Add click handler
        const handlePhotoClick = () => {
            if (photoUrl) {
                setSelectedPhoto(photoUrl);
                setSelectedPhotoAlt(
                    `Gold Item ${rowData.gold_item?.barcode || ""}`,
                );
                setPhotoVisible(true);
            }
        };

        return photoUrl ? (
            <img
                src={photoUrl}
                alt="Item"
                style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    cursor: "pointer", // Add pointer cursor
                }}
                className="border-round hover:shadow-4 transition-all"
                onClick={handlePhotoClick} // Add click handler
            />
        ) : (
            <div className="w-3rem h-3rem bg-gray-200 border-round flex align-items-center justify-content-center">
                <i className="pi pi-image text-gray-500"></i>
            </div>
        );
    };

    // Template for actions column - FIXED: Added delete button
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-eye"
                    rounded
                    severity="info"
                    onClick={() => router.get(route("sales.show", rowData.id))}
                    tooltip="View Sale Details"
                    tooltipOptions={{ position: "top" }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    severity="danger"
                    onClick={() => confirmDelete(rowData)}
                    tooltip="Delete Sale"
                    tooltipOptions={{ position: "top" }}
                />
            </div>
        );
    };

    // Left toolbar content with Export
    const leftToolbarTemplate = () => {
        const exportColumns = [
            { header: "ID", field: "id" },
            { header: "Sale Date", field: "sale_date", type: "date" },
            { header: "Customer Name", field: "customer_name" },
            { header: "Karat", field: "karat" },
            { header: "Unit Price", field: "unit_price" },
            { header: "Weight", field: "weight" },
            { header: "Total", field: "total" },
            { header: "Source", field: "source" },
        ];

        const exportData = sales.data.map((sale) => ({
            id: sale.id,
            sale_date: new Date(sale.sale_date).toLocaleDateString(),
            customer_name: sale.customer?.name || "N/A",
            karat: sale.gold_item?.karat?.name || "N/A",
            unit_price: sale.unit_price
                ? formatCurrency(sale.unit_price)
                : "N/A",
            weight: sale.gold_item
                ? parseFloat(sale.gold_item.weight).toFixed(2) + "g"
                : "N/A",
            total: sale.gold_item
                ? formatCurrency(sale.gold_item.weight * sale.unit_price)
                : "N/A",
            source:
                sale.gold_item?.source_type === "company"
                    ? sale.gold_item?.company?.name || "Company"
                    : sale.gold_item?.individual_name || "Individual",
        }));

        const summaryData = [
            {
                label: "Total Sales",
                value: sales.total,
                subtext: "All transactions",
            },
            {
                label: "Total Revenue",
                value: formatCurrency(
                    sales.data.reduce(
                        (sum, sale) =>
                            sum +
                            (sale.gold_item?.weight * sale.unit_price || 0),
                        0,
                    ),
                ),
                subtext: "This page",
            },
        ];

        return (
            <ExportToolbar
                data={exportData}
                filename="sales-list"
                title="Sales Report"
                currentUser={null}
                totalRecords={sales.total}
                lastPage={sales.last_page}
                columns={exportColumns}
                summaryData={summaryData}
                showNewButton={false}
            />
        );
    };

    // Right toolbar content (search)
    const rightToolbarTemplate = () => {
        return (
            <div className="flex gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by customer or barcode"
                        className="p-inputtext-sm"
                        autoComplete="off"
                    />
                </span>
                {search && (
                    <Button
                        icon="pi pi-times"
                        rounded
                        text
                        severity="secondary"
                        onClick={() => setSearch("")}
                        tooltip="Clear search"
                        tooltipOptions={{ position: "top" }}
                    />
                )}
            </div>
        );
    };

    return (
        <Layout>
            <Head title="Sales History" />

            <Toast ref={toast} />
            <ConfirmDialog />
            <Dialog
                header={selectedPhotoAlt}
                visible={photoVisible}
                style={{ width: "50vw" }}
                onHide={() => setPhotoVisible(false)}
                modal
            >
                {selectedPhoto && (
                    <div className="flex justify-content-center">
                        <img
                            src={selectedPhoto}
                            alt={selectedPhotoAlt}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "70vh",
                                objectFit: "contain",
                            }}
                            className="border-round"
                        />
                    </div>
                )}
            </Dialog>
            <div className="grid">
                <div className="col-12">
                    <Card>
                        <div className="flex justify-content-between align-items-center mb-4">
                            <div className="text-900 font-bold text-xl">
                                Sales History
                            </div>
                            <div className="flex align-items-center gap-3">
                                <div className="text-sm text-500">
                                    Total: {sales.total} sales
                                </div>
                            </div>
                        </div>

                        <Toolbar
                            className="mb-4"
                            left={leftToolbarTemplate}
                            right={rightToolbarTemplate}
                        />

                        <DataTable
                            ref={dt}
                            value={sales.data}
                            paginator
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sales"
                            rows={sales.per_page}
                            totalRecords={sales.total}
                            first={sales.from - 1}
                            lazy
                            onPage={(e) => {
                                const newPage = e.page + 1;
                                if (newPage !== sales.current_page) {
                                    router.get(
                                        route("sales.index"),
                                        {
                                            page: newPage,
                                            search: search,
                                        },
                                        {
                                            preserveState: true,
                                            replace: true,
                                        },
                                    );
                                }
                            }}
                            selection={selectedSales}
                            onSelectionChange={(e) => setSelectedSales(e.value)}
                            tableStyle={{ minWidth: "70rem" }}
                            stripedRows
                            showGridlines
                            className="p-datatable-sm"
                            loading={false}
                            emptyMessage="No sales found"
                        >
                            <Column
                                selectionMode="multiple"
                                headerStyle={{ width: "3rem" }}
                            />
                            <Column
                                field="id"
                                header="ID"
                                sortable
                                style={{ width: "5%" }}
                            />
                            <Column
                                header="Photo"
                                body={photoBodyTemplate}
                                style={{ width: "8%" }}
                            />
                            <Column
                                header="Karat"
                                body={karatBodyTemplate}
                                sortable
                                style={{ width: "8%" }}
                            />
                            <Column
                                header="Unit Price"
                                body={unitPriceBodyTemplate}
                                sortable
                                style={{ width: "10%" }}
                            />
                            <Column
                                header="Weight"
                                body={weightBodyTemplate}
                                sortable
                                style={{ width: "8%" }}
                            />
                            <Column
                                header="Total"
                                body={totalBodyTemplate}
                                style={{ width: "10%" }}
                            />
                            <Column
                                header="Sale Date"
                                body={saleDateBodyTemplate}
                                sortable
                                field="sale_date"
                                style={{ width: "10%" }}
                            />
                            <Column
                                header="Customer"
                                body={customerNameBodyTemplate}
                                sortable
                                style={{ width: "12%" }}
                            />
                            <Column
                                header="Company/Source"
                                body={sourceBodyTemplate}
                                style={{ width: "12%" }}
                            />
                            <Column
                                header="Actions"
                                body={actionBodyTemplate}
                                style={{ width: "10%" }}
                            />
                        </DataTable>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
