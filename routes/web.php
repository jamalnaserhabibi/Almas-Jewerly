<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GoldItemController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SaleController;
   
use App\Http\Controllers\CompanyController;
 

// Redirect root to login page
Route::get('/', function () {
    return redirect()->route('login');
});

// Make dashboard require authentication
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})
->middleware(['auth', 'verified'])
->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Users  routes
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    

    // Company  routes
    Route::get('/companies', [CompanyController::class, 'index'])->name('companies.index');
    Route::post('/companies', [CompanyController::class, 'store'])->name('companies.store');
    Route::put('/companies/{company}', [CompanyController::class, 'update'])->name('companies.update');
    Route::delete('/companies/{company}', [CompanyController::class, 'destroy'])->name('companies.destroy');
 
    
    

    // Gold Items routes - ORDER MATTERS! Put routes WITHOUT parameters FIRST
Route::get('/gold-items', [GoldItemController::class, 'index'])->name('gold-items.index');
Route::post('/gold-items', [GoldItemController::class, 'store'])->name('gold-items.store');

// Scan routes (no parameters)
Route::get('/gold-items/scan', [GoldItemController::class, 'scan'])->name('gold-items.scan');
Route::post('/gold-items/scan/search', [GoldItemController::class, 'search'])->name('gold-items.scan.search');

// Routes WITH parameters - put these AFTER all non-parameter routes
Route::get('/gold-items/{goldItem}/print', [GoldItemController::class, 'printBarcode'])->name('gold-items.print');
Route::put('/gold-items/{goldItem}', [GoldItemController::class, 'update'])->name('gold-items.update');
Route::delete('/gold-items/{goldItem}', [GoldItemController::class, 'destroy'])->name('gold-items.destroy');
 
Route::get('/gold-items/{goldItem}', [GoldItemController::class, 'show'])->name('gold-items.show');



//customers
 Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::put('/customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');

//sales
     Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
    Route::get('/sales/create/{goldItem}', [SaleController::class, 'createForItem'])->name('sales.create');
    Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
    Route::get('/sales/{sale}', [SaleController::class, 'show'])->name('sales.show');
    Route::delete('/sales/{sale}', [SaleController::class, 'destroy'])->name('sales.destroy');



    // All Items routes
Route::get('/all-items', [GoldItemController::class, 'indexOfAll'])->name('all-items.index');
// Route::get('/all-items/{goldItem}', [GoldItemController::class, 'show'])->name('all-items.show');


});

Route::get('/uikit/button', function () {
    return Inertia::render('main/uikit/button/page');
})
->middleware(['auth'])
->name('button');

require __DIR__.'/auth.php';