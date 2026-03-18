import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export default function Show({ sale }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "AFN",
            minimumFractionDigits: 0,
        }).format(value);
    };
    console.log(sale);
    const totalPrice = sale.gold_item?.weight * sale.unit_price;

    return (
        <Layout>
            <Head title={`Sale #${sale.id}`} />

            <div className="grid p-4">
                <div className="col-12">
                    <Card>
                        {/* Header with Back Button */}
                        <div className="flex justify-content-between align-items-center mb-4">
                            <div className="text-900 font-bold text-2xl">
                                Sale Details - #{sale.id}
                            </div>
                            <Link href={route("sales.index")}>
                                <Button
                                    label="Back to Sales"
                                    icon="pi pi-arrow-left"
                                    severity="secondary"
                                    outlined
                                />
                            </Link>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid">
                            {/* Sale Information Card */}
                            <div className="col-12 md:col-6">
                                <Card className="bg-gray-50">
                                    <h3 className="text-lg font-bold mb-3">
                                        <i className="pi pi-shopping-cart mr-2"></i>
                                        Sale Information
                                    </h3>
                                    <table className="w-full">
                                        <tbody>
                                            <tr className="border-bottom-1 surface-border">
                                                <td className="py-3 text-gray-600 font-medium">
                                                    Sale ID:
                                                </td>
                                                <td className="py-3 font-bold">
                                                    #{sale.id}
                                                </td>
                                            </tr>
                                            <tr className="border-bottom-1 surface-border">
                                                <td className="py-3 text-gray-600 font-medium">
                                                    Sale Date:
                                                </td>
                                                <td className="py-3">
                                                    {new Date(
                                                        sale.sale_date,
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                            <tr className="border-bottom-1 surface-border">
                                                <td className="py-3 text-gray-600 font-medium">
                                                    Unit Price:
                                                </td>
                                                <td className="py-3 font-bold">
                                                    {formatCurrency(
                                                        sale.unit_price,
                                                    )}
                                                    /g
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 text-gray-600 font-medium">
                                                    Total Price:
                                                </td>
                                                <td className="py-3 font-bold text-primary text-xl">
                                                    {formatCurrency(totalPrice)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Card>
                            </div>

                            {/* Customer Information Card */}
                            <div className="col-12 md:col-6">
                                <Card className="bg-gray-50">
                                    <h3 className="text-lg font-bold mb-3">
                                        <i className="pi pi-user mr-2"></i>
                                        Customer Details
                                    </h3>
                                    <table className="w-full">
                                        <tbody>
                                            <tr className="border-bottom-1 surface-border">
                                                <td className="py-3 text-gray-600 font-medium">
                                                    Name:
                                                </td>
                                                <td className="py-3 font-bold">
                                                    {sale.customer?.name ||
                                                        "N/A"}
                                                </td>
                                            </tr>
                                            <tr className="border-bottom-1 surface-border">
                                                <td className="py-3 text-gray-600 font-medium">
                                                    Contact:
                                                </td>
                                                <td className="py-3">
                                                    {sale.customer?.contact ||
                                                        "N/A"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 text-gray-600 font-medium">
                                                    Address:
                                                </td>
                                                <td className="py-3">
                                                    {sale.customer?.address ||
                                                        "N/A"}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Card>
                            </div>

                            {/* Gold Item Details Card */}
                            <div className="col-12 mt-4">
                                <Card className="bg-gray-50">
                                    <h3 className="text-lg font-bold mb-3">
                                        <i className="pi pi-star mr-2"></i>
                                        Gold Item Details
                                    </h3>
                                    <div className="grid">
                                        {/* Photo Column */}
                                        {sale.gold_item?.photo && (
                                            <div className="col-12 md:col-4 flex justify-content-center">
                                                <img
                                                    src={`/storage/${sale.gold_item.photo}`}
                                                    alt="Gold Item"
                                                    className="border-round shadow-2"
                                                    style={{
                                                        maxWidth: "250px",
                                                        maxHeight: "250px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Details Column */}
                                        <div
                                            className={
                                                sale.gold_item?.photo
                                                    ? "col-12 md:col-8"
                                                    : "col-12"
                                            }
                                        >
                                            <table className="w-full">
                                                <tbody>
                                                    <tr className="border-bottom-1 surface-border">
                                                        <td className="py-3 text-gray-600 font-medium w-4">
                                                            Barcode:
                                                        </td>
                                                        <td className="py-3 font-mono font-bold">
                                                            {
                                                                sale.gold_item
                                                                    ?.barcode
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr className="border-bottom-1 surface-border">
                                                        <td className="py-3 text-gray-600 font-medium">
                                                            Karat:
                                                        </td>
                                                        <td className="py-3">
                                                            {
                                                                sale.gold_item
                                                                    ?.karat
                                                                    ?.name
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr className="border-bottom-1 surface-border">
                                                        <td className="py-3 text-gray-600 font-medium">
                                                            Weight:
                                                        </td>
                                                        <td className="py-3">
                                                            {parseFloat(
                                                                sale.gold_item
                                                                    ?.weight,
                                                            ).toFixed(2)}
                                                            g
                                                        </td>
                                                    </tr>
                                                    <tr className="border-bottom-1 surface-border">
                                                        <td className="py-3 text-gray-600 font-medium">
                                                            Source Type:
                                                        </td>
                                                        <td className="py-3">
                                                            {sale.gold_item
                                                                ?.source_type ===
                                                            "company" ? (
                                                                <Tag
                                                                    value="Company"
                                                                    severity="info"
                                                                />
                                                            ) : (
                                                                <Tag
                                                                    value="Individual"
                                                                    severity="warning"
                                                                />
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr className="border-bottom-1 surface-border">
                                                        <td className="py-3 text-gray-600 font-medium">
                                                            Source Name:
                                                        </td>
                                                        <td className="py-3">
                                                            {sale.gold_item
                                                                ?.source_type ===
                                                            "company"
                                                                ? sale.gold_item
                                                                      ?.company
                                                                      ?.name
                                                                : sale.gold_item
                                                                      ?.individual_name}
                                                        </td>
                                                    </tr>
                                                    {sale.gold_item?.fee && (
                                                        <tr className="border-bottom-1 surface-border">
                                                            <td className="py-3 text-gray-600 font-medium">
                                                                Fee:
                                                            </td>
                                                            <td className="py-3">
                                                                {formatCurrency(
                                                                    sale
                                                                        .gold_item
                                                                        .fee,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {sale.gold_item
                                                        ?.acidic_average && (
                                                        <tr className="border-bottom-1 surface-border">
                                                            <td className="py-3 text-gray-600 font-medium">
                                                                Acidic Average:
                                                            </td>
                                                            <td className="py-3">
                                                                {
                                                                    sale
                                                                        .gold_item
                                                                        .acidic_average
                                                                }
                                                                %
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Notes Card */}
                            {sale.notes && (
                                <div className="col-12 mt-4">
                                    <Card className="bg-gray-50">
                                        <h3 className="text-lg font-bold mb-3">
                                            <i className="pi pi-file mr-2"></i>
                                            Notes
                                        </h3>
                                        <p className="text-gray-700">
                                            {sale.notes}
                                        </p>
                                    </Card>
                                </div>
                            )}

                            {/* Seller Info */}
                            <div className="col-12 mt-4 text-right text-gray-500">
                                <small>
                                    Sold by: {sale.seller?.name || "Unknown"} on{" "}
                                    {new Date(
                                        sale.created_at,
                                    ).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
