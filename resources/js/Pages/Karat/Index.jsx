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
import ExportToolbar from "../../Components/Export.jsx";
import CompanyModal from "./CompaniesModal.jsx.jsx";

export default function Index({ companies, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedCompanies, setSelectedCompanies] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
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
                    route("companies.index"),
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
    const confirmDelete = (company) => {
        confirmDialog({
            message: `Are you sure you want to delete ${company.name}?`,
            header: "Delete Confirmation",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: () => {
                router.delete(route("companies.destroy", company.id), {
                    onSuccess: () => {
                        toast.current.show({
                            severity: "success",
                            summary: "Success",
                            detail: "Company deleted successfully",
                            life: 3000,
                        });
                    },
                    onError: (errors) => {
                        toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail: errors.error || "Failed to delete company",
                            life: 3000,
                        });
                    },
                });
            },
        });
    };

    // Open create modal
    const openCreateModal = () => {
        setSelectedCompany(null);
        setModalVisible(true);
    };

    // Open edit modal
    const openEditModal = (company) => {
        setSelectedCompany(company);
        setModalVisible(true);
    };

    // Handle modal success
    const handleModalSuccess = () => {
        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: selectedCompany
                ? "Company updated successfully"
                : "Company created successfully",
            life: 3000,
        });
        router.reload({ only: ["companies"] });
    };

    // Template for actions column (Edit & Delete)
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    rounded
                    severity="info"
                    onClick={() => openEditModal(rowData)}
                    tooltip="Edit Company"
                    tooltipOptions={{ position: "top" }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    severity="danger"
                    onClick={() => confirmDelete(rowData)}
                    tooltip="Delete Company"
                    tooltipOptions={{ position: "top" }}
                />
            </div>
        );
    };

    // Template for date
    const dateBodyTemplate = (rowData) => {
        return new Date(rowData.created_at).toLocaleDateString();
    };

    // Left toolbar content
    const leftToolbarTemplate = () => {
        // Define columns for export
        const exportColumns = [
            { header: "ID", field: "id" },
            { header: "Name", field: "name" },
            { header: "Address", field: "address" },
            { header: "Info", field: "info" },
            { header: "Created Date", field: "created_at", type: "date" },
        ];

        // Summary data for print
        const summaryData = [
            {
                label: "Total Companies",
                value: companies.total,
                subtext: "Registered companies",
            },
            {
                label: "This Page",
                value: companies.data.length,
                subtext: "Current view",
            },
        ];

        return (
            <ExportToolbar
                data={companies.data}
                filename="companies-list"
                title="Companies Management Report"
                currentUser={currentUser}
                totalRecords={companies.total}
                lastPage={companies.last_page}
                columns={exportColumns}
                summaryData={summaryData}
                showNewButton={true}
                newButtonLabel="New Company"
                newButtonIcon="pi pi-building"
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
                        placeholder="Search by Name or Address"
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
            <Head title="Companies Management" />

            <Toast ref={toast} />
            <ConfirmDialog />

            <CompanyModal
                visible={modalVisible}
                onHide={() => setModalVisible(false)}
                company={selectedCompany}
                onSuccess={handleModalSuccess}
            />

            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="flex justify-content-between align-items-center mb-4">
                            <div className="text-900 font-bold text-xl">
                                Companies Management
                            </div>
                            <div className="flex align-items-center gap-3">
                                <div className="text-sm text-500">
                                    Total: {companies.total} companies
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
                            value={companies.data}
                            paginator
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} companies"
                            rows={companies.per_page}
                            totalRecords={companies.total}
                            first={companies.from - 1}
                            lazy
                            onPage={(e) => {
                                const newPage = e.page + 1;
                                if (newPage !== companies.current_page) {
                                    router.get(
                                        route("companies.index"),
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
                            selection={selectedCompanies}
                            onSelectionChange={(e) =>
                                setSelectedCompanies(e.value)
                            }
                            tableStyle={{ minWidth: "50rem" }}
                            stripedRows
                            showGridlines
                            className="p-datatable-sm"
                            loading={false}
                            emptyMessage="No companies found"
                        >
                            <Column
                                selectionMode="multiple"
                                headerStyle={{ width: "3rem" }}
                            />
                            <Column
                                field="id"
                                header="ID"
                                sortable
                                style={{ width: "10%" }}
                            />
                            <Column
                                field="name"
                                header="Name"
                                sortable
                                style={{ width: "20%" }}
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
                                style={{ width: "15%" }}
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
