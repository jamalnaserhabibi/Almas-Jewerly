import React, { useState, useRef, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog"; // Add this import
import GoldItemModal from "./GoldItemModal.jsx";
import ExportToolbar from "../../Components/Export.jsx";

export default function Index({ items, filters, companies, karats }) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedItems, setSelectedItems] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [photoVisible, setPhotoVisible] = useState(false); // Add this
    const [selectedPhoto, setSelectedPhoto] = useState(null); // Add this
    const [selectedPhotoAlt, setSelectedPhotoAlt] = useState(""); // Add this
    const toast = useRef(null);
    const dt = useRef(null);

    // Get current logged in user
    const { auth } = usePage().props;
    const currentUser = auth.user;

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    route("gold-items.index"),
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

    // Handle delete
    const confirmDelete = (item) => {
        confirmDialog({
            message: `Are you sure you want to delete item ${item.barcode}?`,
            header: "Delete Confirmation",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: () => {
                router.delete(route("gold-items.destroy", item.id), {
                    onSuccess: () => {
                        toast.current.show({
                            severity: "success",
                            summary: "Success",
                            detail: "Item deleted successfully",
                            life: 3000,
                        });
                    },
                    onError: (errors) => {
                        toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail: errors.error || "Failed to delete item",
                            life: 3000,
                        });
                    },
                });
            },
        });
    };

    // Open create modal
    const openCreateModal = () => {
        setSelectedItem(null);
        setModalVisible(true);
    };

    // Open edit modal
    const openEditModal = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    // Handle modal success
    const handleModalSuccess = () => {
        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: selectedItem
                ? "Item updated successfully"
                : "Item created successfully",
            life: 3000,
        });
        router.reload({ only: ["items"] });
    };

    // NEW: Template for photo with preview
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
        return `${parseFloat(rowData.weight).toFixed(2)} G`;
    };

    // Template for price
    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "AFN",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(rowData.unit_price);
    };

    // Template for date
    const dateBodyTemplate = (rowData) => {
        return new Date(rowData.purchase_date).toLocaleDateString();
    };

    // Template for actions column (with print button)
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-print"
                    rounded
                    severity="info"
                    onClick={() =>
                        window.open(
                            route("gold-items.print", rowData.id),
                            "_blank",
                        )
                    }
                    tooltip="Print Barcode"
                    tooltipOptions={{ position: "top" }}
                />
                <Button
                    icon="pi pi-pencil"
                    rounded
                    severity="success"
                    onClick={() => openEditModal(rowData)}
                    tooltip="Edit Item"
                    tooltipOptions={{ position: "top" }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    severity="danger"
                    onClick={() => confirmDelete(rowData)}
                    tooltip="Delete Item"
                    tooltipOptions={{ position: "top" }}
                />
                <Button
                    icon="pi pi-eye"
                    rounded
                    severity="help"
                    onClick={() =>
                        router.get(route("gold-items.show", rowData.id))
                    }
                    tooltip="View Details"
                    tooltipOptions={{ position: "top" }}
                />
            </div>
        );
    };

    // Left toolbar content with ExportToolbar
    const leftToolbarTemplate = () => {
        // Define columns for export - flatten nested data
        const exportColumns = [
            { header: "ID", field: "id" },
            { header: "Source", field: "source_type" },
            { header: "Source Name", field: "source_name" },
            { header: "Barcode", field: "barcode" },
            { header: "Karat", field: "karat_name" },
            { header: "Weight", field: "weight" },
            { header: "Unit Price", field: "unit_price" },
            { header: "Fee", field: "fee" },
            { header: "Purchase Date", field: "purchase_date", type: "date" },
        ];

        // Prepare flattened data for export
        const exportData = items.data.map((item) => ({
            id: item.id,
            source_type:
                item.source_type === "company" ? "Company" : "Individual",
            source_name:
                item.source_type === "company"
                    ? item.company?.name
                    : item.individual_name,
            barcode: item.barcode,
            karat_name: item.karat?.name || "N/A",
            weight: `${parseFloat(item.weight).toFixed(2)}g`,
            unit_price: item.unit_price ? `${item.unit_price} AFN` : "-",
            fee: item.fee ? `${item.fee} AFN` : "-",
            purchase_date: new Date(item.purchase_date).toLocaleDateString(),
        }));

        // Summary data for print
        const summaryData = [
            {
                label: "Total Items",
                value: items.total,
                subtext: "All gold items",
            },
            {
                label: "Company Items",
                value: items.data.filter((i) => i.source_type === "company")
                    .length,
                subtext: "From companies",
            },
            {
                label: "Individual Items",
                value: items.data.filter((i) => i.source_type === "individual")
                    .length,
                subtext: "From individuals",
            },
        ];

        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="New Gold Item"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openCreateModal}
                />
                <ExportToolbar
                    data={exportData}
                    filename="gold-items-list"
                    title="Gold Items Report"
                    currentUser={currentUser}
                    totalRecords={items.total}
                    lastPage={items.last_page}
                    columns={exportColumns}
                    summaryData={summaryData}
                    showNewButton={false}
                />
                <Button
                    label="Scan Barcode"
                    icon="pi pi-qrcode"
                    severity="info"
                    outlined
                    onClick={() => router.get(route("gold-items.scan"))}
                />
            </div>
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
            <Head title="Gold Items Management" />

            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Photo Preview Dialog */}
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

            <GoldItemModal
                visible={modalVisible}
                onHide={() => setModalVisible(false)}
                item={selectedItem}
                onSuccess={handleModalSuccess}
                companies={companies}
                karats={karats}
            />

            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="flex justify-content-between align-items-center mb-4">
                            <div className="text-900 font-bold text-xl">
                                Jewelry Management
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
                                        route("gold-items.index"),
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
                            tableStyle={{ minWidth: "70rem" }}
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
                                header="Photo"
                                body={photoBodyTemplate}
                                style={{ width: "8%" }}
                            />
                            <Column
                                header="Source"
                                body={sourceBodyTemplate}
                                style={{ width: "8%" }}
                            />
                            <Column
                                header="Source Name"
                                body={sourceNameBodyTemplate}
                                style={{ width: "15%" }}
                            />
                            <Column
                                header="Karat"
                                body={karatBodyTemplate}
                                sortable
                                style={{ width: "8%" }}
                            />
                            <Column
                                header="Weight"
                                body={weightBodyTemplate}
                                sortable
                                style={{ width: "8%" }}
                            />
                            <Column
                                header="Unit Price"
                                body={priceBodyTemplate}
                                sortable
                                style={{ width: "10%" }}
                            />
                            <Column
                                field="purchase_date"
                                body={dateBodyTemplate}
                                header="Date"
                                sortable
                                style={{ width: "10%" }}
                            />
                            <Column
                                header="Actions"
                                body={actionBodyTemplate}
                                style={{ width: "20%" }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
