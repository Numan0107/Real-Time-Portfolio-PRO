using CryptoGoldPortfolio.Api.Hubs;
using CryptoGoldPortfolio.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddHostedService<CryptoMarketWorker>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientPermission", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:5173")
              .AllowCredentials();
    });
});

builder.Services.AddSignalR();
builder.Services.AddHostedService<PriceTickerService>();



var app = builder.Build();


app.UseCors("ClientPermission");
app.MapHub<MarketHub>("/markethub");
app.MapHub<PortfolioHub>("/portfoliohub");

app.Run();