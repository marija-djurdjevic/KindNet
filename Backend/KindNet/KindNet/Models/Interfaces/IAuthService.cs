using KindNet.Dtos;
using KindNet.Models;
using FluentResults;

namespace KindNet.Models.Interfaces
{
    public interface IAuthService
    {
        Result<User> Register(RegisterDto request);
        Result<AuthenticationTokensDto> Login(LoginDto request);
    }
}