using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantAPI.Models;

public class Customer
{
    [Key] public int CustomerId { get; set; }

    [Required(ErrorMessage = "Customer name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be 2-100 characters.")]
    [RegularExpression(@"^[\p{L}\p{M}\s\.'\-]+$", ErrorMessage = "Invalid characters in name.")]
    [Column(TypeName = "nvarchar(100)")]
    public string CustomerName { get; set; } = string.Empty;
}