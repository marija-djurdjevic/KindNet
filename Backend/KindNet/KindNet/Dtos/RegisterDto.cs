using KindNet.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace KindNet.Dtos
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Email je obavezan.")]
        [EmailAddress(ErrorMessage = "Unesite validan email.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Lozinka je obavezna.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "User role je obavezan.")]
        public UserRole Role { get; set; }
    }
}
