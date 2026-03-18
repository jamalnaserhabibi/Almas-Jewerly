<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{


    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $customers = Customer::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('contact', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a new customer
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'info' => 'nullable|string',
        ]);

        Customer::create($validated);

        return redirect()->back()
            ->with('success', 'Customer created successfully');
    }

    /**
     * Update a customer
     */
    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'info' => 'nullable|string',
        ]);

        $customer->update($validated);

        return redirect()->back()
            ->with('success', 'Customer updated successfully');
    }

    /**
     * Delete a customer
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->back()
            ->with('success', 'Customer deleted successfully');
    }
}