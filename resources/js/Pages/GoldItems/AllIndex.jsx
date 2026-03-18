import React, { useState, useRef, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import ExportToolbar from "../../Components/Export.jsx";

export default function Index({ items, filters, companies, karats }) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedItems, setSelectedItems] = useState(null);
    const [photoVisible, setPhotoVisible] = useState(false); // Add this
    const [selectedPhoto, setSelectedPhoto] = useState(null); // Add this
    const [selectedPhotoAlt, setSelectedPhotoAlt] = useState(""); // Add this
    const toast = useRef(null);
    const dt = useRef(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    route("all-items.index"),
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

    // Template for status
    const statusBodyTemplate = (rowData) => {
        const isSold = rowData.sale !== null;
        return isSold ? (
            <Tag value="Sold" severity="danger" icon="pi pi-check-circle" />
        ) : (
            <Tag value="In Stock" severity="success" icon="pi pi-box" />
        );
    };

    // Template for sold to customer
    const soldToBodyTemplate = (rowData) => {
        if (rowData.sale?.customer) {
            return (
                <div>
                    <div className="font-medium">
                        {rowData.sale.customer.name}
                    </div>
                    {rowData.sale.customer.contact && (
                        <div className="text-xs text-gray-500">
                            {rowData.sale.customer.contact}
                        </div>
                    )}
                </div>
            );
        }
        return <span className="text-gray-400">—</span>;
    };

    // Template for sale date
    const saleDateBodyTemplate = (rowData) => {
        return rowData.sale?.sale_date ? (
            new Date(rowData.sale.sale_date).toLocaleDateString()
        ) : (
            <span className="text-gray-400">—</span>
        );
    };

    // Template for source type badge
    const sourceBodyTemplate = (rowData) => {
        return rowData.source_type === "company" ? (
            <Tag value="Company" severity="info" />
        ) : (
            <Tag value="Individual" severity="warning" />
        );
    };

    // Template for source name
    const sourceNameBodyTemplate = (rowData) => {
        if (rowData.source_type === "company") {
            return rowData.company?.name || "N/A";
        }
        return rowData.individual_name || "N/A";
    };

    // Template for karat
    const karatBodyTemplate = (rowData) => {
        return rowData.karat?.name || "N/A";
    };

    // Template for weight
    const weightBodyTemplate = (rowData) => {
        return `${parseFloat(rowData.weight).toFixed(2)} g`;
    };

    // Template for price
    const priceBodyTemplate = (rowData) => {
        if (rowData.source_type === "individual" && rowData.unit_price) {
            return formatCurrency(rowData.unit_price);
        }
        return <span className="text-gray-400">—</span>;
    };

    // Template for fee
    const feeBodyTemplate = (rowData) => {
        if (rowData.source_type === "company" && rowData.fee) {
            return formatCurrency(rowData.fee);
        }
        return <span className="text-gray-400">—</span>;
    };

    // Template for photo
    const photoBodyTemplate = (rowData) => {
        const photoUrl = rowData.photo ? `/storage/${rowData.photo}` : null;

        const handlePhotoClick = () => {
            if (photoUrl) {
                setSelectedPhoto(photoUrl);
                setSelectedPhotoAlt(`Gold Item ${rowData.barcode}`);
                setPhotoVisible(true);
            }
        };

        return photoUrl ? (
            <img
                src={photoUrl}
                alt={`Item ${rowData.barcode}`}
                style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    cursor: "pointer",
                }}
                className="border-round hover:shadow-4 transition-all"
                onClick={handlePhotoClick}
            />
        ) : (
            <div
                className="w-3rem h-3rem bg-gray-200 border-round flex align-items-center justify-content-center"
                style={{ cursor: "default" }}
            >
                <i className="pi pi-image text-gray-500"></i>
            </div>
        );
    };

    // Template for actions column
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-eye"
                    rounded
                    severity="info"
                    onClick={() =>
                        router.get(route("all-items.show", rowData.id))
                    }
                    tooltip="View Details"
                    tooltipOptions={{ position: "top" }}
                />
                <Button
                    icon="pi pi-print"
                    rounded
                    severity="success"
                    onClick={() =>
                        window.open(
                            route("gold-items.print", rowData.id),
                            "_blank",
                        )
                    }
                    tooltip="Print Barcode"
                    tooltipOptions={{ position: "top" }}
                />
            </div>
        );
    };

    // Left toolbar content with Export
    const leftToolbarTemplate = () => {
        const exportColumns = [
            { header: "ID", field: "id" },
            { header: "Status", field: "status" },
            // { header: "Barcode", field: "barcode" },
            { header: "Source Type", field: "source_type" },
            { header: "Source Name", field: "source_name" },
            { header: "Karat", field: "karat" },
            { header: "Weight", field: "weight" },
            { header: "Price/Fee", field: "price_fee" },
            { header: "Purchase Date", field: "purchase_date" },
            { header: "Sold To", field: "sold_to" },
            { header: "Sale Date", field: "sale_date" },
        ];

        const exportData = items.data.map((item) => ({
            id: item.id,
            status: item.sale ? "Sold" : "In Stock",
            barcode: item.barcode,
            source_type: item.source_type,
            source_name:
                item.source_type === "company"
                    ? item.company?.name
                    : item.individual_name,
            karat: item.karat?.name || "N/A",
            weight: parseFloat(item.weight).toFixed(2) + "g",
            price_fee:
                item.source_type === "individual"
                    ? item.unit_price
                        ? formatCurrency(item.unit_price)
                        : "N/A"
                    : item.fee
                      ? formatCurrency(item.fee)
                      : "N/A",
            purchase_date: new Date(item.purchase_date).toLocaleDateString(),
            sold_to: item.sale?.customer?.name || "Not Sold",
            sale_date: item.sale?.sale_date
                ? new Date(item.sale.sale_date).toLocaleDateString()
                : "—",
        }));

        const summaryData = [
            {
                label: "Total Items",
                value: items.total,
                subtext: "All items",
            },
            {
                label: "In Stock",
                value: items.data.filter((i) => !i.sale).length,
                subtext: "Available",
            },
            {
                label: "Sold",
                value: items.data.filter((i) => i.sale).length,
                subtext: "This page",
            },
        ];

        return (
            <ExportToolbar
                data={exportData}
                filename="all-items-list"
                title="All Items Report"
                currentUser={null}
                totalRecords={items.total}
                lastPage={items.last_page}
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
                        placeholder="Search by barcode or name"
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
            <Head title="All Items" />

            <Toast ref={toast} />

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
                                All Items (In Stock & Sold)
                            </div>
                            <div className="flex align-items-center gap-3">
                                <div className="text-sm text-500">
                                    Total: {items.total} items
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
                            value={items.data}
                            paginator
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
                            rows={items.per_page}
                            totalRecords={items.total}
                            first={items.from - 1}
                            lazy
                            onPage={(e) => {
                                const newPage = e.page + 1;
                                if (newPage !== items.current_page) {
                                    router.get(
                                        route("all-items.index"),
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
                            selection={selectedItems}
                            onSelectionChange={(e) => setSelectedItems(e.value)}
                            tableStyle={{ minWidth: "80rem" }}
                            stripedRows
                            showGridlines
                            className="p-datatable-sm"
                            loading={false}
                            emptyMessage="No items found"
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
                                header="Status"
                                body={statusBodyTemplate}
                                style={{ width: "8%" }}
                            />
                            <Column
                                header="Photo"
                                body={photoBodyTemplate}
                                style={{ width: "8%" }}
                            />
                            {/* <Column
                                field="barcode"
                                header="Barcode"
                                sortable
                                style={{ width: "10%" }}
                            /> */}
                            <Column
                                header="Source"
                                body={sourceBodyTemplate}
                                style={{ width: "8%" }}
                            />
                            <Column
                                header="Source Name"
                                body={sourceNameBodyTemplate}
                                style={{ width: "12%" }}
                            />
                            <Column
                                header="Karat"
                                body={karatBodyTemplate}
                                sortable
                                style={{ width: "6%" }}
                            />
                            <Column
                                header="Weight"
                                body={weightBodyTemplate}
                                sortable
                                style={{ width: "6%" }}
                            />
                            <Column
                                header="Price/Fee"
                                body={priceBodyTemplate}
                                style={{ width: "8%" }}
                            />
                            <Column
                                header="Sold To"
                                body={soldToBodyTemplate}
                                style={{ width: "12%" }}
                            />
                            <Column
                                header="Sale Date"
                                body={saleDateBodyTemplate}
                                style={{ width: "8%" }}
                            />
                            <Column
                                header="Actions"
                                body={actionBodyTemplate}
                                style={{ width: "8%" }}
                            />
                        </DataTable>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
