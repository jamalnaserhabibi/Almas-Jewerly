import React from "react";
import { Head, router, useForm } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";

export default function Create({ goldItem, customers }) {
    const { data, setData, post, processing, errors } = useForm({
        gold_item_id: goldItem.id,
        customer_id: "",
        unit_price: "",
        sale_date: new Date(),
        notes: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("sales.store"));
    };

    return (
        <Layout>
            <Head title="Create Sale" />

            <div className="grid">
                <div className="col-12">
                    <Card>
                        <div className="flex justify-content-between align-items-center mb-4">
                            <div className="text-900 font-bold text-xl">
                                New Sale - Item: {goldItem.barcode}
                            </div>
                            <Button
                                label="Back"
                                icon="pi pi-arrow-left"
                                severity="secondary"
                                outlined
                                onClick={() =>
                                    router.get(
                                        route("gold-items.show", goldItem.id),
                                    )
                                }
                            />
                        </div>

                        <div className="grid">
                            {/* Item Details Summary */}
                            <div className="col-4">
                                <Card className="bg-gray-50">
                                    <h3 className="text-md font-bold mb-3">
                                        Item Details
                                    </h3>
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="py-1 text-gray-600">
                                                    Barcode:
                                                </td>
                                                <td className="py-1 font-bold">
                                                    {goldItem.barcode}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-600">
                                                    Karat:
                                                </td>
                                                <td className="py-1">
                                                    {goldItem.karat?.name}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-600">
                                                    Weight:
                                                </td>
                                                <td className="py-1">
                                                    {parseFloat(
                                                        goldItem.weight,
                                                    ).toFixed(2)}
                                                    g
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 text-gray-600">
                                                    Source:
                                                </td>
                                                <td className="py-1">
                                                    {goldItem.source_type ===
                                                    "company"
                                                        ? goldItem.company?.name
                                                        : goldItem.individual_name}
                                                </td>
                                            </tr>
                                            {goldItem.source_type ===
                                                "individual" &&
                                                goldItem.unit_price && (
                                                    <tr>
                                                        <td className="py-1 text-gray-600">
                                                            Cost Price/g:
                                                        </td>
                                                        <td className="py-1">
                                                            {
                                                                goldItem.unit_price
                                                            }{" "}
                                                            AFN
                                                        </td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </table>
                                </Card>
                            </div>

                            {/* Sale Form */}
                            <div className="col-8">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid">
                                        <div className="col-12">
                                            <div className="field mb-3">
                                                <label className="font-medium block mb-2">
                                                    Customer *
                                                </label>
                                                <Dropdown
                                                    value={data.customer_id}
                                                    options={customers.map(
                                                        (c) => ({
                                                            label: `${c.name} (${c.contact || "No contact"})`,
                                                            value: c.id,
                                                        }),
                                                    )}
                                                    onChange={(e) =>
                                                        setData(
                                                            "customer_id",
                                                            e.value,
                                                        )
                                                    }
                                                    placeholder="Select customer"
                                                    className={classNames(
                                                        "w-full",
                                                        {
                                                            "p-invalid":
                                                                errors.customer_id,
                                                        },
                                                    )}
                                                    filter
                                                />
                                                {errors.customer_id && (
                                                    <small className="p-error">
                                                        {errors.customer_id}
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <div className="field mb-3">
                                                <label className="font-medium block mb-2">
                                                    Unit Price (per gram) *
                                                </label>
                                                <InputNumber
                                                    value={data.unit_price}
                                                    onValueChange={(e) =>
                                                        setData(
                                                            "unit_price",
                                                            e.value,
                                                        )
                                                    }
                                                    mode="currency"
                                                    currency="AFN"
                                                    locale="en-US"
                                                    className={classNames(
                                                        "w-full",
                                                        {
                                                            "p-invalid":
                                                                errors.unit_price,
                                                        },
                                                    )}
                                                    autoFocus
                                                />
                                                {errors.unit_price && (
                                                    <small className="p-error">
                                                        {errors.unit_price}
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <div className="field mb-3">
                                                <label className="font-medium block mb-2">
                                                    Sale Date *
                                                </label>
                                                <Calendar
                                                    value={data.sale_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            "sale_date",
                                                            e.value,
                                                        )
                                                    }
                                                    dateFormat="yy-mm-dd"
                                                    showIcon
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="field mb-3">
                                                <label className="font-medium block mb-2">
                                                    Notes
                                                </label>
                                                <InputText
                                                    value={data.notes}
                                                    onChange={(e) =>
                                                        setData(
                                                            "notes",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="flex justify-content-end gap-2 mt-3">
                                                <Button
                                                    type="button"
                                                    label="Cancel"
                                                    icon="pi pi-times"
                                                    severity="secondary"
                                                    outlined
                                                    onClick={() =>
                                                        router.get(
                                                            route(
                                                                "gold-items.show",
                                                                goldItem.id,
                                                            ),
                                                        )
                                                    }
                                                />
                                                <Button
                                                    type="submit"
                                                    label="Complete Sale"
                                                    icon="pi pi-check"
                                                    severity="success"
                                                    loading={processing}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
