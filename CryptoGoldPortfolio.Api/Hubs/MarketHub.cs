using Microsoft.AspNetCore.SignalR;
using CryptoGoldPortfolio.Api.Models;

namespace CryptoGoldPortfolio.Api.Hubs;

public class MarketHub : Hub
{
    public async Task BroadcastPrice(AssetPrice price)
    {
        await Clients.All.SendAsync("ReceivePriceUpdate", price);
    }
}