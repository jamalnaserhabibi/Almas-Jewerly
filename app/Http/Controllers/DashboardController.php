<?php

namespace App\Http\Controllers;

use App\Models\GoldItem;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\Company;
use App\Models\Karat;
use App\Models\JewelryType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Date range filter
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

     // 1. Total weight per karat (only items in stock - not sold)
$weightPerKarat = Karat::withSum(['goldItems' => function($q) {
    $q->whereDoesntHave('sale')  // This excludes sold items
      ->select(DB::raw('COALESCE(SUM(weight), 0)'));
}], 'weight')
->get()
->map(function($karat) {
    return [
        'name' => $karat->name,
        'total_weight' => round($karat->gold_items_sum_weight ?? 0, 2),
        'purity' => $karat->purity
    ];
});

        // 2. Number of items per jewelry type
     $itemsPerType = JewelryType::withCount(['goldItems' => function($q) {
        $q->whereDoesntHave('sale');  // This excludes sold items
    }])
    ->get()
    ->map(function($type) {
        return [
            'name' => $type->name,
            'count' => $type->gold_items_count,
            'info' => $type->info
        ];
    });

        // 3. Sales revenue (from sales table)
        $salesRevenue = Sale::whereBetween('sale_date', [$startDate, $endDate])
            ->with('goldItem')
            ->get()
            ->sum(function($sale) {
                return $sale->goldItem ? $sale->goldItem->weight * $sale->unit_price : 0;
            });

        // 4. Total counts
        $totalCustomers = Customer::count();
        $totalCompanies = Company::count();
        $totalGoldItems = GoldItem::count();
        $totalSoldItems = Sale::count();
        $totalInStock = GoldItem::whereDoesntHave('sale')->count();

        // 5. Purchase and sold items by date range
        $purchasedItems = GoldItem::whereBetween('purchase_date', [$startDate, $endDate])->count();
        $soldItems = Sale::whereBetween('sale_date', [$startDate, $endDate])->count();

        // 6. Monthly sales data for chart (last 12 months)
        $monthlySales = Sale::select(
                DB::raw('YEAR(sale_date) as year'),
                DB::raw('MONTH(sale_date) as month'),
                DB::raw('SUM(gold_items.weight * sales.unit_price) as total')
            )
            ->join('gold_items', 'sales.gold_item_id', '=', 'gold_items.id')
            ->whereBetween('sale_date', [now()->subMonths(11)->startOfMonth(), now()])
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get()
            ->map(function($item) {
                $date = \Carbon\Carbon::create($item->year, $item->month, 1);
                return [
                    'month' => $date->format('M Y'),
                    'revenue' => round($item->total ?? 0, 2)
                ];
            });

        // 7. Top selling jewelry types
        $topJewelryTypes = JewelryType::withCount(['goldItems as sold_count' => function($q) {
                $q->whereHas('sale');
            }])
            ->orderBy('sold_count', 'desc')
            ->take(5)
            ->get()
            ->map(function($type) {
                return [
                    'name' => $type->name,
                    'sold' => $type->sold_count
                ];
            });

        // 8. Recent sales (last 10)
        $recentSales = Sale::with(['goldItem.karat', 'customer'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function($sale) {
                return [
                    'id' => $sale->id,
                    'barcode' => $sale->goldItem->barcode ?? 'N/A',
                    'customer' => $sale->customer->name ?? 'N/A',
                    'weight' => $sale->goldItem->weight ?? 0,
                    'unit_price' => $sale->unit_price,
                    'total' => ($sale->goldItem->weight ?? 0) * $sale->unit_price,
                    'date' => $sale->sale_date->format('Y-m-d'),
                    'karat' => $sale->goldItem->karat->name ?? 'N/A'
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => [
                'weight_per_karat' => $weightPerKarat,
                'items_per_type' => $itemsPerType,
                'sales_revenue' => $salesRevenue,
                'total_customers' => $totalCustomers,
                'total_companies' => $totalCompanies,
                'total_gold_items' => $totalGoldItems,
                'total_sold_items' => $totalSoldItems,
                'total_in_stock' => $totalInStock,
                'purchased_items' => $purchasedItems,
                'sold_items' => $soldItems,
                'monthly_sales' => $monthlySales,
                'top_jewelry_types' => $topJewelryTypes,
                'recent_sales' => $recentSales,
            ],
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }
}