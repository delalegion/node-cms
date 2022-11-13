const { RateLimiterMemory } = require('rate-limiter-flexible');
const IP = require('ip');

const rateLimiter = new RateLimiterMemory({
   points: 2, // 6 points
   duration: 1, // Per second
   blockDuration: 60
});

const rateLimiterMiddleware = (req, res, next) => {
   const ipAddress = IP.address();
   rateLimiter.consume(ipAddress) // consume 2 points
   .then((rateLimiterRes) => {
     next();
   })
   .catch((rateLimiterRes) => {
     res.status(429).send('Too Many Requests. Please try again later.');
   });
}

module.exports = rateLimiterMiddleware;