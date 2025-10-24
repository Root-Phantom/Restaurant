using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Models;

namespace RestaurantAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrderMastersController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public OrderMastersController(RestaurantDbContext context)
    {
        _context = context;
    }

    // DTOs
    public record OrderDetailCreateDto(int FoodItemId, int Quantity);
    public record OrderCreateDto(string OrderNumber, int CustomerId, string PaymentMethod, List<OrderDetailCreateDto> Items);
    public record OrderUpdateDto(string PaymentMethod, List<OrderDetailCreateDto> Items);
    public record OrderDetailReadDto(int OrderDetailId, int FoodItemId, string FoodItemName, decimal FoodItemPrice, int Quantity, decimal LineTotal);
    public record OrderReadDto(long OrderMasterId, string OrderNumber, int CustomerId, string CustomerName, string PaymentMethod, decimal TotalPrice, List<OrderDetailReadDto> Items);

    // GET: api/OrderMasters
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetOrderMasters()
    {
        var orders = await _context.OrderMasters
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.OrderDetails).ThenInclude(d => d.FoodItem)
            .Select(o => new OrderReadDto(
                o.OrderMasterId,
                o.OrderNumber,
                o.CustomerId,
                o.Customer.CustomerName,
                o.PaymentMethod,
                o.TotalPrice,
                o.OrderDetails.Select(d => new OrderDetailReadDto(
                    d.OrderDetailId,
                    d.FoodItemId,
                    d.FoodItem.FoodItemName,
                    d.FoodItemPrice,
                    d.Quantity,
                    d.FoodItemPrice * d.Quantity
                )).ToList()
            ))
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/OrderMasters/5
    [HttpGet("{id:long}")]
    public async Task<ActionResult<OrderReadDto>> GetOrderMaster(long id)
    {
        var o = await _context.OrderMasters
            .AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.OrderDetails).ThenInclude(d => d.FoodItem)
            .FirstOrDefaultAsync(x => x.OrderMasterId == id);

        if (o is null) return NotFound();

        var dto = new OrderReadDto(
            o.OrderMasterId,
            o.OrderNumber,
            o.CustomerId,
            o.Customer.CustomerName,
            o.PaymentMethod,
            o.TotalPrice,
            o.OrderDetails.Select(d => new OrderDetailReadDto(
                d.OrderDetailId,
                d.FoodItemId,
                d.FoodItem.FoodItemName,
                d.FoodItemPrice,
                d.Quantity,
                d.FoodItemPrice * d.Quantity
            )).ToList()
        );

        return Ok(dto);
    }

    // POST: api/OrderMasters
    [HttpPost]
    public async Task<ActionResult<OrderReadDto>> PostOrderMaster(OrderCreateDto dto, CancellationToken ct)
    {
        if (dto.Items is null || dto.Items.Count == 0)
            return BadRequest("At least one order item is required.");

        var customerExists = await _context.Customers.AsNoTracking()
            .AnyAsync(c => c.CustomerId == dto.CustomerId, ct);
        if (!customerExists) return BadRequest("Customer not found.");

        var ids = dto.Items.Select(i => i.FoodItemId).Distinct().ToList();
        var fiMap = await _context.FoodItems
            .Where(f => ids.Contains(f.FoodItemId))
            .ToDictionaryAsync(f => f.FoodItemId, ct);
        if (ids.Count != fiMap.Count) return BadRequest("Some food items do not exist.");

        var order = new OrderMaster
        {
            OrderNumber = dto.OrderNumber,
            CustomerId = dto.CustomerId,
            PaymentMethod = dto.PaymentMethod,
            OrderDetails = new List<OrderDetail>()
        };

        foreach (var item in dto.Items)
        {
            if (item.Quantity <= 0) return BadRequest("Quantity must be positive.");
            var fi = fiMap[item.FoodItemId];
            order.OrderDetails.Add(new OrderDetail
            {
                FoodItemId = fi.FoodItemId,
                Quantity = item.Quantity,
                FoodItemPrice = fi.Price
            });
        }

        order.TotalPrice = order.OrderDetails.Sum(d => d.FoodItemPrice * d.Quantity);

        _context.OrderMasters.Add(order);
        await _context.SaveChangesAsync(ct);

        return await GetOrderMaster(order.OrderMasterId);
    }

    // PUT: api/OrderMasters/5
    [HttpPut("{id:long}")]
    public async Task<IActionResult> PutOrderMaster(long id, OrderUpdateDto dto, CancellationToken ct)
    {
        var order = await _context.OrderMasters
            .Include(o => o.OrderDetails)
            .FirstOrDefaultAsync(o => o.OrderMasterId == id, ct);

        if (order is null) return NotFound();

        order.PaymentMethod = dto.PaymentMethod;

        if (dto.Items is null || dto.Items.Count == 0)
            return BadRequest("At least one order item is required.");

        order.OrderDetails.Clear();

        var ids = dto.Items.Select(i => i.FoodItemId).Distinct().ToList();
        var fiMap = await _context.FoodItems
            .Where(f => ids.Contains(f.FoodItemId))
            .ToDictionaryAsync(f => f.FoodItemId, ct);

        if (ids.Count != fiMap.Count) return BadRequest("Some food items do not exist.");

        foreach (var item in dto.Items)
        {
            if (item.Quantity <= 0) return BadRequest("Quantity must be positive.");
            var fi = fiMap[item.FoodItemId];
            order.OrderDetails.Add(new OrderDetail
            {
                FoodItemId = fi.FoodItemId,
                Quantity = item.Quantity,
                FoodItemPrice = fi.Price
            });
        }

        order.TotalPrice = order.OrderDetails.Sum(d => d.FoodItemPrice * d.Quantity);

        await _context.SaveChangesAsync(ct);
        return NoContent();
    }

    // DELETE: api/OrderMasters/5
    [HttpDelete("{id:long}")]
    public async Task<IActionResult> DeleteOrderMaster(long id, CancellationToken ct)
    {
        var order = await _context.OrderMasters
            .Include(o => o.OrderDetails)
            .FirstOrDefaultAsync(o => o.OrderMasterId == id, ct);

        if (order is null) return NotFound();

        _context.OrderMasters.Remove(order);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }
}
