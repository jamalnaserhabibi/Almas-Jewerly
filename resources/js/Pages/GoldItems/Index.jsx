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

export default function Index({
    items,
    filters,
    companies,
    karats,
    jewelryTypes,
}) {
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

    const jewelrytypesBodyTemplate = (rowData) => {
        return rowData.jewelry_type?.name || "N/A";
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
                jewelryTypes={jewelryTypes}
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
                                header="Type"
                                body={jewelrytypesBodyTemplate}
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

// import React, { useState, useRef, useEffect } from "react";
// import { Head, router, usePage } from "@inertiajs/react";
// import Layout from "@/Layouts/layout/layout.jsx";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import { Toast } from "primereact/toast";
// import { Toolbar } from "primereact/toolbar";
// import { Tag } from "primereact/tag";
// import { Dialog } from "primereact/dialog";
// import { Card } from "primereact/card";
// import { Menu } from "primereact/menu";
// import { Galleria } from "primereact/galleria";
// import GoldItemModal from "./GoldItemModal.jsx";
// import ExportToolbar from "../../Components/Export.jsx";
// import { classNames } from "primereact/utils";

// export default function Index({ items, filters, companies, karats }) {
//     const [search, setSearch] = useState(filters.search || "");
//     const [modalVisible, setModalVisible] = useState(false);
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [photoVisible, setPhotoVisible] = useState(false);
//     const [selectedPhoto, setSelectedPhoto] = useState(null);
//     const [selectedPhotoAlt, setSelectedPhotoAlt] = useState("");
//     const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
//     const toast = useRef(null);
//     const menuRef = useRef(null);

//     // Get current logged in user
//     const { auth } = usePage().props;
//     const currentUser = auth.user;

//     // Debounce search
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             if (search !== filters.search) {
//                 router.get(
//                     route("gold-items.index"),
//                     {
//                         search: search,
//                         page: 1,
//                     },
//                     {
//                         preserveState: true,
//                         replace: true,
//                         preserveScroll: true,
//                     },
//                 );
//             }
//         }, 500);

//         return () => clearTimeout(timer);
//     }, [search]);

//     // Handle delete
//     const confirmDelete = (item) => {
//         confirmDialog({
//             message: `Are you sure you want to delete item ${item.barcode}?`,
//             header: "Delete Confirmation",
//             icon: "pi pi-exclamation-triangle",
//             acceptClassName: "p-button-danger",
//             accept: () => {
//                 router.delete(route("gold-items.destroy", item.id), {
//                     onSuccess: () => {
//                         toast.current.show({
//                             severity: "success",
//                             summary: "Success",
//                             detail: "Item deleted successfully",
//                             life: 3000,
//                         });
//                     },
//                     onError: (errors) => {
//                         toast.current.show({
//                             severity: "error",
//                             summary: "Error",
//                             detail: errors.error || "Failed to delete item",
//                             life: 3000,
//                         });
//                     },
//                 });
//             },
//         });
//     };

//     // Open create modal
//     const openCreateModal = () => {
//         setSelectedItem(null);
//         setModalVisible(true);
//     };

//     // Open edit modal
//     const openEditModal = (item) => {
//         setSelectedItem(item);
//         setModalVisible(true);
//     };

//     // Handle modal success
//     const handleModalSuccess = () => {
//         toast.current.show({
//             severity: "success",
//             summary: "Success",
//             detail: selectedItem
//                 ? "Item updated successfully"
//                 : "Item created successfully",
//             life: 3000,
//         });
//         router.reload({ only: ["items"] });
//     };

//     // Handle photo click
//     const handlePhotoClick = (photoUrl, barcode) => {
//         if (photoUrl) {
//             setSelectedPhoto(photoUrl);
//             setSelectedPhotoAlt(`Gold Item ${barcode}`);
//             setPhotoVisible(true);
//         }
//     };

//     // Format currency
//     const formatCurrency = (value) => {
//         return new Intl.NumberFormat("en-US", {
//             style: "currency",
//             currency: "AFN",
//             minimumFractionDigits: 0,
//         }).format(value);
//     };

//     // Get source display
//     const getSourceDisplay = (item) => {
//         if (item.source_type === "company") {
//             return { text: item.company?.name || "Company", severity: "info" };
//         } else {
//             return { text: item.individual_name || "Individual", severity: "warning" };
//         }
//     };

//     // Render action menu for each card
//     const renderActionMenu = (item) => {
//         const menuItems = [
//             {
//                 label: "View Details",
//                 icon: "pi pi-eye",
//                 command: () => router.get(route("gold-items.show", item.id))
//             },
//             {
//                 label: "Print Barcode",
//                 icon: "pi pi-print",
//                 command: () => window.open(route("gold-items.print", item.id), "_blank")
//             },
//             {
//                 label: "Edit Item",
//                 icon: "pi pi-pencil",
//                 command: () => openEditModal(item)
//             },
//             {
//                 separator: true
//             },
//             {
//                 label: "Delete Item",
//                 icon: "pi pi-trash",
//                 className: "text-red-500",
//                 command: () => confirmDelete(item)
//             }
//         ];

//         return (
//             <div className="relative">
//                 <Button
//                     icon="pi pi-ellipsis-v"
//                     rounded
//                     text
//                     severity="secondary"
//                     onClick={(e) => menuRef.current?.toggle(e)}
//                     aria-controls="action_menu"
//                     aria-haspopup
//                 />
//                 <Menu
//                     model={menuItems}
//                     popup
//                     ref={menuRef}
//                     id="action_menu"
//                     popupAlignment="right"
//                 />
//             </div>
//         );
//     };

//     // Render each item as a card
//     const renderItemCard = (item) => {
//         const source = getSourceDisplay(item);
//         const photoUrl = item.photo ? `/storage/${item.photo}` : null;

//         return (
//             <div key={item.id} className="col-12 md:col-6 lg:col-4 xl:col-3">
//                 <Card className="surface-card shadow-2 hover:shadow-6 transition-all transition-duration-300 border-round-xl">
//                     {/* Card Header with Actions */}
//                     <div className="flex justify-content-between align-items-start mb-2">
//                         <Tag
//                             value={item.source_type === "company" ? "Company" : "Individual"}
//                             severity={item.source_type === "company" ? "info" : "warning"}
//                             className="text-xs"
//                         />
//                         {renderActionMenu(item)}
//                     </div>

//                     {/* Photo Section */}
//                     <div
//                         className="flex justify-content-center mb-3 cursor-pointer border-round-lg overflow-hidden"
//                         onClick={() => handlePhotoClick(photoUrl, item.barcode)}
//                         style={{ height: "180px", backgroundColor: "#f8f9fa" }}
//                     >
//                         {photoUrl ? (
//                             <img
//                                 src={photoUrl}
//                                 alt={`Item ${item.barcode}`}
//                                 className="w-full h-full"
//                                 style={{ objectFit: "cover" }}
//                             />
//                         ) : (
//                             <div className="flex align-items-center justify-content-center w-full h-full">
//                                 <i className="pi pi-image text-4xl text-gray-400"></i>
//                             </div>
//                         )}
//                     </div>

//                     {/* Item Details */}
//                     <div className="mb-2">
//                         <div className="text-xs text-gray-500 mb-1">Barcode</div>
//                         <div className="font-mono font-bold text-md mb-3">{item.barcode}</div>

//                         <div className="grid grid-nogutter">
//                             <div className="col-6">
//                                 <div className="text-xs text-gray-500 mb-1">Karat</div>
//                                 <div className="font-medium">{item.karat?.name || "N/A"}</div>
//                             </div>
// <div className="col-6">
//      <div className="text-xs text-gray-500 mb-1">Jewelry Type</div>
//    <div className="font-medium">{item.jewelry_type?.name || "N/A"}</div>
// </div>
//                             <div className="col-6">
//                                 <div className="text-xs text-gray-500 mb-1">Weight</div>
//                                 <div className="font-medium">{parseFloat(item.weight).toFixed(2)}g</div>
//                             </div>
//                         </div>

//                         <div className="mt-2">
//                             <div className="text-xs text-gray-500 mb-1">Source</div>
//                             <div className="font-medium">{source.text}</div>
//                         </div>

//                         {item.source_type === "individual" && item.unit_price && (
//                             <div className="mt-2">
//                                 <div className="text-xs text-gray-500 mb-1">Unit Price</div>
//                                 <div className="font-bold text-primary">{formatCurrency(item.unit_price)}/g</div>
//                             </div>
//                         )}

//                         {item.source_type === "company" && item.fee && (
//                             <div className="mt-2">
//                                 <div className="text-xs text-gray-500 mb-1">Fee</div>
//                                 <div className="font-bold text-primary">{formatCurrency(item.fee)}</div>
//                             </div>
//                         )}

//                         <div className="mt-2">
//                             <div className="text-xs text-gray-500 mb-1">Purchase Date</div>
//                             <div className="text-sm">{new Date(item.purchase_date).toLocaleDateString()}</div>
//                         </div>
//                     </div>

//                     {/* Quick Action Buttons */}
//                     <div className="flex justify-content-between gap-2 mt-3 pt-2 border-top-1 surface-border">
//                         <Button
//                             icon="pi pi-eye"
//                             rounded
//                             text
//                             severity="info"
//                             onClick={() => router.get(route("gold-items.show", item.id))}
//                             tooltip="View Details"
//                             tooltipOptions={{ position: "top" }}
//                             className="flex-1"
//                         />
//                         <Button
//                             icon="pi pi-print"
//                             rounded
//                             text
//                             severity="success"
//                             onClick={() => window.open(route("gold-items.print", item.id), "_blank")}
//                             tooltip="Print Barcode"
//                             tooltipOptions={{ position: "top" }}
//                             className="flex-1"
//                         />
//                         <Button
//                             icon="pi pi-pencil"
//                             rounded
//                             text
//                             severity="warning"
//                             onClick={() => openEditModal(item)}
//                             tooltip="Edit"
//                             tooltipOptions={{ position: "top" }}
//                             className="flex-1"
//                         />
//                     </div>
//                 </Card>
//             </div>
//         );
//     };

//     // Left toolbar content
//     const leftToolbarTemplate = () => {
//         const exportData = items.data.map((item) => ({
//             id: item.id,
//             source_type: item.source_type === "company" ? "Company" : "Individual",
//             source_name: item.source_type === "company" ? item.company?.name : item.individual_name,
//             barcode: item.barcode,
//             karat: item.karat?.name || "N/A",
//             weight: `${parseFloat(item.weight).toFixed(2)}g`,
//             price_fee: item.source_type === "individual"
//                 ? (item.unit_price ? `${item.unit_price} AFN` : "-")
//                 : (item.fee ? `${item.fee} AFN` : "-"),
//             purchase_date: new Date(item.purchase_date).toLocaleDateString(),
//         }));

//         const exportColumns = [
//             { header: "ID", field: "id" },
//             { header: "Source", field: "source_type" },
//             { header: "Source Name", field: "source_name" },
//             { header: "Barcode", field: "barcode" },
//             { header: "Karat", field: "karat" },
//             { header: "Weight", field: "weight" },
//             { header: "Price/Fee", field: "price_fee" },
//             { header: "Purchase Date", field: "purchase_date", type: "date" },
//         ];

//         const summaryData = [
//             { label: "Total Items", value: items.total, subtext: "All items" },
//             { label: "Company Items", value: items.data.filter(i => i.source_type === "company").length, subtext: "From companies" },
//             { label: "Individual Items", value: items.data.filter(i => i.source_type === "individual").length, subtext: "From individuals" },
//         ];

//         return (
//             <div className="flex flex-wrap gap-2">
//                 <Button
//                     label="New Gold Item"
//                     icon="pi pi-plus"
//                     severity="success"
//                     onClick={openCreateModal}
//                 />
//                 <ExportToolbar
//                     data={exportData}
//                     filename="gold-items-list"
//                     title="Gold Items Report"
//                     currentUser={currentUser}
//                     totalRecords={items.total}
//                     lastPage={items.last_page}
//                     columns={exportColumns}
//                     summaryData={summaryData}
//                     showNewButton={false}
//                 />
//                 <Button
//                     label="Scan Barcode"
//                     icon="pi pi-qrcode"
//                     severity="info"
//                     outlined
//                     onClick={() => router.get(route("gold-items.scan"))}
//                 />
//                 <Button
//                     icon={viewMode === "grid" ? "pi pi-list" : "pi pi-th-large"}
//                     rounded
//                     text
//                     severity="secondary"
//                     onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
//                     tooltip={viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"}
//                     tooltipOptions={{ position: "top" }}
//                 />
//             </div>
//         );
//     };

//     // Right toolbar content (search)
//     const rightToolbarTemplate = () => {
//         return (
//             <div className="flex gap-2">
//                 <span className="p-input-icon-left">
//                     <i className="pi pi-search" />
//                     <InputText
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         placeholder="Search by barcode or name"
//                         className="p-inputtext-sm"
//                         autoComplete="off"
//                     />
//                 </span>
//                 {search && (
//                     <Button
//                         icon="pi pi-times"
//                         rounded
//                         text
//                         severity="secondary"
//                         onClick={() => setSearch("")}
//                         tooltip="Clear search"
//                         tooltipOptions={{ position: "top" }}
//                     />
//                 )}
//             </div>
//         );
//     };

//     return (
//         <Layout>
//             <Head title="Gold Items Management" />

//             <Toast ref={toast} />
//             <ConfirmDialog />

//             {/* Photo Preview Dialog */}
//             <Dialog
//                 header={selectedPhotoAlt}
//                 visible={photoVisible}
//                 style={{ width: "50vw" }}
//                 onHide={() => setPhotoVisible(false)}
//                 modal
//             >
//                 {selectedPhoto && (
//                     <div className="flex justify-content-center">
//                         <img
//                             src={selectedPhoto}
//                             alt={selectedPhotoAlt}
//                             style={{
//                                 maxWidth: "100%",
//                                 maxHeight: "70vh",
//                                 objectFit: "contain",
//                             }}
//                             className="border-round"
//                         />
//                     </div>
//                 )}
//             </Dialog>

//             <GoldItemModal
//                 visible={modalVisible}
//                 onHide={() => setModalVisible(false)}
//                 item={selectedItem}
//                 onSuccess={handleModalSuccess}
//                 companies={companies}
//                 karats={karats}
//             />

//             <div className="grid">
//                 <div className="col-12">
//                     <Card className="border-none shadow-2">
//                         <div className="flex justify-content-between align-items-center mb-4">
//                             <div className="text-900 font-bold text-2xl">
//                                 <i className="pi pi-star mr-2 text-yellow-500"></i>
//                                 Jewelry Collection
//                             </div>
//                             <div className="flex align-items-center gap-3">
//                                 <Tag
//                                     value={`${items.total} items`}
//                                     severity="info"
//                                     rounded
//                                     className="text-sm"
//                                 />
//                             </div>
//                         </div>

//                         <Toolbar
//                             className="mb-4 border-none surface-ground"
//                             left={leftToolbarTemplate}
//                             right={rightToolbarTemplate}
//                         />

//                         <div className="grid">
//                             {items.data.map((item) => renderItemCard(item))}
//                         </div>

//                         {/* Pagination */}
//                         {items.last_page > 1 && (
//                             <div className="flex justify-content-center mt-5">
//                                 <Button
//                                     icon="pi pi-chevron-left"
//                                     rounded
//                                     text
//                                     disabled={items.current_page === 1}
//                                     onClick={() => router.get(
//                                         route("gold-items.index"),
//                                         { page: items.current_page - 1, search: search }
//                                     )}
//                                 />
//                                 <span className="mx-3 flex align-items-center">
//                                     Page {items.current_page} of {items.last_page}
//                                 </span>
//                                 <Button
//                                     icon="pi pi-chevron-right"
//                                     rounded
//                                     text
//                                     disabled={items.current_page === items.last_page}
//                                     onClick={() => router.get(
//                                         route("gold-items.index"),
//                                         { page: items.current_page + 1, search: search }
//                                     )}
//                                 />
//                             </div>
//                         )}
//                     </Card>
//                 </div>
//             </div>
//         </Layout>
//     );
// }
