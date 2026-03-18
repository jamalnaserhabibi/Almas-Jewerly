import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";

export default function PrintBarcode({ item }) {
    useEffect(() => {
        window.print();
    }, []);

    // Construct the full barcode image URL
    const barcodeUrl = item.barcode_image ? `/${item.barcode_image}` : null;

    return (
        <>
            <Head title="Print Barcode" />

            <div
                style={{
                    width: "200px",
                    margin: "20px auto",
                    padding: "15px",
                    borderRadius: "5px",
                    textAlign: "center",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                {/* Company Name */}
                <div
                    style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                    }}
                >
                    Almas Jewelry
                </div>

                {/* Barcode SVG Image */}
                {barcodeUrl ? (
                    <div style={{ marginBottom: "10px" }}>
                        <img
                            src={barcodeUrl}
                            alt="Barcode"
                            style={{
                                width: "80%",
                                maxWidth: "250px",
                                height: "auto",
                            }}
                        />
                    </div>
                ) : (
                    <div
                        style={{
                            padding: "20px",
                            background: "#f0f0f0",
                            marginBottom: "10px",
                            fontFamily: "monospace",
                            fontSize: "18px",
                        }}
                    >
                        {item.barcode}
                    </div>
                )}

                <div style={{ fontSize: "18px", marginBottom: "5px" }}>
                    {item.karat?.name} | {item.weight}g
                </div>
            </div>

            <style>{`
                @media print {
                    body { 
                        margin: 0; 
                        padding: 20px; 
                        background: white;
                    }
                    img {
                        max-width: 100%;
                    }
                }
            `}</style>
        </>
    );
}
