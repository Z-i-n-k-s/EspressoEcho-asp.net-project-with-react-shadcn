using System;

namespace backend.Models
{
    public class SalesSummary
    {
        public int SummaryId { get; set; }
        public int BranchId { get; set; }
        public DateTime SummaryDate { get; set; }
        public decimal TotalSales { get; set; }
        public int TotalOrders { get; set; }
        public decimal OnlineSales { get; set; }
        public decimal OfflineSales { get; set; }
    }
}
