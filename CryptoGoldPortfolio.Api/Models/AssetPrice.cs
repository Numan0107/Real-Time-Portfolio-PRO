namespace CryptoGoldPortfolio.Api.Models;

public class AssetPrice
{
    public string Symbol { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal Change24h { get; set; }
    public DateTime LastUpdated { get; set; }
}