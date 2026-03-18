import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { useForm } from "@inertiajs/react";

export default function CustomerModal({
    visible,
    onHide,
    customer,
    onSuccess,
}) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: customer?.name || "",
        contact: customer?.contact || "",
        address: customer?.address || "",
        info: customer?.info || "",
    });

    useEffect(() => {
        if (visible) {
            setData({
                name: customer?.name || "",
                contact: customer?.contact || "",
                address: customer?.address || "",
                info: customer?.info || "",
            });
        } else {
            reset();
        }
    }, [visible, customer]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (customer) {
            put(route("customers.update", customer.id), {
                onSuccess: () => {
                    onSuccess?.();
                    onHide();
                },
            });
        } else {
            post(route("customers.store"), {
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
                disabled={processing}
            />
            <Button
                label={customer ? "Update" : "Create"}
                icon="pi pi-check"
                onClick={handleSubmit}
                loading={processing}
                disabled={processing}
            />
        </div>
    );

    return (
        <Dialog
            header={customer ? "Edit Customer" : "Add New Customer"}
            visible={visible}
            style={{ width: "500px" }}
            footer={dialogFooter}
            onHide={onHide}
            modal
            className="p-fluid"
            closable={!processing}
            closeOnEscape={!processing}
        >
            <form onSubmit={handleSubmit}>
                <div className="field mb-4">
                    <label htmlFor="name" className="font-medium block mb-2">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className={classNames({ "p-invalid": errors.name })}
                        autoFocus
                        disabled={processing}
                    />
                    {errors.name && (
                        <small className="p-error">{errors.name}</small>
                    )}
                </div>

                <div className="field mb-4">
                    <label htmlFor="contact" className="font-medium block mb-2">
                        Contact Number
                    </label>
                    <InputText
                        id="contact"
                        value={data.contact}
                        onChange={(e) => setData("contact", e.target.value)}
                        className={classNames({ "p-invalid": errors.contact })}
                        placeholder="Phone number"
                        disabled={processing}
                    />
                    {errors.contact && (
                        <small className="p-error">{errors.contact}</small>
                    )}
                </div>

                <div className="field mb-4">
                    <label htmlFor="address" className="font-medium block mb-2">
                        Address
                    </label>
                    <InputTextarea
                        id="address"
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                        rows={3}
                        className={classNames({ "p-invalid": errors.address })}
                        autoResize
                        disabled={processing}
                    />
                    {errors.address && (
                        <small className="p-error">{errors.address}</small>
                    )}
                </div>

                <div className="field mb-4">
                    <label htmlFor="info" className="font-medium block mb-2">
                        Additional Information
                    </label>
                    <InputTextarea
                        id="info"
                        value={data.info}
                        onChange={(e) => setData("info", e.target.value)}
                        rows={3}
                        className={classNames({ "p-invalid": errors.info })}
                        autoResize
                        disabled={processing}
                    />
                    {errors.info && (
                        <small className="p-error">{errors.info}</small>
                    )}
                </div>
            </form>
        </Dialog>
    );
}
