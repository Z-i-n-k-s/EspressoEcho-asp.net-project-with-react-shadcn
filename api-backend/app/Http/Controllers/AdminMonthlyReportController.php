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
        $onlineOrdersCount = Order::where('branch_id', $branchId)
            ->where('order_status', 'delivered')
            ->whereBetween('placed_at', [$startOfMonth, $endOfMonth])
            ->count();
            
        $offlineOrdersCount = OfflineOrder::where('branch_id', $branchId)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();
            
        $totalOrders = $onlineOrdersCount + $offlineOrdersCount;
        
        // Calculate sales
        $onlineSales = Order::where('branch_id', $branchId)
            ->where('order_status', 'delivered')
            ->whereBetween('placed_at', [$startOfMonth, $endOfMonth])
            ->sum('total_amount');
            
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
        
        // Create response object
        $response = new stdClass();
        $response->branch_name = $branch->name;
        $response->month = Carbon::parse($month)->format('F Y');
        $response->total_orders = $totalOrders;
        $response->online_sales = round($onlineSales, 2);
        $response->offline_sales = round($offlineSales, 2);
        $response->total_sales = round($totalSales, 2);
        $response->total_profit = round($totalProfit, 2);
        $response->product_breakdown = $productBreakdown;
        $response->sales_trend = $salesTrend;
        
        return response()->json($response);
    }
    
    private function getProductBreakdown($branchId, $startOfMonth, $endOfMonth)
    {
        // Get online order items
        $onlineItems = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.branch_id', $branchId)
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
        $offlineItems = OfflineOrderItem::join('offline_orders', 'offline_order_items.offline_order_id', '=', 'offline_orders.id')
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
            $product->product_name = $products[$productId] ?? 'Unknown Product';
            $product->quantity_sold = $data['total_quantity'];
            $product->revenue = round($data['total_revenue'], 2);
            $product->profit = round($data['total_revenue'] * 0.5, 2); // Assuming 50% profit margin
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
            
            $onlineSales = Order::where('branch_id', $branchId)
                ->where('order_status', 'delivered')
                ->whereBetween('placed_at', [$startOfMonth, $endOfMonth])
                ->sum('total_amount');
                
            $offlineSales = OfflineOrder::where('branch_id', $branchId)
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
}