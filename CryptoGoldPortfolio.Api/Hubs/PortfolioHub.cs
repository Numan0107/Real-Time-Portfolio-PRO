using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class PortfolioHub : Hub
{
    private static Wallet _myWallet = new Wallet();

    public async Task GetWalletData()
    {
        await Clients.Caller.SendAsync("ReceiveWalletUpdate", _myWallet);
    }

    public async Task BuyAsset(string assetType, decimal amount, decimal currentPrice)
    {
        decimal cost = amount * currentPrice;
        
        if (_myWallet.TryBalance >= cost)
        {
            _myWallet.TryBalance -= cost;

            switch (assetType)
            {
                case "BTC":
                    _myWallet.BitcoinBalance += amount;
                    break;
                case "ETH":
                    _myWallet.EthereumBalance += amount;
                    break;
                case "GOLD":
                    _myWallet.GramGoldBalance += amount;
                    break;
            }

            await Clients.All.SendAsync("ReceiveWalletUpdate", _myWallet);
        }
    }

 public async Task SellAsset(string assetType, decimal amount, decimal currentPrice)
{
    decimal revenue = amount * currentPrice;
    bool sold = false;

    switch (assetType.ToUpper())
    {
        case "BTC":
            if (_myWallet.BitcoinBalance >= amount)
            {
                _myWallet.BitcoinBalance -= amount;
                sold = true;
            }
            break;
        case "ETH":
            if (_myWallet.EthereumBalance >= amount)
            {
                _myWallet.EthereumBalance -= amount;
                sold = true;
            }
            break;
        case "GOLD":
            if (_myWallet.GramGoldBalance >= amount)
            {
                _myWallet.GramGoldBalance -= amount;
                sold = true;
            }
            break;
    }

    if (sold)
    {
        _myWallet.TryBalance += revenue;
        await Clients.Caller.SendAsync("ReceiveWalletUpdate", _myWallet);
    }
    else
    {
        await Clients.Caller.SendAsync("ShowError", "Satmak istediğiniz miktarda varlığınız yok!");
    }

}
}