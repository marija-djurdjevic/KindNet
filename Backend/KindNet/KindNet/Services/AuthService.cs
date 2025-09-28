using KindNet.Data;
using KindNet.Dtos;
using KindNet.Models.Enums;
using KindNet.Models;
using KindNet.Models.Interfaces;
using Microsoft.EntityFrameworkCore;
using FluentResults;
using System.Security.Cryptography;
using System.Text;

namespace KindNet.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly ITokenGenerator _tokenGenerator;

        public AuthService(AppDbContext context, ITokenGenerator tokenGenerator)
        {
            _context = context;
            _tokenGenerator = tokenGenerator;
        }

        public Result<User> Register(RegisterDto request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
            {
                return Result.Fail("Korisnik sa ovim e-mailom već postoji.");
            }

            var passwordHash = HashPassword(request.Password);

            var user = new User
            {
                Email = request.Email,
                Password = passwordHash,
                Role = request.Role,
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Result.Ok(user);
        }

        public Result<AuthenticationTokensDto> Login(LoginDto request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null)
            {
                return Result.Fail("Pogrešan e-mail ili lozinka. Provjerite podatke.");
            }

            if (!VerifyPassword(request.Password, user.Password))
            {
                return Result.Fail("Pogrešan e-mail ili lozinka. Provjerite podatke.");
            }

            return _tokenGenerator.GenerateAccessToken(user);
        }

        private static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            var hashedInput = HashPassword(password);
            return hashedInput == hashedPassword;
        }
    }
}
