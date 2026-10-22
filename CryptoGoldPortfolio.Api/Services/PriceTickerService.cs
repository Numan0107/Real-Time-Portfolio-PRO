using Microsoft.AspNetCore.SignalR;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using System.Globalization;

public class PriceTickerService : BackgroundService
{
    private readonly IHubContext<PortfolioHub> _hubContext;
    private readonly Random _random = new Random();

    public PriceTickerService(IHubContext<PortfolioHub> hubContext)
    {
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        decimal btcPrice = 65000.50m;
        decimal ethPrice = 3500.25m;
        decimal goldPrice = 3150.25m;

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var client = new ClientWebSocket();
                await client.ConnectAsync(new Uri("wss://stream.binance.com:9443/ws/btcusdt@trade/ethusdt@trade"), stoppingToken);

                var buffer = new byte[1024 * 4];
                while (client.State == WebSocketState.Open && !stoppingToken.IsCancellationRequested)
                {
                    var result = await client.ReceiveAsync(new ArraySegment<byte>(buffer), stoppingToken);
                    if (result.MessageType == WebSocketMessageType.Text)
                    {
                        var json = Encoding.UTF8.GetString(buffer, 0, result.Count);
                        using var doc = JsonDocument.Parse(json);
                        var root = doc.RootElement;
                        
                        string? symbol = root.GetProperty("s").GetString();
                        string? priceStr = root.GetProperty("p").GetString();
                        
                        if (decimal.TryParse(priceStr, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal price))
                    {
                         if (symbol == "BTCUSDT") btcPrice = price;
                         if (symbol == "ETHUSDT") ethPrice = price;
                    }

                        goldPrice += goldPrice * (decimal)(_random.NextDouble() * 0.002 - 0.001);

                        await _hubContext.Clients.All.SendAsync("ReceivePriceUpdate", new
                        {
                            Bitcoin = Math.Round(btcPrice, 2),
                            Ethereum = Math.Round(ethPrice, 2),
                            GramGold = Math.Round(goldPrice, 2)
                        }, stoppingToken);
                    }
                }
            }
            catch
            {
                await Task.Delay(5000, stoppingToken);
            }
        }
    }
}