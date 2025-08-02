using System;

namespace backend.Models
{
    public class CustomerPromotion
    {
        public int CustomerPromoId { get; set; }
        public int CustomerId { get; set; }
        public int PromoId { get; set; }
        public DateTime? UsedAt { get; set; }
    }
}
