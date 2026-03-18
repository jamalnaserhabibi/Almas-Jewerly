import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { useForm } from "@inertiajs/react";

export default function UserModal({ visible, onHide, user, onSuccess }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
    });

    // Reset form when modal opens/closes or user changes
    useEffect(() => {
        if (visible) {
            setData({
                name: user?.name || "",
                email: user?.email || "",
                password: "",
            });
        } else {
            reset();
        }
    }, [visible, user]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (user) {
            // Update existing user
            put(route("users.update", user.id), {
                onSuccess: () => {
                    onSuccess?.();
                    onHide();
                },
            });
        } else {
            // Create new user
            post(route("users.store"), {
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
                label={user ? "Update" : "Create"}
                icon="pi pi-check"
                onClick={handleSubmit}
                loading={processing}
                disabled={processing}
            />
        </div>
    );

    return (
        <Dialog
            header={user ? "Edit User" : "Create New User"}
            visible={visible}
            style={{ width: "450px" }}
            footer={dialogFooter}
            onHide={onHide}
            modal
            className="p-fluid"
        >
            <form onSubmit={handleSubmit}>
                <div className="field mb-4">
                    <label htmlFor="name" className="font-medium block mb-2">
                        Name
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
                    <label htmlFor="email" className="font-medium block mb-2">
                        Username
                    </label>
                    <InputText
                        id="email"
                        type="text"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className={classNames({ "p-invalid": errors.email })}
                    />
                    {errors.email && (
                        <small className="p-error">{errors.email}</small>
                    )}
                </div>

                <div className="field mb-4">
                    <label
                        htmlFor="password"
                        className="font-medium block mb-2"
                    >
                        Password{" "}
                        {user && (
                            <span className="text-500 font-normal">
                                (Leave empty to keep current)
                            </span>
                        )}
                    </label>
                    <Password
                        id="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        toggleMask
                        className={classNames({ "p-invalid": errors.password })}
                        feedback={!user} // Show feedback only for new users
                    />
                    {errors.password && (
                        <small className="p-error">{errors.password}</small>
                    )}
                </div>
            </form>
        </Dialog>
    );
}
