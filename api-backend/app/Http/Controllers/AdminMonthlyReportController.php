<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Branch;
use App\Models\Order;
use App\Models\OfflineOrder;
use App\Models\OrderItem;
use App\Models\OfflineOrderItem;
use App\Models\Product;
use Carbon\Carbon;
use stdClass;

class AdminMonthlyReportController extends Controller
{
    public function getMonthlyReport(Request $request)
    {
        // Validate request parameters
        $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'month' => 'required|date_format:Y-m'
        ]);
        
        $branchId = $request->input('branch_id');
        $month = $request->input('month');
        
        // Parse the month and get start and end dates
        $startOfMonth = Carbon::parse($month)->startOfMonth();
        $endOfMonth = Carbon::parse($month)->endOfMonth();
        
        // Get branch details
        $branch = Branch::find($branchId);
        if (!$branch) {
            return response()->json(['error' => 'Branch not found'], 404);
        }
        
        // Calculate total orders
        // Online orders - based on your schema, orders don't have branch_id directly
        // We need to check if there's a relationship or if we need to use delivery_assignments
        $onlineOrdersCount = DB::table('orders')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->where('employees.branch_id', $branchId)
            ->where('orders.order_status', 'delivered')
            ->whereBetween('orders.placed_at', [$startOfMonth, $endOfMonth])
            ->count();
            
        $offlineOrdersCount = OfflineOrder::where('branch_id', $branchId)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();
            
        $totalOrders = $onlineOrdersCount + $offlineOrdersCount;
        
        // Calculate sales
        // Online sales
        $onlineSales = DB::table('orders')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->where('employees.branch_id', $branchId)
            ->where('orders.order_status', 'delivered')
            ->whereBetween('orders.placed_at', [$startOfMonth, $endOfMonth])
            ->sum('orders.total_amount');
            
        $offlineSales = OfflineOrder::where('branch_id', $branchId)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('total_amount');
            
        $totalSales = $onlineSales + $offlineSales;
        
        // Get product breakdown
        $productBreakdown = $this->getProductBreakdown($branchId, $startOfMonth, $endOfMonth);
        
        // Calculate total profit (assuming 50% profit margin based on the example)
        $totalProfit = 0;
        foreach ($productBreakdown as $product) {
            $totalProfit += $product->profit;
        }
        
        // Get sales trend for the last 6 months
        $salesTrend = $this->getSalesTrend($branchId, $month);
        
        // Get additional metrics
        $additionalMetrics = $this->getAdditionalMetrics($branchId, $startOfMonth, $endOfMonth);
        
        // Create response object
        $response = new stdClass();
        $response->branch_name = $branch->name;
        $response->month = Carbon::parse($month)->format('F Y');
        $response->total_orders = $totalOrders;
        $response->online_orders = $onlineOrdersCount;
        $response->offline_orders = $offlineOrdersCount;
        $response->online_sales = round($onlineSales, 2);
        $response->offline_sales = round($offlineSales, 2);
        $response->total_sales = round($totalSales, 2);
        $response->total_profit = round($totalProfit, 2);
        $response->average_order_value = $totalOrders > 0 ? round($totalSales / $totalOrders, 2) : 0;
        $response->product_breakdown = $productBreakdown;
        $response->sales_trend = $salesTrend;
        $response->additional_metrics = $additionalMetrics;
        
        return response()->json($response);
    }
    
    private function getProductBreakdown($branchId, $startOfMonth, $endOfMonth)
    {
        // Get online order items through delivery_assignments
        $onlineItems = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->where('employees.branch_id', $branchId)
            ->where('orders.order_status', 'delivered')
            ->whereBetween('orders.placed_at', [$startOfMonth, $endOfMonth])
            ->select(
                'order_items.product_id',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.total_price) as total_revenue')
            )
            ->groupBy('order_items.product_id')
            ->get();
            
        // Get offline order items
        $offlineItems = DB::table('offline_order_items')
            ->join('offline_orders', 'offline_order_items.offline_order_id', '=', 'offline_orders.id')
            ->where('offline_orders.branch_id', $branchId)
            ->whereBetween('offline_orders.created_at', [$startOfMonth, $endOfMonth])
            ->select(
                'offline_order_items.product_id',
                DB::raw('SUM(offline_order_items.quantity) as total_quantity'),
                DB::raw('SUM(offline_order_items.total_price) as total_revenue')
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
                    'total_revenue' => 0
                ];
            }
            
            $combinedResults[$productId]['total_quantity'] += $item->total_quantity;
            $combinedResults[$productId]['total_revenue'] += $item->total_revenue;
        }
        
        // Process offline items
        foreach ($offlineItems as $item) {
            $productId = $item->product_id;
            if (!isset($combinedResults[$productId])) {
                $combinedResults[$productId] = [
                    'product_id' => $productId,
                    'total_quantity' => 0,
                    'total_revenue' => 0
                ];
            }
            
            $combinedResults[$productId]['total_quantity'] += $item->total_quantity;
            $combinedResults[$productId]['total_revenue'] += $item->total_revenue;
        }
        
        // Get product names and format results
        $productIds = array_keys($combinedResults);
        $products = Product::whereIn('id', $productIds)->pluck('name', 'id');
        
        $formattedResults = [];
        foreach ($combinedResults as $productId => $data) {
            $product = new stdClass();
            $product->product_id = $productId;
            $product->product_name = $products[$productId] ?? 'Unknown Product';
            $product->quantity_sold = $data['total_quantity'];
            $product->revenue = round($data['total_revenue'], 2);
            $product->profit = round($data['total_revenue'] * 0.5, 2); // Assuming 50% profit margin
            $product->average_price = $data['total_quantity'] > 0 ? round($data['total_revenue'] / $data['total_quantity'], 2) : 0;
            $formattedResults[] = $product;
        }
        
        // Sort by revenue descending
        usort($formattedResults, function($a, $b) {
            return $b->revenue - $a->revenue;
        });
        
        return $formattedResults;
    }
    
    private function getSalesTrend($branchId, $month)
    {
        $currentMonth = Carbon::parse($month);
        $salesTrend = [];
        
        // Get data for the last 6 months including the selected month
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = $currentMonth->copy()->subMonths($i);
            $startOfMonth = $monthDate->copy()->startOfMonth();
            $endOfMonth = $monthDate->copy()->endOfMonth();
            
            // Online sales through delivery_assignments
            $onlineSales = DB::table('orders')
                ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
                ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
                ->where('employees.branch_id', $branchId)
                ->where('orders.order_status', 'delivered')
                ->whereBetween('orders.placed_at', [$startOfMonth, $endOfMonth])
                ->sum('orders.total_amount');
                
            $offlineSales = DB::table('offline_orders')
                ->where('branch_id', $branchId)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->sum('total_amount');
                
            $monthData = new stdClass();
            $monthData->month = $monthDate->format('M Y');
            $monthData->online_sales = round($onlineSales, 2);
            $monthData->offline_sales = round($offlineSales, 2);
            $monthData->total_sales = round($onlineSales + $offlineSales, 2);
            
            $salesTrend[] = $monthData;
        }
        
        return $salesTrend;
    }
    
    private function getAdditionalMetrics($branchId, $startOfMonth, $endOfMonth)
    {
        $metrics = new stdClass();
        
        // Get top selling products
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('employees.branch_id', $branchId)
            ->where('orders.order_status', 'delivered')
            ->whereBetween('orders.placed_at', [$startOfMonth, $endOfMonth])
            ->select(
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_quantity')
            )
            ->groupBy('order_items.product_id', 'products.name')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();
            
        $metrics->top_selling_products = $topProducts;
        
        // Get order status distribution
        $orderStatusDistribution = DB::table('orders')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->where('employees.branch_id', $branchId)
            ->whereBetween('orders.placed_at', [$startOfMonth, $endOfMonth])
            ->select(
                'orders.order_status',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('orders.order_status')
            ->get();
            
        $metrics->order_status_distribution = $orderStatusDistribution;
        
        // Get payment method distribution
        $paymentDistribution = DB::table('payments')
            ->join('orders', 'payments.order_id', '=', 'orders.id')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->where('employees.branch_id', $branchId)
            ->where('payments.order_type', 'online')
            ->whereBetween('payments.created_at', [$startOfMonth, $endOfMonth])
            ->select(
                'payments.payment_method',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(payments.amount) as total_amount')
            )
            ->groupBy('payments.payment_method')
            ->get();
            
        $metrics->payment_method_distribution = $paymentDistribution;
        
        return $metrics;
    }
}