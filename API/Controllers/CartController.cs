using Core.Entities;
using Core.Interfaces;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CartController : BaseApiController
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<ActionResult<ShoppingCart>> GetCartById(string id)
        {
            var cart = await _cartService.GetCartAsync(id);
            return cart ?? new ShoppingCart { Id = id };
        }

        [HttpPost]
        public async Task<ActionResult<ShoppingCart?>> UpdateCart(ShoppingCart shoppingCart)
        {
            var updatedCart = await _cartService.SetCartAsync(shoppingCart);
            if (UpdateCart == null) return BadRequest("Problem with cart");
            return updatedCart;
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteCart(string id)
        {
            var result = await _cartService.DeleteCartAsync(id);
            if (!result) return BadRequest("Problem deleting cart");
            return Ok();
        }
    }
}
