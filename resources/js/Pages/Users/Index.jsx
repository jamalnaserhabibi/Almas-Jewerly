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
import ExportToolbar from "../../Components/Export.jsx";
import UserModal from "../Users/UserModal.jsx";

export default function Index({ users, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
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
                    route("users.index"),
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
    const confirmDelete = (user) => {
        confirmDialog({
            message: `Are you sure you want to delete ${user.name}?`,
            header: "Delete Confirmation",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: () => {
                router.delete(route("users.destroy", user.id), {
                    onSuccess: () => {
                        toast.current.show({
                            severity: "success",
                            summary: "Success",
                            detail: "User deleted successfully",
                            life: 3000,
                        });
                    },
                    onError: (errors) => {
                        toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail: errors.error || "Failed to delete user",
                            life: 3000,
                        });
                    },
                });
            },
        });
    };

    // Open create modal
    const openCreateModal = () => {
        setSelectedUser(null);
        setModalVisible(true);
    };

    // Open edit modal
    const openEditModal = (user) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    // Handle modal success
    const handleModalSuccess = () => {
        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: selectedUser
                ? "User updated successfully"
                : "User created successfully",
            life: 3000,
        });
        router.reload({ only: ["users"] });
    };

    // Template for name column with "You" badge
    const nameBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                {rowData.name}
                {rowData.id === currentUser.id && (
                    <Tag
                        value="You"
                        severity="info"
                        rounded
                        style={{ fontSize: "0.7rem" }}
                    />
                )}
            </div>
        );
    };

    // Template for actions column
    const actionBodyTemplate = (rowData) => {
        const isCurrentUser = rowData.id === currentUser.id;
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-trash"
                    rounded
                    severity="danger"
                    onClick={() => confirmDelete(rowData)}
                    tooltip={
                        isCurrentUser ? "Cannot delete yourself" : "Delete User"
                    }
                    tooltipOptions={{ position: "top" }}
                    disabled={isCurrentUser}
                />
            </div>
        );
    };

    // Template for date
    const dateBodyTemplate = (rowData) => {
        return new Date(rowData.created_at).toLocaleDateString();
    };

    // Left toolbar content - Now using ExportToolbar component
    const leftToolbarTemplate = () => {
        // Define columns for export
        const exportColumns = [
            { header: "ID", field: "id" },
            { header: "Name", field: "name" },
            // { header: "Email", field: "email" },
            { header: "Created Date", field: "created_at", type: "date" },
            // { header: "Status", field: "email_verified_at", type: "badge" },
        ];

        // Summary data for print
        const summaryData = [
            {
                label: "Total Users",
                value: users.total,
                subtext: "Registered users",
            },
            {
                label: "Verified Users",
                value: users.data.filter((u) => u.email_verified_at).length,
                subtext: "Email verified",
            },
            {
                label: "This Page",
                value: users.data.length,
                subtext: "Current view",
            },
        ];

        return (
            <ExportToolbar
                data={users.data}
                filename="users-list"
                title="Users Management Report"
                currentUser={currentUser}
                totalRecords={users.total}
                lastPage={users.last_page}
                columns={exportColumns}
                summaryData={summaryData}
                showNewButton={true}
                newButtonLabel="New User"
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
                        placeholder="Search by Name or Email"
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
            <Head title="Users Management" />

            <Toast ref={toast} />
            <ConfirmDialog />

            <UserModal
                visible={modalVisible}
                onHide={() => setModalVisible(false)}
                user={selectedUser}
                onSuccess={handleModalSuccess}
            />

            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <div className="flex justify-content-between align-items-center mb-4">
                            <div className="text-900 font-bold text-xl">
                                Users Management
                            </div>
                            <div className="flex align-items-center gap-3">
                                <div className="text-sm text-500">
                                    Total: {users.total} users
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
                            value={users.data}
                            paginator
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                            rows={users.per_page}
                            totalRecords={users.total}
                            first={users.from - 1}
                            lazy
                            onPage={(e) => {
                                const newPage = e.page + 1;
                                if (newPage !== users.current_page) {
                                    router.get(
                                        route("users.index"),
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
                            selection={selectedUsers}
                            onSelectionChange={(e) => setSelectedUsers(e.value)}
                            tableStyle={{ minWidth: "50rem" }}
                            stripedRows
                            showGridlines
                            className="p-datatable-sm"
                            loading={false}
                            emptyMessage="No users found"
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
                                body={nameBodyTemplate}
                                sortable
                                style={{ width: "20%" }}
                            />
                            <Column
                                field="email"
                                header="Username"
                                sortable
                                style={{ width: "25%" }}
                            />
                            <Column
                                header="Created"
                                body={dateBodyTemplate}
                                sortable
                                style={{ width: "15%" }}
                            />
                            <Column
                                header="Delete"
                                body={actionBodyTemplate}
                                style={{ width: "15%" }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
