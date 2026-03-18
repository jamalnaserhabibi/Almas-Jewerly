<?php

namespace App\Http\Controllers;

use App\Models\GoldItem;
use App\Models\Company;
use App\Models\Karat;
use App\Services\BarcodeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GoldItemController extends Controller
{
    protected $barcodeService;

    public function __construct(BarcodeService $barcodeService)
    {
        $this->barcodeService = $barcodeService;
    }

       public function indexOfAll(Request $request)
    {
        $search = $request->input('search');
        
        $items = GoldItem::with(['company', 'karat', 'sale.customer']) // Load sale and customer
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('barcode', 'like', "%{$search}%")
                      ->orWhere('individual_name', 'like', "%{$search}%")
                      ->orWhereHas('company', function ($q2) use ($search) {
                          $q2->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('GoldItems/AllIndex', [
            'items' => $items,
            'filters' => [
                'search' => $search,
            ],
            'companies' => Company::orderBy('name')->get(),
            'karats' => Karat::orderBy('purity', 'desc')->get(),
        ]);
    }
 
    public function index(Request $request)
    {
        $search = $request->input('search');
        
      $items = GoldItem::with(['company', 'karat'])
    ->whereDoesntHave('sale') // <-- only items without a sale
    ->when($search, function ($query, $search) {
        $query->where('barcode', 'like', "%{$search}%")
              ->orWhere('individual_name', 'like', "%{$search}%")
              ->orWhereHas('company', function ($q) use ($search) {
                  $q->where('name', 'like', "%{$search}%");
              });
    })
    ->orderBy('created_at', 'desc')
    ->paginate(10)
    ->withQueryString();
       
        return Inertia::render('GoldItems/Index', [
            'items' => $items,
            'filters' => [
                'search' => $search,
            ],
            'companies' => Company::orderBy('name')->get(),
            'karats' => Karat::orderBy('purity', 'desc')->get(),
        ]);
    }


 public function store(Request $request)
{
    $rules = [
        'source_type' => 'required|in:company,individual',
        'weight' => 'required|numeric|min:0.01',
        'karat_id' => 'required|exists:karats,id',
        'purchase_date' => 'required|date',
        'notes' => 'nullable|string',
        'photo' => 'nullable|image|max:2048',
    ];

    if ($request->source_type === 'company') {
        $rules['company_id'] = 'required|exists:companies,id';
        $rules['fee'] = 'nullable|numeric|min:0';
        // No price fields for company
    } else {
        $rules['individual_name'] = 'required|string|max:255';
        $rules['acidic_average'] = 'required|numeric|min:0|max:100';
        $rules['unit_price'] = 'required|numeric|min:0'; // Only individuals have price
    }

    $validated = $request->validate($rules);

    if ($request->source_type === 'company') {
        $validated['individual_name'] = null;
        $validated['acidic_average'] = null;
        $validated['unit_price'] = null;
    } else {
        $validated['company_id'] = null;
        $validated['fee'] = null;
    }

    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('gold-items', 'public');
        $validated['photo'] = $path;
    }

    $goldItem = GoldItem::create($validated);

    try {
        $barcodePath = $this->barcodeService->saveBarcodeSVG(
            $goldItem->barcode,
            'gold_' . $goldItem->id
        );
        $goldItem->update(['barcode_image' => $barcodePath]);
    } catch (\Exception $e) {
        \Log::error('Barcode generation failed: ' . $e->getMessage());
    }

    return redirect()->back()->with('success', 'Gold item added successfully');
}

/**
 * Update a gold item
 */
public function update(Request $request, GoldItem $goldItem)
{
    $rules = [
        'source_type' => 'required|in:company,individual',
        'weight' => 'required|numeric|min:0.001',
        'karat_id' => 'required|exists:karats,id',
        'unit_price' => 'required|numeric|min:0',
        'purchase_date' => 'required|date',
        'notes' => 'nullable|string',
        'photo' => 'nullable|image|max:2048',
    ];

    if ($request->source_type === 'company') {
        $rules['company_id'] = 'required|exists:companies,id';
        $rules['fee'] = 'nullable|numeric|min:0';
    } else {
        $rules['individual_name'] = 'required|string|max:255';
        $rules['acidic_average'] = 'required|numeric|min:0|max:100';
    }

    $validated = $request->validate($rules);

    if ($request->source_type === 'company') {
        $validated['individual_name'] = null;
        $validated['acidic_average'] = null;
    } else {
        $validated['company_id'] = null;
        $validated['fee'] = null;
    }

    $validated['total_price'] = $validated['weight'] * $validated['unit_price'];

    if ($request->hasFile('photo')) {
        if ($goldItem->photo) {
            $oldPhotoPath = storage_path('app/public/' . $goldItem->photo);
            if (file_exists($oldPhotoPath)) {
                unlink($oldPhotoPath);
            }
        }
        
        $path = $request->file('photo')->store('gold-items', 'public');
        $validated['photo'] = $path;
    }

    $goldItem->update($validated);

    // Always regenerate SVG barcode on update
    try {
     
       
        
        // Generate new SVG
        $barcodePath = $this->barcodeService->saveBarcodeSVG(
            $goldItem->barcode, 
            'gold_' . $goldItem->id
        );
        
        // Only update if different from current
        if ($goldItem->barcode_image !== $barcodePath) {
            $goldItem->update(['barcode_image' => $barcodePath]);
        }
    } catch (\Exception $e) {
        \Log::error('Barcode regeneration failed: ' . $e->getMessage());
    }

    return redirect()->back()
        ->with('success', 'Gold item updated successfully');
}
 
  
    
    public function destroy(GoldItem $goldItem)
    {
       
        if ($goldItem->barcode_image && file_exists(public_path($goldItem->barcode_image))) {
            unlink(public_path($goldItem->barcode_image));
        }

      
        if ($goldItem->photo && file_exists(storage_path('app/public/' . $goldItem->photo))) {
            unlink(storage_path('app/public/' . $goldItem->photo));
        }

        $goldItem->delete();

        return redirect()->back()
            ->with('success', 'Gold item deleted successfully');
    }

    
    public function printBarcode(GoldItem $goldItem)
    {
        return Inertia::render('GoldItems/PrintBarcode', [
            'item' => $goldItem->load(['company', 'karat'])
        ]);
    }

   public function scan()
{
    return Inertia::render('GoldItems/Scan');
}

// Handle barcode search
public function search(Request $request)
{
    $request->validate([
        'barcode' => 'required|string',
    ]);

    $barcode = $request->barcode;

    $item = GoldItem::where('barcode', $barcode)->first();

    if ($item) {
        return redirect()->route('gold-items.show', $item->id);
    }

   return redirect()->back()->with([
    'error' => 'Item not found'
]);
}

     
    public function show(GoldItem $goldItem)
    {
        return Inertia::render('GoldItems/Show', [
            'item' => $goldItem->load(['company', 'karat'])
        ]);
    }
}