﻿using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class CartService : ICartService
    {
        private readonly IConnectionMultiplexer _redis;
        private IDatabase _database;

        public CartService(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
            _redis = redis;
        }

        public async Task<bool> DeleteCartAsync(string key)
        {
            return await _database.KeyDeleteAsync(key);
        }

        public async Task<ShoppingCart?> GetCartAsync(string key)
        {
            var data = await _database.StringGetAsync(key);
            return data.IsNullOrEmpty 
                ? 
                null 
                : 
                JsonSerializer.Deserialize<ShoppingCart?>(data!);
        }

        public async Task<ShoppingCart?> SetCartAsync(ShoppingCart cart)
        {
            var created = await _database.StringSetAsync(cart.Id, 
                JsonSerializer.Serialize(cart),
                TimeSpan.FromDays(30)
            );

            if (!created) return null;

            return await GetCartAsync(cart.Id);
        }
    }
}
