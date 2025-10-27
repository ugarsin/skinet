using API.Middleware;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
// Add services to the container.
builder.Services.AddSingleton<IConnectionMultiplexer>(
    config =>
    {
        var connString = builder.Configuration.GetConnectionString("Redis")
            ?? throw new Exception("Cannot get Redis connection string");
        var configuraion = ConfigurationOptions.Parse(connString, true);
        return ConnectionMultiplexer.Connect(configuraion);
    }
);
builder.Services.AddSingleton<ICartService, CartService>();
builder.Services.AddControllers();
builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<StoreContext>();

//builder.Services.AddIdentityCore<AppUser>()
//    .AddEntityFrameworkStores<StoreContext>()
//    .AddSignInManager<SignInManager<AppUser>>()
//    .AddDefaultTokenProviders();

builder.Services.AddDbContext<StoreContext>(
    options =>
    {
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    }
);
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
//    options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
//    options.DefaultSignInScheme = IdentityConstants.ApplicationScheme;
//});
//.AddIdentityCookies(); 

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(
    options =>
    options
    .AllowCredentials()
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins("http://localhost:4200", "https://localhost:4200")
);

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ExceptionMiddleware>();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<AppUser>();

try
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<StoreContext>();
    await context.Database.MigrateAsync();
    await StoreContextSeed.SeedAsync(context);
}
catch (Exception ex)
{
    Console.WriteLine(ex);
	throw;
}

app.Run();
