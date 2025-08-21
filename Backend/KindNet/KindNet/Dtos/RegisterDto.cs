using KindNet.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace KindNet.Dtos
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress(ErrorMessage = "Enter valid Email address.")]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public UserRole Role { get; set; }
    }
}
