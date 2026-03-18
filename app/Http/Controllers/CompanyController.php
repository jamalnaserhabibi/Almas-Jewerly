<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
     
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $companies = Company::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%")
                      ->orWhere('info', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }


    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'info' => 'nullable|string',
        ]);

        Company::create($validated);

        return redirect()->back()
            ->with('success', 'Company created successfully.');
    }

  
    
    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'info' => 'nullable|string',
        ]);

        $company->update($validated);

        return redirect()->back()
            ->with('success', 'Company updated successfully.');
    }

  
    
    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()->back()
            ->with('success', 'Company deleted successfully.');
    }
}