using System;

namespace backend.Models
{
    public class InventoryTransfer
    {
        public int TransferId { get; set; }
        public int FromBranchId { get; set; }
        public int ToBranchId { get; set; }
        public int ProductId { get; set; }
        public int RequestedBy { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; }
        public DateTime RequestedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
