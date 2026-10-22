using Microsoft.AspNetCore.SignalR;
using CryptoGoldPortfolio.Api.Hubs;
using CryptoGoldPortfolio.Api.Models;

namespace CryptoGoldPortfolio.Api.Services;

public class CryptoMarketWorker : BackgroundService
{
    private readonly IHubContext<MarketHub> _hubContext;

    public CryptoMarketWorker(IHubContext<MarketHub> hubContext)
    {
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var btcPrice = new AssetPrice
            {
                Symbol = "BTCUSDT",
                Price = Math.Round((decimal)(90000 + Random.Shared.NextDouble() * 1000), 2),
                Change24h = Math.Round((decimal)(Random.Shared.NextDouble() * 5 - 2.5), 2),
                LastUpdated = DateTime.UtcNow
            };

            var goldPrice = new AssetPrice
            {
                Symbol = "XAUUSD",
                Price = Math.Round((decimal)(2600 + Random.Shared.NextDouble() * 20), 2),
                Change24h = Math.Round((decimal)(Random.Shared.NextDouble() * 2 - 1), 2),
                LastUpdated = DateTime.UtcNow
            };

            var ethPrice = new AssetPrice
            {
                Symbol = "ETHUSDT",
                Price = Math.Round((decimal)(3500 + Random.Shared.NextDouble() * 50), 2),
                Change24h = Math.Round((decimal)(Random.Shared.NextDouble() * 6 - 3), 2),
                LastUpdated = DateTime.UtcNow
            };

            await _hubContext.Clients.All.SendAsync("ReceivePriceUpdate", btcPrice, cancellationToken: stoppingToken);
            await _hubContext.Clients.All.SendAsync("ReceivePriceUpdate", goldPrice, cancellationToken: stoppingToken);
            await _hubContext.Clients.All.SendAsync("ReceivePriceUpdate", ethPrice, cancellationToken: stoppingToken);

            await Task.Delay(1000, stoppingToken);
        }
    }
}