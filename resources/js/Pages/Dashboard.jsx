import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import React, { useContext, useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { LayoutContext } from "@/Layouts/layout/context/layoutcontext";
import Layout from "@/Layouts/layout/layout.jsx";

const Dashboard = () => {
    const { stats, filters } = usePage().props;
    const { layoutConfig } = useContext(LayoutContext);

    const [startDate, setStartDate] = useState(new Date(filters.start_date));
    const [endDate, setEndDate] = useState(new Date(filters.end_date));
    const [chartOptions, setChartOptions] = useState({});

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "AFN",
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Apply date filter
    const applyDateFilter = () => {
        router.get(
            "/dashboard",
            {
                start_date: startDate.toISOString().split("T")[0],
                end_date: endDate.toISOString().split("T")[0],
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // Chart data
    const monthlyChartData = {
        labels: stats.monthly_sales.map((item) => item.month),
        datasets: [
            {
                label: "Revenue",
                data: stats.monthly_sales.map((item) => item.revenue),
                fill: true,
                backgroundColor: "rgba(79, 172, 254, 0.2)",
                borderColor: "#4facfe",
                tension: 0.4,
                pointBackgroundColor: "#4facfe",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#4facfe",
            },
        ],
    };

    // Apply theme for chart
    useEffect(() => {
        const options = {
            plugins: {
                legend: {
                    labels: {
                        color:
                            layoutConfig.colorScheme === "light"
                                ? "#495057"
                                : "#ebedef",
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Revenue: ${formatCurrency(context.raw)}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color:
                            layoutConfig.colorScheme === "light"
                                ? "#495057"
                                : "#ebedef",
                    },
                    grid: {
                        color:
                            layoutConfig.colorScheme === "light"
                                ? "#ebedef"
                                : "rgba(160, 167, 181, .3)",
                    },
                },
                y: {
                    ticks: {
                        color:
                            layoutConfig.colorScheme === "light"
                                ? "#495057"
                                : "#ebedef",
                        callback: function (value) {
                            return formatCurrency(value);
                        },
                    },
                    grid: {
                        color:
                            layoutConfig.colorScheme === "light"
                                ? "#ebedef"
                                : "rgba(160, 167, 181, .3)",
                    },
                },
            },
        };
        setChartOptions(options);
    }, [layoutConfig.colorScheme]);

    return (
        <Layout>
            {/* Date Range Filter */}
            <div className="grid">
                <div className="col-12">
                    <Card className="mb-4">
                        <div className="flex justify-content-between align-items-center flex-wrap gap-3">
                            <div>
                                <h3 className="text-900 font-bold m-0">
                                    Dashboard Overview
                                </h3>
                                <p className="text-600 mt-1">
                                    Gold inventory and sales analytics
                                </p>
                            </div>
                            <div className="flex gap-3 align-items-center">
                                <div className="flex gap-2 align-items-center">
                                    <label className="font-medium">From:</label>
                                    <Calendar
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.value)}
                                        dateFormat="yy-mm-dd"
                                        showIcon
                                    />
                                </div>
                                <div className="flex gap-2 align-items-center">
                                    <label className="font-medium">To:</label>
                                    <Calendar
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.value)}
                                        dateFormat="yy-mm-dd"
                                        showIcon
                                    />
                                </div>
                                <Button
                                    label="Apply Filter"
                                    icon="pi pi-filter"
                                    onClick={applyDateFilter}
                                    severity="info"
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Stats Cards Row 1 */}
            <div className="grid">
                <div className="col-12 md:col-6 lg:col-3">
                    <Card className="shadow-2">
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 text-sm">
                                    Total Items
                                </div>
                                <div className="text-3xl font-bold mt-2">
                                    {stats.total_gold_items}
                                </div>
                                <div className="text-green-500 text-sm mt-2">
                                    In Stock: {stats.total_in_stock}
                                </div>
                            </div>
                            <i className="pi pi-database text-4xl text-blue-500 opacity-60"></i>
                        </div>
                    </Card>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <Card className="shadow-2">
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 text-sm">
                                    Items Sold
                                </div>
                                <div className="text-3xl font-bold mt-2">
                                    {stats.total_sold_items}
                                </div>
                                <div className="text-blue-500 text-sm mt-2">
                                    Revenue:{" "}
                                    {formatCurrency(stats.sales_revenue)}
                                </div>
                            </div>
                            <i className="pi pi-chart-line text-4xl text-green-500 opacity-60"></i>
                        </div>
                    </Card>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <Card className="shadow-2">
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 text-sm">
                                    Customers
                                </div>
                                <div className="text-3xl font-bold mt-2">
                                    {stats.total_customers}
                                </div>
                                <div className="text-orange-500 text-sm mt-2">
                                    Companies: {stats.total_companies}
                                </div>
                            </div>
                            <i className="pi pi-users text-4xl text-purple-500 opacity-60"></i>
                        </div>
                    </Card>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <Card className="shadow-2">
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <div className="text-500 text-sm">
                                    Period Activity
                                </div>
                                <div className="text-xl font-bold mt-2">
                                    Purchased: {stats.purchased_items}
                                </div>
                                <div className="text-xl font-bold">
                                    Sold: {stats.sold_items}
                                </div>
                            </div>
                            <i className="pi pi-calendar text-4xl text-red-500 opacity-60"></i>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="col-12">
                <Card className="shadow-2">
                    <div className="flex justify-content-between align-items-center mb-4">
                        <h4 className="text-900 font-bold m-0">
                            Total Weight by Karat
                        </h4>
                        <div className="bg-primary-50 p-2 px-3 border-round">
                            <span className="text-primary font-bold text-xl">
                                Grand Total:{" "}
                                {stats.weight_per_karat
                                    .reduce((sum, k) => sum + k.total_weight, 0)
                                    .toFixed(2)}
                                g
                            </span>
                        </div>
                    </div>
                    <div className="grid">
                        {stats.weight_per_karat.map((karat, idx) => {
                            const totalWeight = stats.weight_per_karat.reduce(
                                (sum, k) => sum + k.total_weight,
                                0,
                            );
                            const percentage =
                                totalWeight > 0
                                    ? (
                                          (karat.total_weight / totalWeight) *
                                          100
                                      ).toFixed(1)
                                    : 0;

                            return (
                                <div
                                    key={idx}
                                    className="col-12 md:col-6 lg:col-4 xl:col-3 mb-3"
                                >
                                    <div className="p-4 border-round-xl shadow-1 surface-card hover:shadow-3 transition-all">
                                        <div className="flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <div className="text-2xl font-bold text-primary">
                                                    {karat.name}
                                                </div>
                                                <div className="text-sm text-500">
                                                    {/* Purity: {karat.purity}% */}
                                                </div>
                                            </div>
                                            <i className="pi pi-chart-line text-3xl text-primary opacity-50"></i>
                                        </div>
                                        <div className="text-3xl font-bold text-900 mb-2">
                                            {karat.total_weight.toFixed(2)}
                                            <span className="text-sm text-500 ml-1">
                                                grams
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <div
                                                className="w-full bg-gray-200 border-round overflow-hidden"
                                                style={{ height: "8px" }}
                                            >
                                                <div
                                                    className="bg-primary h-full"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                            <div className="text-right text-xs text-500 mt-1">
                                                {percentage}% of total
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Sales Chart */}
            <div className="grid">
                <div className="col-12">
                    <Card className="shadow-2">
                        <h4 className="text-900 font-bold mb-3">
                            Monthly Sales Revenue
                        </h4>
                        <Chart
                            type="line"
                            data={monthlyChartData}
                            options={chartOptions}
                            height="300px"
                        />
                    </Card>
                </div>
            </div>

            {/* Recent Sales Table */}
            <div className="grid">
                <div className="col-12">
                    <Card className="shadow-2">
                        <h4 className="text-900 font-bold mb-3">
                            Recent Sales
                        </h4>
                        <DataTable
                            value={stats.recent_sales}
                            stripedRows
                            showGridlines
                            className="p-datatable-sm"
                        >
                            <Column
                                field="date"
                                header="Date"
                                sortable
                                style={{ width: "12%" }}
                            />
                            <Column
                                field="barcode"
                                header="Barcode"
                                sortable
                                style={{ width: "15%" }}
                            />
                            <Column
                                field="karat"
                                header="Karat"
                                style={{ width: "8%" }}
                            />
                            <Column
                                field="weight"
                                header="Weight"
                                body={(row) => `${row.weight}g`}
                                style={{ width: "8%" }}
                            />
                            <Column
                                field="unit_price"
                                header="Unit Price"
                                body={(row) => formatCurrency(row.unit_price)}
                                style={{ width: "10%" }}
                            />
                            <Column
                                field="total"
                                header="Total"
                                body={(row) => formatCurrency(row.total)}
                                style={{ width: "12%" }}
                            />
                            <Column
                                field="customer"
                                header="Customer"
                                sortable
                                style={{ width: "20%" }}
                            />
                        </DataTable>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
