namespace RestaurantAPI.Contracts;

public record OrderDetailCreateDto(int FoodItemId, int Quantity);

public record OrderCreateDto(
    string OrderNumber,
    int CustomerId,
    string PaymentMethod,
    List<OrderDetailCreateDto> Items
);

public record OrderDetailReadDto(
    int OrderDetailId,
    int FoodItemId,
    string FoodItemName,
    decimal FoodItemPrice,
    int Quantity,
    decimal LineTotal
);

public record OrderReadDto(
    long OrderMasterId,
    string OrderNumber,
    int CustomerId,
    string CustomerName,
    string PaymentMethod,
    decimal TotalPrice,
    List<OrderDetailReadDto> Items
);

public record OrderUpdateDto(
    string PaymentMethod,
    List<OrderDetailCreateDto> Items
);