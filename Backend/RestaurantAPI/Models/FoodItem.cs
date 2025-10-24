using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace RestaurantAPI.Models;

public class FoodItem
{
    [Key] public int FoodItemId { get; set; }

    [Required(ErrorMessage = "Food item name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be 2-100 characters.")]
    [RegularExpression(@"^[\p{L}\p{M}\s\.'\-]+$", ErrorMessage = "Invalid characters in name.")]
    [Column(TypeName = "nvarchar(100)")]
    public string FoodItemName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Price is required.")]
    [Range(0.01, 1000000, ErrorMessage = "Price must be between 0.01 and 1,000,000.")]
    [Precision(18, 2)]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
}