using KindNet.Dtos;
using FluentResults;

namespace KindNet.Models.Interfaces
{
    public interface ITokenGenerator
    {
        Result<AuthenticationTokensDto> GenerateAccessToken(User user);
    }
}
