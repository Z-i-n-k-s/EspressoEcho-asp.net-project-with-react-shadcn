<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\Order;
use App\Models\OfflineOrder;
use App\Models\Promotion;
use App\Models\BranchInventory;
use App\Models\InventoryTransfer;
use App\Models\Feedback;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function getDashboardData()
    {
        // Total Branches
        $totalBranches = Branch::count();
        
        // Total Employees
        $totalEmployees = Employee::count();
        
        // Total Sales (online + offline)
        $onlineSales = Order::where('order_status', 'delivered')->sum('total_amount');
        $offlineSales = OfflineOrder::sum('total_amount');
        $totalSales = $onlineSales + $offlineSales;
        
        // Active Promotions
        $currentDate = Carbon::now()->toDateString();
        $activePromotions = Promotion::where('is_active', true)
            ->where('valid_from', '<=', $currentDate)
            ->where('valid_to', '>=', $currentDate)
            ->count();
        
        // Weekly Sales Performance (last 4 weeks)
        $weeklySales = [];
        for ($i = 3; $i >= 0; $i--) {
            $startDate = Carbon::now()->subWeeks($i)->startOfWeek();
            $endDate = Carbon::now()->subWeeks($i)->endOfWeek();
            
            $weekOnlineSales = Order::where('order_status', 'delivered')
                ->whereBetween('placed_at', [$startDate, $endDate])
                ->sum('total_amount');
                
            $weekOfflineSales = OfflineOrder::whereBetween('created_at', [$startDate, $endDate])
                ->sum('total_amount');
                
            $weeklySales[] = [
                'week' => 'Week ' . (4 - $i),
                'sales' => $weekOnlineSales + $weekOfflineSales
            ];
        }
        
        // Priority Alerts
        $lowStockAlerts = BranchInventory::with(['branch', 'product'])
            ->whereRaw('quantity_on_hand <= reorder_level')
            ->get()
            ->map(function ($item) {
                return "Low stock: {$item->product->name} ({$item->branch->name})";
            });
            
        $pendingTransfers = InventoryTransfer::with(['fromBranch', 'toBranch'])
            ->where('status', 'pending')
            ->get()
            ->map(function ($transfer) {
                return "Pending transfer: {$transfer->product->name} ({$transfer->fromBranch->name} → {$transfer->toBranch->name})";
            });
            
        $pendingFeedback = Feedback::where('status', 'open')
            ->count();
            
        $priorityAlerts = [
            'low_stock' => $lowStockAlerts,
            'pending_transfers' => $pendingTransfers,
            'pending_feedback' => $pendingFeedback > 0 ? "Feedback pending: {$pendingFeedback} branches" : null
        ];
        
        // Branch Overview
        $branches = Branch::withCount('employees')
            ->get()
            ->map(function ($branch) {
                // Calculate sales for this branch
                $onlineBranchSales = Order::where('branch_id', $branch->id)
                    ->where('order_status', 'delivered')
                    ->sum('total_amount');
                    
                $offlineBranchSales = OfflineOrder::where('branch_id', $branch->id)
                    ->sum('total_amount');
                    
                $totalBranchSales = $onlineBranchSales + $offlineBranchSales;
                
                // Check if branch has active promotions (you might need to adjust this logic)
                $hasPromotion = Promotion::where('is_active', true)
                    ->where('valid_from', '<=', Carbon::now()->toDateString())
                    ->where('valid_to', '>=', Carbon::now()->toDateString())
                    ->exists();
                
                return [
                    'name' => $branch->name,
                    'location' => $branch->address,
                    'employees' => $branch->employees_count,
                    'sales' => $totalBranchSales,
                    'promotion' => $hasPromotion ? 'Yes' : 'No'
                ];
            });
        
        return response()->json([
            'total_branches' => $totalBranches,
            'total_employees' => $totalEmployees,
            'total_sales' => $totalSales,
            'active_promotions' => $activePromotions,
            'weekly_sales' => $weeklySales,
            'priority_alerts' => $priorityAlerts,
            'branch_overview' => $branches
        ]);
    }
}