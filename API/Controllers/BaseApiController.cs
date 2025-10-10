using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        protected async Task<IActionResult> CreatePagedResult<T>(
            IGenericRepository<T> repository,
            ISpecification<T> specification,
            int pageIndex, 
            int pageSize
            ) where T : BaseEntity
        {
            var items = await repository.ListAsync(specification);
            var count = await repository.CountAsync(specification);
            var pagination = new Pagination<T>(
                pageIndex,
                pageSize,
                count,
                items
            );
            return Ok(pagination);
        }
    }
}
