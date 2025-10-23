using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RestaurantAPI.Models;

public class OrderDetail
{
    [Key] public int OrderDetailId { get; set; }

    public long OrderMasterId { get; set; }
    public OrderMaster OrderMaster { get; set; }

    public int FoodItemId { get; set; }
    public FoodItem FoodItem { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal FoodItemPrice { get; set; }

    public int Quantity { get; set; }
}