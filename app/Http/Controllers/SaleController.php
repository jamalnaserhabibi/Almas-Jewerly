<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\GoldItem;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
   
public function index(Request $request)
{
    $search = $request->input('search');
    
    $sales = Sale::with([
        'goldItem.karat',           // Load karat relationship through goldItem
        'goldItem.company',          // Load company relationship through goldItem
        'customer',                  // Load customer
        'seller'                     // Load seller
    ])
    ->when($search, function ($query, $search) {
        $query->where(function ($q) use ($search) {
            $q->whereHas('customer', function ($q2) use ($search) {
                $q2->where('name', 'like', "%{$search}%");
            })
            ->orWhereHas('goldItem', function ($q2) use ($search) {
                $q2->where('barcode', 'like', "%{$search}%");
            });
        });
    })
    ->orderBy('created_at', 'desc')
    ->paginate(10)
    ->withQueryString();

    // Debug: Check if goldItem is loaded
    // \Log::info('Sales data:', $sales->toArray());
// dd($sales);
    return Inertia::render('Sales/Index', [
        'sales' => $sales,
        'filters' => [
            'search' => $search,
        ],
    ]);
}

 public function createForItem(GoldItem $goldItem)
{
    // Debug: Log to see if goldItem exists
    \Log::info('Creating sale for gold item:', ['id' => $goldItem->id, 'exists' => $goldItem ? 'yes' : 'no']);
    
  

    // Check if item is already sold
    $existingSale = Sale::where('gold_item_id', $goldItem->id)->first();
    
    if ($existingSale) {
        return redirect()->route('gold-items.show', $goldItem->id)
            ->with('error', 'This item is already sold');
    }

    $customers = Customer::orderBy('name')->get();

    return Inertia::render('Sales/Create', [
        'goldItem' => $goldItem->load('karat', 'company'),
        'customers' => $customers,
    ]);
}

    /**
     * Store a new sale
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'gold_item_id' => 'required|exists:gold_items,id',
            'customer_id' => 'required|exists:customers,id',
            'unit_price' => 'required|numeric|min:0',
            'sale_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        // Double-check if item is already sold
        $existingSale = Sale::where('gold_item_id', $validated['gold_item_id'])->first();
        
        if ($existingSale) {
            return redirect()->back()->with('error', 'This item is already sold');
        }

        // Add sold_by
        $validated['sold_by'] = auth()->id();

        // Create sale (total_price auto-calculated in model)
        $sale = Sale::create($validated);

        return redirect()->route('sales.index')
            ->with('success', 'Sale completed successfully');
    }

    /**
     * Show sale details
     */
    public function show(Sale $sale)
    {
        $sale->load([
        'goldItem.karat',  // This loads the karat through goldItem
        'goldItem.company',
        'customer',
        'seller'
    ]);

        return Inertia::render('Sales/Show', [
            'sale' => $sale
        ]);
    }
    

    public function destroy(Sale $sale)
{ 

    $sale->delete();

    return redirect()->back()
        ->with('success', 'Sale record deleted successfully');
}
}