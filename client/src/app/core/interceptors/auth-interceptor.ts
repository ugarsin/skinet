import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // const clonedRequest = req.clone({
  //   withCredentials: true
  // })

  // return next(clonedRequest);
  const apiBase = environment.apiUrl; // e.g. "https://localhost:5001/api/" or similar

  // Only attach credentials for requests to your API domain
  if (req.url.startsWith(apiBase)) {
    const cloned = req.clone({ withCredentials: true });
    return next(cloned);
  }

  // Otherwise, pass the request as-is (no cookies)
  return next(req);
};
