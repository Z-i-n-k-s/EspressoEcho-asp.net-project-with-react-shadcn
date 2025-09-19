<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployeeController;


require __DIR__.'/auth_api.php';
require __DIR__.'/branch_api.php';
require __DIR__.'/employee_api.php';
require __DIR__.'/category_api.php';
require __DIR__.'/product_api.php';
require __DIR__.'/toppings_api.php';
require __DIR__.'/promotions_api.php';
require __DIR__.'/inventory_api.php';
require __DIR__.'/inventory_transfer_api.php';
require __DIR__.'/customer_order_api.php';
require __DIR__.'/offline_order_api.php';
require __DIR__.'/branch_announcement_api.php';
require __DIR__.'/feedback_api.php';
require __DIR__.'/feedback_reply_api.php';
require __DIR__.'/product_review_api.php';


// -------------------------
// Test Routes
// -------------------------

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});







