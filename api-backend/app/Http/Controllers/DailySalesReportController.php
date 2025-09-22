<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Employee;
use App\Models\Order;
use App\Models\OfflineOrder;
use App\Models\OrderItem;
use App\Models\OfflineOrderItem;
use App\Models\Product;
use Carbon\Carbon;
use stdClass;

class DailySalesReportController extends Controller
{
    public function getDailySalesReport(Request $request)
    {
        // Get the authenticated user
        $user = $request->attributes->get('user');
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        // Validate and get date from request
        $request->validate([
            'date' => 'sometimes|date_format:Y-m-d|before_or_equal:today'
        ]);
        
        // Check if validation failed
        if ($request->has('date') && !$this->isValidDate($request->input('date'))) {
            return response()->json(['error' => 'Invalid date provided'], 422);
        }
        
        // Get date or use today, ensuring it's not future
        $date = $request->input('date', Carbon::today()->toDateString());
        
        // Additional check to prevent future dates
        if (Carbon::parse($date)->isFuture()) {
            return response()->json(['error' => 'Future dates are not allowed.'], 422);
        }
        
        // Find the employee record for this user
        $employee = Employee::where('user_id', $user->id)->first();
        
        if (!$employee) {
            return response()->json(['error' => 'Employee record not found'], 404);
        }
        
        // Get the branch this manager is assigned to
        $branchId = $employee->branch_id;
        
        if (!$branchId) {
            return response()->json(['error' => 'Branch not found'], 404);
        }
        
        $startOfDay = Carbon::parse($date)->startOfDay();
        $endOfDay = Carbon::parse($date)->endOfDay();
        
        // Calculate total sales for the day
        // Online sales through delivery_assignments
        $onlineSales = DB::table('orders')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->where('employees.branch_id', $branchId)
            ->where('orders.order_status', 'delivered')
            ->whereBetween('orders.placed_at', [$startOfDay, $endOfDay])
            ->sum('orders.total_amount');
            
        $offlineSales = OfflineOrder::where('branch_id', $branchId)
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->sum('total_amount');
            
        $totalSales = $onlineSales + $offlineSales;
        
        // Calculate total profit (assuming 34% profit margin based on the example)
        $profitMargin = 0.34; // 34% profit margin
        $totalProfit = $totalSales * $profitMargin;
        
        // Calculate percentage of target (assuming a target of $2950 based on the example)
        $dailyTarget = 2950;
        $salesPercentage = $dailyTarget > 0 ? ($totalSales / $dailyTarget) * 100 : 0;
        
        // Get product breakdown
        $productBreakdown = $this->getProductBreakdown($branchId, $startOfDay, $endOfDay);
        
        // Prepare data for the chart
        $chartData = [];
        foreach ($productBreakdown as $product) {
            $chartItem = new stdClass();
            $chartItem->name = $product->product_name;
            $chartItem->sales = $product->sales;
            $chartData[] = $chartItem;
        }
        
        // Create response object
        $response = new stdClass();
        $response->date = $date;
        $response->total_sales = round($totalSales, 2);
        $response->total_profit = round($totalProfit, 2);
        $response->sales_percentage = round($salesPercentage, 1);
        $response->product_breakdown = $productBreakdown;
        $response->chart_data = $chartData;
        
        return response()->json($response);
    }
    
    private function getProductBreakdown($branchId, $startOfDay, $endOfDay)
    {
        // Get online order items through delivery_assignments
        $onlineItems = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->where('employees.branch_id', $branchId)
            ->where('orders.order_status', 'delivered')
            ->whereBetween('orders.placed_at', [$startOfDay, $endOfDay])
            ->select(
                'order_items.product_id',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('COUNT(DISTINCT orders.customer_id) as customer_count'),
                DB::raw('SUM(order_items.total_price) as total_sales')
            )
            ->groupBy('order_items.product_id')
            ->get();
            
        // Get offline order items
        $offlineItems = OfflineOrderItem::join('offline_orders', 'offline_order_items.offline_order_id', '=', 'offline_orders.id')
            ->where('offline_orders.branch_id', $branchId)
            ->whereBetween('offline_orders.created_at', [$startOfDay, $endOfDay])
            ->select(
                'offline_order_items.product_id',
                DB::raw('SUM(offline_order_items.quantity) as total_quantity'),
                DB::raw('COUNT(DISTINCT offline_orders.id) as customer_count'),
                DB::raw('SUM(offline_order_items.total_price) as total_sales')
            )
            ->groupBy('offline_order_items.product_id')
            ->get();
            
        // Combine results
        $combinedResults = [];
        
        // Process online items
        foreach ($onlineItems as $item) {
            $productId = $item->product_id;
            if (!isset($combinedResults[$productId])) {
                $combinedResults[$productId] = [
                    'product_id' => $productId,
                    'total_quantity' => 0,
                    'customer_count' => 0,
                    'total_sales' => 0
                ];
            }
            
            $combinedResults[$productId]['total_quantity'] += $item->total_quantity;
            $combinedResults[$productId]['customer_count'] += $item->customer_count;
            $combinedResults[$productId]['total_sales'] += $item->total_sales;
        }
        
        // Process offline items
        foreach ($offlineItems as $item) {
            $productId = $item->product_id;
            if (!isset($combinedResults[$productId])) {
                $combinedResults[$productId] = [
                    'product_id' => $productId,
                    'total_quantity' => 0,
                    'customer_count' => 0,
                    'total_sales' => 0
                ];
            }
            
            $combinedResults[$productId]['total_quantity'] += $item->total_quantity;
            $combinedResults[$productId]['customer_count'] += $item->customer_count;
            $combinedResults[$productId]['total_sales'] += $item->total_sales;
        }
        
        // Get product names and format results
        $productIds = array_keys($combinedResults);
        $products = Product::whereIn('id', $productIds)->pluck('name', 'id');
        
        $formattedResults = [];
        foreach ($combinedResults as $productId => $data) {
            $product = new stdClass();
            $product->product_name = $products[$productId] ?? 'Unknown Product';
            $product->quantity_sold = $data['total_quantity'];
            $product->customers = $data['customer_count'];
            $product->sales = round($data['total_sales'], 2);
            $formattedResults[] = $product;
        }
        
        return $formattedResults;
    }
    
    /**
     * Validate if a date string is a valid date and not in the future
     *
     * @param string $date
     * @return bool
     */
    private function isValidDate($date)
    {
        try {
            $parsedDate = Carbon::parse($date);
            return $parsedDate->isPast() || $parsedDate->isToday();
        } catch (\Exception $e) {
            return false;
        }
    }
}