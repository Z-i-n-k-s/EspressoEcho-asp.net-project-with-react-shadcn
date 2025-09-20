<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OfflineOrder;
use Carbon\Carbon;

class AdminSalesController extends Controller
{
    public function getSalesData(Request $request)
    {
        $period = $request->input('period', 'month'); // day, week, month, year
        
        $now = Carbon::now();
        
        switch ($period) {
            case 'day':
                $startDate = $now->startOfDay();
                $endDate = $now->endOfDay();
                break;
            case 'week':
                $startDate = $now->startOfWeek();
                $endDate = $now->endOfWeek();
                break;
            case 'month':
                $startDate = $now->startOfMonth();
                $endDate = $now->endOfMonth();
                break;
            case 'year':
                $startDate = $now->startOfYear();
                $endDate = $now->endOfYear();
                break;
            default:
                $startDate = $now->startOfMonth();
                $endDate = $now->endOfMonth();
        }
        
        $onlineSales = Order::where('order_status', 'delivered')
            ->whereBetween('placed_at', [$startDate, $endDate])
            ->sum('total_amount');
            
        $offlineSales = OfflineOrder::whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_amount');
            
        $totalSales = $onlineSales + $offlineSales;
        
        return response()->json([
            'period' => $period,
            'online_sales' => $onlineSales,
            'offline_sales' => $offlineSales,
            'total_sales' => $totalSales,
            'start_date' => $startDate,
            'end_date' => $endDate
        ]);
    }
}