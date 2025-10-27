using API.DTOs;
using API.Extensions;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(SignInManager<AppUser> signInManager)
        {
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new AppUser
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };
            var result = await _signInManager.UserManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                //return BadRequest(result.Errors);
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }
            return Ok();
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return NoContent();
        }

        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            if (User.Identity?.IsAuthenticated == false) return NoContent();
            var user = await _signInManager.UserManager.GetUserByEmailWithAddress(User);
            return Ok(new
            {
                user.FirstName,
                user.LastName,
                user.Email,
                Address = user.Address?.ToDto()
            });
        }

        [HttpGet]
        public ActionResult GetAuthState()
        {
            return Ok(new
            {
                IsAuthenticated = User.Identity?.IsAuthenticated ?? false
            });
        }

        [Authorize]
        [HttpPost("address")]
        public async Task<ActionResult<Address>> CreateOrUpdateAddress(AddressDto addressDto)
        {
            var user = await _signInManager.UserManager.GetUserByEmailWithAddress(User);
            if (user.Address == null)
            {
                user.Address = addressDto.ToEntity();
            }
            else
            {
                user.Address.UpdateFromDto(addressDto);
            }
            var result = await _signInManager.UserManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest("Problem updating user address");
            return Ok(user.Address.ToDto());
        }
    }
}
