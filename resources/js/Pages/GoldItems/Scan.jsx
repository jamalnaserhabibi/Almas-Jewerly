import React, { useState, useRef, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";

export default function Scan() {
    const [barcode, setBarcode] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const { flash } = usePage().props;

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [flash]);

    const handleScan = () => {
        if (!barcode.trim() || loading) return;

        setLoading(true);

        router.post(
            route("gold-items.scan.search"),
            { barcode },
            {
                preserveScroll: true,
                onFinish: () => {
                    setLoading(false);
                    setBarcode(""); // reset for next scan
                },
            },
        );
    };

    return (
        <Layout>
            <Head title="Scan Barcode" />

            <div className="grid">
                <div className="col-12 md:col-6 md:col-offset-3">
                    <Card>
                        <div className="text-center mb-4">
                            <i
                                className="pi pi-qrcode text-primary"
                                style={{ fontSize: "4rem" }}
                            ></i>
                            <h2 className="text-900 text-xl mt-3">
                                Scan Barcode
                            </h2>
                            <p className="text-500">
                                Scan or type barcode to find item
                            </p>
                        </div>

                        {flash?.error && (
                            <div className="p-3 mb-3 border-round bg-red-100 text-red-700 text-center">
                                {flash.error}
                            </div>
                        )}

                        {/* 🔍 Input */}
                        <div className="field">
                            <label className="font-medium block mb-2">
                                Barcode
                            </label>

                            <InputText
                                ref={inputRef}
                                value={barcode}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setBarcode(value);

                                    if (value.length >= 8) {
                                        handleScan();
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleScan();
                                    }
                                }}
                                placeholder="Scan barcode..."
                                className="w-full text-center text-xl"
                                autoFocus
                                disabled={loading}
                            />
                        </div>

                        {loading && (
                            <div className="text-center mt-3 text-primary">
                                Searching...
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
