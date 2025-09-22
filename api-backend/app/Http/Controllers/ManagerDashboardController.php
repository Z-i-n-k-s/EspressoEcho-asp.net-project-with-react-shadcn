<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\Order;
use App\Models\OfflineOrder;
use App\Models\OrderItem;
use App\Models\BranchInventory;
use App\Models\Product;
use Carbon\Carbon;

class ManagerDashboardController extends Controller
{
    public function getManagerDashboardData(Request $request)
    {
        // Get the authenticated user
        $user = $request->attributes->get('user');

        // Find the employee record for this user
        $employee = Employee::where('user_id', $user->id)->first();

        if (!$employee) {
            return response()->json(['error' => 'Employee record not found'], 404);
        }

        // Get the branch this manager is assigned to
        $branch = Branch::find($employee->branch_id);

        if (!$branch) {
            return response()->json(['error' => 'Branch not found'], 404);
        }

        // Daily Sales (for today)
        $today = Carbon::today();
        $tomorrow = Carbon::tomorrow();

        // Online sales through delivery_assignments
        $onlineDailySales = DB::table('orders')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->where('employees.branch_id', $branch->id)
            ->where('orders.order_status', 'delivered')
            ->whereBetween('orders.placed_at', [$today, $tomorrow])
            ->sum('orders.total_amount');

        $offlineDailySales = OfflineOrder::where('branch_id', $branch->id)
            ->whereBetween('created_at', [$today, $tomorrow])
            ->sum('total_amount');

        $dailySales = $onlineDailySales + $offlineDailySales;

        // Orders Completed (for today)
        // Online orders through delivery_assignments
        $onlineOrdersCompleted = DB::table('orders')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->where('employees.branch_id', $branch->id)
            ->where('orders.order_status', 'delivered')
            ->whereBetween('orders.placed_at', [$today, $tomorrow])
            ->count();

        $offlineOrdersCompleted = OfflineOrder::where('branch_id', $branch->id)
            ->whereBetween('created_at', [$today, $tomorrow])
            ->count();

        $ordersCompleted = $onlineOrdersCompleted + $offlineOrdersCompleted;

        // Average Order Time (for completed orders today)
        // Online orders through delivery_assignments
        $onlineOrders = DB::table('orders')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->where('employees.branch_id', $branch->id)
            ->where('orders.order_status', 'delivered')
            ->whereBetween('orders.placed_at', [$today, $tomorrow])
            ->whereNotNull('orders.placed_at')
            ->whereNotNull('orders.completed_at')
            ->select('orders.*')
            ->get();

        $totalTime = 0;
        $count = 0;

        foreach ($onlineOrders as $order) {
            $placedAt = Carbon::parse($order->placed_at);
            $completedAt = Carbon::parse($order->completed_at);
            $totalTime += $placedAt->diffInSeconds($completedAt);
            $count++;
        }

        $avgOrderTime = $count > 0 ? gmdate('i\m s\s', $totalTime / $count) : '0m 0s';

        // Top Products (for today)
        // Online order items through delivery_assignments
        $onlineOrderItems = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->where('employees.branch_id', $branch->id)
            ->where('orders.order_status', 'delivered')
            ->whereBetween('orders.placed_at', [$today, $tomorrow])
            ->select('order_items.product_id', DB::raw('SUM(order_items.quantity) as total_quantity'))
            ->groupBy('order_items.product_id')
            ->orderBy('total_quantity', 'desc')
            ->first();

        $offlineOrderItems = DB::table('offline_order_items')
            ->join('offline_orders', 'offline_order_items.offline_order_id', '=', 'offline_orders.id')
            ->where('offline_orders.branch_id', $branch->id)
            ->whereBetween('offline_orders.created_at', [$today, $tomorrow])
            ->select('offline_order_items.product_id', DB::raw('SUM(offline_order_items.quantity) as total_quantity'))
            ->groupBy('offline_order_items.product_id')
            ->orderBy('total_quantity', 'desc')
            ->first();

        $topProduct = null;

        // Determine which product sold more
        if ($onlineOrderItems && $offlineOrderItems) {
            if ($onlineOrderItems->total_quantity > $offlineOrderItems->total_quantity) {
                $topProduct = Product::find($onlineOrderItems->product_id);
            } else {
                $topProduct = Product::find($offlineOrderItems->product_id);
            }
        } elseif ($onlineOrderItems) {
            $topProduct = Product::find($onlineOrderItems->product_id);
        } elseif ($offlineOrderItems) {
            $topProduct = Product::find($offlineOrderItems->product_id);
        }

        // Sales Overview (last 7 days)
        $salesOverview = [];
        $daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $startOfDay = $date->copy()->startOfDay();
            $endOfDay = $date->copy()->endOfDay();

            // Online sales through delivery_assignments
            $dayOnlineSales = DB::table('orders')
                ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
                ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
                ->where('employees.branch_id', $branch->id)
                ->where('orders.order_status', 'delivered')
                ->whereBetween('orders.placed_at', [$startOfDay, $endOfDay])
                ->sum('orders.total_amount');

            $dayOfflineSales = OfflineOrder::where('branch_id', $branch->id)
                ->whereBetween('created_at', [$startOfDay, $endOfDay])
                ->sum('total_amount');

            // Shift Sunday(0) to index 6 so Monday = 0, Sunday = 6
            $index = ($date->dayOfWeek + 6) % 7;

            $salesOverview[] = [
                'day' => $daysOfWeek[$index],
                'sales' => $dayOnlineSales + $dayOfflineSales,
            ];
        }

        // Low Stock Alerts (for this branch)
        $lowStockAlerts = BranchInventory::with('product')
            ->where('branch_id', $branch->id)
            ->whereRaw('quantity_on_hand <= reorder_level')
            ->get()
            ->map(function ($item) {
                return [
                    'product' => $item->product->name,
                    'quantity' => $item->quantity_on_hand
                ];
            });

        // Today's Orders (both online and offline)
        // Online orders through delivery_assignments
        $todaysOnlineOrders = DB::table('orders')
            ->join('delivery_assignments', 'orders.id', '=', 'delivery_assignments.order_id')
            ->join('employees', 'delivery_assignments.staff_id', '=', 'employees.id')
            ->where('employees.branch_id', $branch->id)
            ->whereBetween('orders.placed_at', [$today, $tomorrow])
            ->select('orders.*')
            ->get();

        $todaysOfflineOrders = OfflineOrder::where('branch_id', $branch->id)
            ->whereBetween('created_at', [$today, $tomorrow])
            ->with(['cashier.user', 'offlineOrderItems.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Format orders for response
        $formattedOnlineOrders = $todaysOnlineOrders->map(function ($order) {
            return [
                'id' => $order->id,
                'type' => 'online',
                'status' => $order->order_status,
                'total_amount' => $order->total_amount,
                'placed_at' => $order->placed_at,
                // Note: Customer information would need to be fetched separately
                'customer_name' => 'Customer', // This would need to be adjusted
            ];
        });

        $formattedOfflineOrders = $todaysOfflineOrders->map(function ($order) {
            return [
                'id' => $order->id,
                'type' => 'offline',
                'status' => 'completed', // Offline orders are always completed
                'total_amount' => $order->total_amount,
                'cashier_name' => $order->cashier->user->full_name ?? 'Unknown',
                'created_at' => $order->created_at,
                'items' => $order->offlineOrderItems->map(function ($item) {
                    return [
                        'product_name' => $item->product->name ?? 'Unknown',
                        'quantity' => $item->quantity,
                        'price' => $item->unit_price
                    ];
                })
            ];
        });

        // Combine and sort all orders by date
        $allOrders = $formattedOnlineOrders->concat($formattedOfflineOrders)
            ->sortByDesc(function ($order) {
                return $order['type'] === 'online' ? $order['placed_at'] : $order['created_at'];
            })
            ->values();

        return response()->json([
            'branch' => $branch->name,
            'daily_sales' => $dailySales,
            'orders_completed' => $ordersCompleted,
            'avg_order_time' => $avgOrderTime,
            'top_product' => $topProduct ? $topProduct->name : 'No sales today',
            'sales_overview' => $salesOverview,
            'low_stock_alerts' => $lowStockAlerts,
            'todays_orders' => $allOrders
        ]);
    }
}