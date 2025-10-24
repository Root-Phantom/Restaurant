using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace RestaurantAPI.Models;

public class OrderMaster
{
    [Key] public long OrderMasterId { get; set; }

    [Required(ErrorMessage = "Order number is required.")]
    [StringLength(75, MinimumLength = 3, ErrorMessage = "Order number must be 3-75 characters.")]
    [RegularExpression(@"^[A-Z0-9\-]+$", ErrorMessage = "Invalid order number format.")]
    [Column(TypeName = "nvarchar(75)")]
    public string OrderNumber { get; set; } = string.Empty;

    [Required] public int CustomerId { get; set; }

    [Required] public Customer Customer { get; set; } = default!;

    [Required(ErrorMessage = "Payment method is required.")]
    [StringLength(75)]
    [RegularExpression(@"^(Cash|Card|Online|Wallet)$", ErrorMessage = "Invalid payment method.")]
    [Column(TypeName = "nvarchar(75)")]
    public string PaymentMethod { get; set; } = "Cash";

    [Required]
    [Range(0.00, 100000000, ErrorMessage = "Total price must be non-negative.")]
    [Precision(18, 2)]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPrice { get; set; }

    [Required] public List<OrderDetail> OrderDetails { get; set; } = new();
}