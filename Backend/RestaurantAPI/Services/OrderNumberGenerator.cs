using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Models;

namespace RestaurantAPI.Services;

public interface IOrderNumberGenerator
{
    Task<string> GenerateAsync(RestaurantDbContext context, CancellationToken ct = default);
}

public class OrderNumberGenerator : IOrderNumberGenerator
{
    public async Task<string> GenerateAsync(RestaurantDbContext context, CancellationToken ct = default)
    {
        var today = DateTime.UtcNow.ToString("yyyyMMdd");
        var countToday = await context.OrderMasters
            .AsNoTracking()
            .CountAsync(o => o.OrderNumber.StartsWith($"ORD-{today}"), ct);

        var seq = countToday + 1;
        return $"ORD-{today}-{seq:0000}";
    }
}