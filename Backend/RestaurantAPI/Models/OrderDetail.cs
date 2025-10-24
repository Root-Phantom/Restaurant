using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace RestaurantAPI.Models;

public class OrderDetail
{
    [Key] public int OrderDetailId { get; set; }

    [Required] public long OrderMasterId { get; set; }

    [Required] public OrderMaster OrderMaster { get; set; } = default!;

    [Required] public int FoodItemId { get; set; }

    [Required] public FoodItem FoodItem { get; set; } = default!;

    [Required(ErrorMessage = "Price is required.")]
    [Range(0.00, 100000000, ErrorMessage = "Price must be non-negative.")]
    [Precision(18, 2)]
    [Column(TypeName = "decimal(18,2)")]
    public decimal FoodItemPrice { get; set; }

    [Required]
    [Range(1, 10000, ErrorMessage = "Quantity must be between 1 and 10,000.")]
    public int Quantity { get; set; }
}