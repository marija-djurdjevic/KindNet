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
        [MinLength(6, ErrorMessage = "Lozinka mora imati najmanje 6 karaktera.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "User role je obavezan.")]
        public UserRole Role { get; set; }
    }
}
