using System;

namespace backend.Models
{
    public class FeedbackReply
    {
        public int ReplyId { get; set; }
        public int FeedbackId { get; set; }
        public int ResponderId { get; set; }
        public string Message { get; set; }
        public DateTime RepliedAt { get; set; }
    }
}
