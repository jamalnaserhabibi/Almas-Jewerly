import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { useForm } from "@inertiajs/react";

export default function CompanyModal({ visible, onHide, company, onSuccess }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: company?.name || "",
        address: company?.address || "",
        info: company?.info || "",
    });

    // Reset form when modal opens/closes or company changes
    useEffect(() => {
        if (visible) {
            setData({
                name: company?.name || "",
                address: company?.address || "",
                info: company?.info || "",
            });
        } else {
            reset();
        }
    }, [visible, company]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (company) {
            // Update existing company
            put(route("companies.update", company.id), {
                onSuccess: () => {
                    onSuccess?.();
                    onHide();
                },
            });
        } else {
            // Create new company
            post(route("companies.store"), {
                onSuccess: () => {
                    onSuccess?.();
                    onHide();
                },
            });
        }
    };

    const dialogFooter = (
        <div className="flex justify-content-end gap-2">
            <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-text"
            />
            <Button
                label={company ? "Update" : "Create"}
                icon="pi pi-check"
                onClick={handleSubmit}
                loading={processing}
                disabled={processing}
            />
        </div>
    );

    return (
        <Dialog
            header={company ? "Edit Company" : "Create New Company"}
            visible={visible}
            style={{ width: "500px" }}
            footer={dialogFooter}
            onHide={onHide}
            modal
            className="p-fluid"
        >
            <form onSubmit={handleSubmit}>
                <div className="field mb-4">
                    <label htmlFor="name" className="font-medium block mb-2">
                        Company Name
                    </label>
                    <InputText
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className={classNames({ "p-invalid": errors.name })}
                        autoFocus
                    />
                    {errors.name && (
                        <small className="p-error">{errors.name}</small>
                    )}
                </div>

                <div className="field mb-4">
                    <label htmlFor="address" className="font-medium block mb-2">
                        Address
                    </label>
                    <InputText
                        id="address"
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                        className={classNames({ "p-invalid": errors.address })}
                    />
                    {errors.address && (
                        <small className="p-error">{errors.address}</small>
                    )}
                </div>

                <div className="field mb-4">
                    <label htmlFor="info" className="font-medium block mb-2">
                        Additional Info
                    </label>
                    <InputTextarea
                        id="info"
                        value={data.info}
                        onChange={(e) => setData("info", e.target.value)}
                        rows={4}
                        className={classNames({ "p-invalid": errors.info })}
                        autoResize
                    />
                    {errors.info && (
                        <small className="p-error">{errors.info}</small>
                    )}
                </div>
            </form>
        </Dialog>
    );
}
