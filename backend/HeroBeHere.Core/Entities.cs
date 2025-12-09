using System.ComponentModel.DataAnnotations;

namespace HeroBeHere.Core.Entities;

public class Provider
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string CategoryId { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;
    
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    
    public double Rating { get; set; } = 0.0;
    public int ReviewCount { get; set; } = 0;
    
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;
    
    public bool IsActive { get; set; } = true;
    public bool IsVerified { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<ServiceItem> Services { get; set; } = new List<ServiceItem>();
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}

public class ServiceItem
{
    public int Id { get; set; }
    
    [Required]
    public int ProviderId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(300)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public decimal Price { get; set; }
    
    public int Duration { get; set; } // en minutos
    
    [MaxLength(20)]
    public string CategoryId { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string SubcategoryId { get; set; } = string.Empty;
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public Provider Provider { get; set; } = null!;
}

public class Employee
{
    public int Id { get; set; }
    
    [Required]
    public int ProviderId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string Role { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string ImageUrl { get; set; } = string.Empty;
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public Provider Provider { get; set; } = null!;
}

public class Schedule
{
    public int Id { get; set; }
    
    [Required]
    public int ProviderId { get; set; }
    
    [Required]
    public DayOfWeek DayOfWeek { get; set; }
    
    [Required]
    public TimeOnly StartTime { get; set; }
    
    [Required]
    public TimeOnly EndTime { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    // Navigation properties
    public Provider Provider { get; set; } = null!;
}

public class Review
{
    public int Id { get; set; }
    
    [Required]
    public int ProviderId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string UserName { get; set; } = string.Empty;
    
    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }
    
    [MaxLength(500)]
    public string Comment { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public Provider Provider { get; set; } = null!;
}

public class ServiceCategory
{
    [Key]
    [MaxLength(20)]
    public string Id { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string Icon { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string Color { get; set; } = string.Empty;
    
    public ICollection<string> Subcategories { get; set; } = new List<string>();
}