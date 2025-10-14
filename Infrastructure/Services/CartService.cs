using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class CartService : ICartService
    {
        public Task<bool> DeleteCartAsync(string key)
        {
            throw new NotImplementedException();
        }

        public Task<ShoppingCart?> GetCartAsync(string key)
        {
            throw new NotImplementedException();
        }

        public Task<ShoppingCart?> SetCartAsync(ShoppingCart cart)
        {
            throw new NotImplementedException();
        }
    }
}
