import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useForm } from "@inertiajs/react";

export default function GoldItemModal({
    visible,
    onHide,
    item,
    onSuccess,
    companies,
    karats,
}) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        source_type: item?.source_type || "company",
        company_id: item?.company_id || null,
        individual_name: item?.individual_name || "",
        weight: item?.weight || null,
        acidic_average: item?.acidic_average || null,
        karat_id: item?.karat_id || null,
        unit_price: item?.unit_price || null,
        fee: item?.fee || null,
        purchase_date: item?.purchase_date
            ? new Date(item.purchase_date)
            : new Date(),
        notes: item?.notes || "",
        photo: null,
    });

    // Update form when modal opens or item changes
    useEffect(() => {
        if (visible) {
            if (item) {
                setData({
                    source_type: item.source_type,
                    company_id: item.company_id,
                    individual_name: item.individual_name,
                    weight: item.weight,
                    acidic_average: item.acidic_average,
                    karat_id: item.karat_id,
                    unit_price: item.unit_price,
                    fee: item.fee,
                    purchase_date: item.purchase_date
                        ? new Date(item.purchase_date)
                        : new Date(),
                    notes: item.notes,
                    photo: null,
                });
            } else {
                reset();
            }
        }
    }, [visible, item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { ...data };

        // Remove irrelevant fields based on source type
        if (formData.source_type === "company") {
            delete formData.individual_name;
            delete formData.acidic_average;
            delete formData.unit_price;
        } else {
            delete formData.company_id;
            delete formData.fee;
        }

        if (item) {
            put(route("gold-items.update", item.id), {
                data: formData,
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess?.();
                    onHide();
                },
            });
        } else {
            post(route("gold-items.store"), {
                data: formData,
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess?.();
                    onHide();
                },
            });
        }
    };

    const sourceOptions = [
        { label: "Company", value: "company" },
        { label: "Individual", value: "individual" },
    ];

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
                label={item ? "Update" : "Create"}
                icon="pi pi-check"
                onClick={handleSubmit}
                loading={processing}
                disabled={processing}
            />
        </div>
    );

    return (
        <Dialog
            header={item ? "Edit Gold Item" : "Add New Gold Item"}
            visible={visible}
            style={{ width: "600px" }}
            footer={dialogFooter}
            onHide={onHide}
            modal
            className="p-fluid"
            closable={!processing}
            closeOnEscape={!processing}
            dismissableMask={!processing}
        >
            <form onSubmit={handleSubmit}>
                {/* Source Type */}
                <div className="field mb-4">
                    <label
                        htmlFor="source_type"
                        className="font-medium block mb-2"
                    >
                        Source Type
                    </label>
                    <Dropdown
                        id="source_type"
                        value={data.source_type}
                        options={sourceOptions}
                        onChange={(e) => {
                            const value = e.value;
                            if (value === "company") {
                                setData({
                                    ...data,
                                    source_type: "company",
                                    individual_name: "",
                                    acidic_average: null,
                                    unit_price: null,
                                });
                            } else {
                                setData({
                                    ...data,
                                    source_type: "individual",
                                    company_id: null,
                                    fee: null,
                                });
                            }
                        }}
                    />
                    {errors.source_type && (
                        <small className="p-error">{errors.source_type}</small>
                    )}
                </div>

                {/* Company Selection */}
                {data.source_type === "company" && (
                    <div className="field mb-4">
                        <label
                            htmlFor="company_id"
                            className="font-medium block mb-2"
                        >
                            Company
                        </label>
                        <Dropdown
                            id="company_id"
                            value={data.company_id}
                            options={companies.map((c) => ({
                                label: c.name,
                                value: c.id,
                            }))}
                            onChange={(e) => setData("company_id", e.value)}
                            placeholder="Select company"
                            className={classNames({
                                "p-invalid": errors.company_id,
                            })}
                            disabled={processing}
                        />
                        {errors.company_id && (
                            <small className="p-error">
                                {errors.company_id}
                            </small>
                        )}
                    </div>
                )}

                {/* Individual Name */}
                {data.source_type === "individual" && (
                    <div className="field mb-4">
                        <label
                            htmlFor="individual_name"
                            className="font-medium block mb-2"
                        >
                            Seller Name
                        </label>
                        <InputText
                            id="individual_name"
                            value={data.individual_name}
                            onChange={(e) =>
                                setData("individual_name", e.target.value)
                            }
                            className={classNames({
                                "p-invalid": errors.individual_name,
                            })}
                            disabled={processing}
                        />
                        {errors.individual_name && (
                            <small className="p-error">
                                {errors.individual_name}
                            </small>
                        )}
                    </div>
                )}

                {/* Karat */}
                <div className="field mb-4">
                    <label
                        htmlFor="karat_id"
                        className="font-medium block mb-2"
                    >
                        Karat
                    </label>
                    <Dropdown
                        id="karat_id"
                        value={data.karat_id}
                        options={karats.map((k) => ({
                            label: k.name,
                            value: k.id,
                        }))}
                        onChange={(e) => setData("karat_id", e.value)}
                        placeholder="Select karat"
                        className={classNames({ "p-invalid": errors.karat_id })}
                        disabled={processing}
                    />
                    {errors.karat_id && (
                        <small className="p-error">{errors.karat_id}</small>
                    )}
                </div>

                {/* Weight */}
                <div className="field mb-4">
                    <label htmlFor="weight" className="font-medium block mb-2">
                        Weight (grams)
                    </label>
                    <InputNumber
                        id="weight"
                        value={data.weight}
                        onValueChange={(e) => setData("weight", e.value)}
                        mode="decimal"
                        minFractionDigits={2}
                        maxFractionDigits={3}
                        className={classNames({ "p-invalid": errors.weight })}
                        disabled={processing}
                    />
                    {errors.weight && (
                        <small className="p-error">{errors.weight}</small>
                    )}
                </div>

                {/* Individual Fields */}
                {data.source_type === "individual" && (
                    <>
                        <div className="field mb-4">
                            <label
                                htmlFor="acidic_average"
                                className="font-medium block mb-2"
                            >
                                Acidic Average (%)
                            </label>
                            <InputNumber
                                id="acidic_average"
                                value={data.acidic_average}
                                onValueChange={(e) =>
                                    setData("acidic_average", e.value)
                                }
                                mode="decimal"
                                minFractionDigits={2}
                                maxFractionDigits={2}
                                suffix="%"
                                className={classNames({
                                    "p-invalid": errors.acidic_average,
                                })}
                                disabled={processing}
                            />
                            {errors.acidic_average && (
                                <small className="p-error">
                                    {errors.acidic_average}
                                </small>
                            )}
                        </div>

                        <div className="field mb-4">
                            <label
                                htmlFor="unit_price"
                                className="font-medium block mb-2"
                            >
                                Unit Price (per gram)
                            </label>
                            <InputNumber
                                id="unit_price"
                                value={data.unit_price}
                                onValueChange={(e) =>
                                    setData("unit_price", e.value)
                                }
                                mode="currency"
                                currency="AFN"
                                locale="en-US"
                                className={classNames({
                                    "p-invalid": errors.unit_price,
                                })}
                                disabled={processing}
                            />
                            {errors.unit_price && (
                                <small className="p-error">
                                    {errors.unit_price}
                                </small>
                            )}
                        </div>
                    </>
                )}

                {/* Company Fields */}
                {data.source_type === "company" && (
                    <div className="field mb-4">
                        <label htmlFor="fee" className="font-medium block mb-2">
                            Fee
                        </label>
                        <InputNumber
                            id="fee"
                            value={data.fee}
                            onValueChange={(e) => setData("fee", e.value)}
                            mode="currency"
                            currency="AFN"
                            locale="en-US"
                            className={classNames({ "p-invalid": errors.fee })}
                            disabled={processing}
                        />
                        {errors.fee && (
                            <small className="p-error">{errors.fee}</small>
                        )}
                    </div>
                )}

                {/* Purchase Date */}
                <div className="field mb-4">
                    <label
                        htmlFor="purchase_date"
                        className="font-medium block mb-2"
                    >
                        Purchase Date
                    </label>
                    <Calendar
                        id="purchase_date"
                        value={data.purchase_date}
                        onChange={(e) => setData("purchase_date", e.value)}
                        dateFormat="yy-mm-dd"
                        showIcon
                        className={classNames({
                            "p-invalid": errors.purchase_date,
                        })}
                        disabled={processing}
                    />
                    {errors.purchase_date && (
                        <small className="p-error">
                            {errors.purchase_date}
                        </small>
                    )}
                </div>

                {/* Photo */}
                <div className="field mb-4">
                    <label htmlFor="photo" className="font-medium block mb-2">
                        Photo
                    </label>
                    <input
                        type="file"
                        id="photo"
                        accept="image/*"
                        onChange={(e) => setData("photo", e.target.files[0])}
                        className={classNames({ "p-invalid": errors.photo })}
                        disabled={processing}
                    />
                    {errors.photo && (
                        <small className="p-error">{errors.photo}</small>
                    )}
                </div>

                {/* Notes */}
                <div className="field mb-4">
                    <label htmlFor="notes" className="font-medium block mb-2">
                        Notes
                    </label>
                    <InputTextarea
                        id="notes"
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        rows={3}
                        className={classNames({ "p-invalid": errors.notes })}
                        autoResize
                        disabled={processing}
                    />
                    {errors.notes && (
                        <small className="p-error">{errors.notes}</small>
                    )}
                </div>
            </form>
        </Dialog>
    );
}
