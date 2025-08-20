namespace KindNet.Models
{
    using System.ComponentModel.DataAnnotations;
    using KindNet.Models.Enums;

    public class User
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public UserRole Role { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;
    }
}
