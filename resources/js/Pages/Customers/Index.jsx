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
import CustomerModal from "./CustomerModal.jsx";
import ExportToolbar from "../../Components/Export.jsx";

export default function Index({ customers, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    route("customers.index"),
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
    const confirmDelete = (customer) => {
        confirmDialog({
            message: `Are you sure you want to delete ${customer.name}?`,
            header: "Delete Confirmation",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: () => {
                router.delete(route("customers.destroy", customer.id), {
                    onSuccess: () => {
                        toast.current.show({
                            severity: "success",
                            summary: "Success",
                            detail: "Customer deleted successfully",
                            life: 3000,
                        });
                    },
                    onError: (errors) => {
                        toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail: errors.error || "Failed to delete customer",
                            life: 3000,
                        });
                    },
                });
            },
        });
    };

    // Open create modal
    const openCreateModal = () => {
        setSelectedCustomer(null);
        setModalVisible(true);
    };

    // Open edit modal
    const openEditModal = (customer) => {
        setSelectedCustomer(customer);
        setModalVisible(true);
    };

    // Handle modal success
    const handleModalSuccess = () => {
        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: selectedCustomer
                ? "Customer updated successfully"
                : "Customer created successfully",
            life: 3000,
        });
        router.reload({ only: ["customers"] });
    };

    // Template for actions column
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    rounded
                    severity="info"
                    onClick={() => openEditModal(rowData)}
                    tooltip="Edit Customer"
                    tooltipOptions={{ position: "top" }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    severity="danger"
                    onClick={() => confirmDelete(rowData)}
                    tooltip="Delete Customer"
                    tooltipOptions={{ position: "top" }}
                />
            </div>
        );
    };

    // Template for date
    const dateBodyTemplate = (rowData) => {
        return new Date(rowData.created_at).toLocaleDateString();
    };

    // Left toolbar content - Using ExportToolbar component
    const leftToolbarTemplate = () => {
        // Define columns for export
        const exportColumns = [
            { header: "ID", field: "id" },
            { header: "Name", field: "name" },
            { header: "Contact", field: "contact" },
            { header: "Address", field: "address" },
            { header: "Info", field: "info" },
            { header: "Created Date", field: "created_at", type: "date" },
        ];

        // Summary data for print
        const summaryData = [
            {
                label: "Total Customers",
                value: customers.total,
                subtext: "Registered customers",
            },
            {
                label: "This Page",
                value: customers.data.length,
                subtext: "Current view",
            },
        ];

        return (
            <ExportToolbar
                data={customers.data}
                filename="customers-list"
                title="Customers Management Report"
                currentUser={null}
                totalRecords={customers.total}
                lastPage={customers.last_page}
                columns={exportColumns}
                summaryData={summaryData}
                showNewButton={true}
                newButtonLabel="New Customer"
                newButtonIcon="pi pi-user-plus"
                onNewClick={openCreateModal}
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
                        placeholder="Search by name or contact"
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
            <Head title="Customers Management" />

            <Toast ref={toast} />
            <ConfirmDialog />

            <CustomerModal
                visible={modalVisible}
                onHide={() => setModalVisible(false)}
                customer={selectedCustomer}
                onSuccess={handleModalSuccess}
            />

            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="flex justify-content-between align-items-center mb-4">
                            <div className="text-900 font-bold text-xl">
                                Customers Management
                            </div>
                            <div className="flex align-items-center gap-3">
                                <div className="text-sm text-500">
                                    Total: {customers.total} customers
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
                            value={customers.data}
                            paginator
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
                            rows={customers.per_page}
                            totalRecords={customers.total}
                            first={customers.from - 1}
                            lazy
                            onPage={(e) => {
                                const newPage = e.page + 1;
                                if (newPage !== customers.current_page) {
                                    router.get(
                                        route("customers.index"),
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
                            selection={selectedCustomers}
                            onSelectionChange={(e) =>
                                setSelectedCustomers(e.value)
                            }
                            tableStyle={{ minWidth: "60rem" }}
                            stripedRows
                            showGridlines
                            className="p-datatable-sm"
                            loading={false}
                            emptyMessage="No customers found"
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
                                field="name"
                                header="Name"
                                sortable
                                style={{ width: "20%" }}
                            />
                            <Column
                                field="contact"
                                header="Contact"
                                sortable
                                style={{ width: "15%" }}
                            />
                            <Column
                                field="address"
                                header="Address"
                                sortable
                                style={{ width: "25%" }}
                            />
                            <Column
                                field="info"
                                header="Info"
                                sortable
                                style={{ width: "20%" }}
                            />
                            <Column
                                header="Created"
                                body={dateBodyTemplate}
                                sortable
                                style={{ width: "10%" }}
                            />
                            <Column
                                header="Actions"
                                body={actionBodyTemplate}
                                style={{ width: "10%" }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
