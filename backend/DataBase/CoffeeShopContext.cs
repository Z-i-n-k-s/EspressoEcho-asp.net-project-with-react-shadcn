using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Reflection.Emit;

namespace backend.Data
{
    public class CoffeeShopContext : DbContext
    {
        public CoffeeShopContext(DbContextOptions<CoffeeShopContext> options)
            : base(options)
        {
        }

        // Users & Roles
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        // Employees & Branches
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Branch> Branches { get; set; }

        // Products & Categories
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }

        // Inventory
        public DbSet<BranchInventory> BranchInventories { get; set; }
        public DbSet<InventoryTransfer> InventoryTransfers { get; set; }

        // Customers & Orders
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        // Payments & Sales
        public DbSet<Payment> Payments { get; set; }
        public DbSet<SalesSummary> SalesSummaries { get; set; }

        // Reviews & Feedback
        public DbSet<ProductReview> ProductReviews { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<FeedbackReply> FeedbackReplies { get; set; }

        // Promotions
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<CustomerPromotion> CustomerPromotions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Composite keys
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<ProductCategory>()
                .HasKey(pc => new { pc.ProductId, pc.CategoryId });

            modelBuilder.Entity<BranchInventory>()
                .HasKey(bi => new { bi.BranchId, bi.ProductId });

            // Single key entities
            modelBuilder.Entity<User>()
                .HasKey(u => u.UserId);

            modelBuilder.Entity<Role>()
                .HasKey(r => r.RoleId);

            modelBuilder.Entity<Employee>()
                .HasKey(e => e.EmployeeId);

            modelBuilder.Entity<Branch>()
                .HasKey(b => b.BranchId);

            modelBuilder.Entity<Product>()
                .HasKey(p => p.ProductId);

            modelBuilder.Entity<Category>()
                .HasKey(c => c.CategoryId);

            modelBuilder.Entity<InventoryTransfer>()
                .HasKey(it => it.TransferId);

            modelBuilder.Entity<Customer>()
                .HasKey(cu => cu.CustomerId);

            modelBuilder.Entity<Order>()
                .HasKey(o => o.OrderId);

            modelBuilder.Entity<OrderItem>()
                .HasKey(oi => oi.OrderItemId);

            modelBuilder.Entity<Payment>()
                .HasKey(p => p.PaymentId);

            modelBuilder.Entity<SalesSummary>()
                .HasKey(ss => ss.SummaryId);

            modelBuilder.Entity<ProductReview>()
                .HasKey(pr => pr.ReviewId);

            modelBuilder.Entity<Feedback>()
                .HasKey(f => f.FeedbackId);

            modelBuilder.Entity<FeedbackReply>()
                .HasKey(fr => fr.ReplyId);

            modelBuilder.Entity<Promotion>()
                .HasKey(promo => promo.PromoId);

            modelBuilder.Entity<CustomerPromotion>()
                .HasKey(cp => cp.CustomerPromoId);
        }


    }
}
