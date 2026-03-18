import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";

export default function Show({ item }) {
    const [photoVisible, setPhotoVisible] = useState(false);

    const handleSale = () => {
        alert(`Gold item ${item.barcode} marked as sold!`);
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "AFN",
        }).format(amount);

    const isInStock = item.status?.toLowerCase() === "in_stock";

    return (
        <Layout>
            <Head title={`Gold Item - ${item.barcode}`} />

            <div className="grid p-4">
                <div className="col-12">
                    <div className="flex flex-column md:flex-row shadow-4 border-round-md p-5 gap-5 align-items-center">
                        {/* Left Table */}
                        <div className="flex-1">
                            <h2 className="text-900 font-bold text-2xl mb-5">
                                Gold Item Details
                            </h2>

                            <table className="w-full table-auto border-collapse text-lg">
                                <tbody>
                                    <tr className="border-b">
                                        <td className="font-medium py-2">
                                            Source Type:
                                        </td>
                                        <td className="py-2">
                                            <Tag
                                                value={
                                                    item.source_type ===
                                                    "company"
                                                        ? "Company"
                                                        : "Individual"
                                                }
                                                severity={
                                                    item.source_type ===
                                                    "company"
                                                        ? "info"
                                                        : "warning"
                                                }
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-medium py-2">
                                            Source Name:
                                        </td>
                                        <td className="py-2">
                                            {item.source_type === "company"
                                                ? item.company?.name
                                                : item.individual_name}
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-medium py-2">
                                            Karat:
                                        </td>
                                        <td className="py-2">
                                            {item.karat?.name}
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="font-medium py-2">
                                            Weight:
                                        </td>
                                        <td className="py-2">
                                            {parseFloat(item.weight).toFixed(2)}{" "}
                                            g
                                        </td>
                                    </tr>

                                    {item.source_type === "individual" && (
                                        <>
                                            <tr className="border-b">
                                                <td className="font-medium py-2">
                                                    Unit Price:
                                                </td>
                                                <td className="py-2">
                                                    {formatCurrency(
                                                        item.unit_price,
                                                    )}
                                                    /g
                                                </td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="font-medium py-2">
                                                    Acidic Average:
                                                </td>
                                                <td className="py-2">
                                                    {item.acidic_average}%
                                                </td>
                                            </tr>
                                        </>
                                    )}

                                    {item.source_type === "company" && (
                                        <tr className="border-b">
                                            <td className="font-medium py-2">
                                                Fee:
                                            </td>
                                            <td className="py-2">
                                                {formatCurrency(item.fee || 0)}
                                            </td>
                                        </tr>
                                    )}

                                    <tr className="border-b">
                                        <td className="font-medium py-2">
                                            Purchase Date:
                                        </td>
                                        <td className="py-2">
                                            {new Date(
                                                item.purchase_date,
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>

                                    {item.notes && (
                                        <tr className="border-b">
                                            <td className="font-medium py-2">
                                                Notes:
                                            </td>
                                            <td className="py-2">
                                                {item.notes}
                                            </td>
                                        </tr>
                                    )}

                                    {/* Sale + Back Buttons */}
                                    <tr>
                                        <td colSpan={2} className="py-4">
                                            <div className="flex gap-3">
                                                <Link
                                                    href={route(
                                                        "gold-items.index",
                                                    )}
                                                >
                                                    <Button
                                                        label="Back"
                                                        icon="pi pi-arrow-left"
                                                        severity="secondary"
                                                        outlined
                                                    />
                                                </Link>
                                                {
                                                    <Button
                                                        label="Sell Item"
                                                        icon="pi pi-shopping-cart"
                                                        severity="success"
                                                        onClick={() =>
                                                            router.get(
                                                                route(
                                                                    "sales.create",
                                                                    item.id,
                                                                ),
                                                            )
                                                        }
                                                        disabled={
                                                            item.sale != null
                                                        }
                                                    />
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Right Photo */}
                        {item.photo && (
                            <div className="flex-1 flex justify-content-center">
                                <img
                                    src={`/storage/${item.photo}`}
                                    alt="Gold Item"
                                    className="border-round shadow-3 cursor-pointer"
                                    style={{
                                        maxWidth: "400px",
                                        maxHeight: "400px",
                                    }}
                                    onClick={() => setPhotoVisible(true)}
                                />
                            </div>
                        )}

                        {/* Photo Dialog */}

                        <div className="d-flex">
                            <Dialog
                                header="Gold Item Photo"
                                visible={photoVisible}
                                onHide={() => setPhotoVisible(false)}
                                style={{ width: "50vw" }}
                                modal
                            >
                                <img
                                    src={`/storage/${item.photo}`}
                                    alt="Gold Item"
                                    className="w-full h-auto border-round"
                                />
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
