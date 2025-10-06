﻿using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class ProductSpecification : BaseSpecification<Product>
    {
        public ProductSpecification(ProductSpecParams productSpecParams) 
            : base(
                x =>
                (
                    string.IsNullOrEmpty(productSpecParams.Search) 
                    || 
                    x.Name.ToLower().Contains(productSpecParams.Search)
                )
                &&
                (!productSpecParams.Brands.Any() || productSpecParams.Brands.Contains(x.Brand))
                &&
                (!productSpecParams.Types.Any() || productSpecParams.Types.Contains(x.Type))
            )
        {
            ApplyPaging(productSpecParams.PageSize * (productSpecParams.PageIndex - 1), productSpecParams.PageSize);

            switch (productSpecParams.Sort)
            {
                case "priceAsc":
                    AddOrderBy(x => x.Price);
                    break;
                case "priceDesc":
                    AddOrderByDescending(x => x.Price);
                    break;
                default:
                    AddOrderBy(x => x.Name);
                    break;
            }
        }
    }
}
