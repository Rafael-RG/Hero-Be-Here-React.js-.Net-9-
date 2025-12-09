using Microsoft.EntityFrameworkCore;
using HeroBeHere.Core.Entities;
using System.Text.Json;

namespace HeroBeHere.Data;

public class HeroDbContext : DbContext
{
    public HeroDbContext(DbContextOptions<HeroDbContext> options) : base(options)
    {
    }

    public DbSet<Provider> Providers { get; set; }
    public DbSet<ServiceItem> Services { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<ServiceCategory> ServiceCategories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Provider configuration
        modelBuilder.Entity<Provider>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Rating).HasPrecision(3, 2);
            entity.Property(e => e.Latitude).HasPrecision(18, 6);
            entity.Property(e => e.Longitude).HasPrecision(18, 6);
            
            entity.HasIndex(e => e.CategoryId);
            entity.HasIndex(e => new { e.Latitude, e.Longitude });
        });

        // ServiceItem configuration
        modelBuilder.Entity<ServiceItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Price).HasPrecision(10, 2);
            
            entity.HasOne(e => e.Provider)
                .WithMany(e => e.Services)
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(e => e.CategoryId);
        });

        // Employee configuration
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.Provider)
                .WithMany(e => e.Employees)
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Schedule configuration
        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.Provider)
                .WithMany(e => e.Schedules)
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(e => new { e.ProviderId, e.DayOfWeek });
        });

        // Review configuration
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.Provider)
                .WithMany(e => e.Reviews)
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(e => e.ProviderId);
        });

        // ServiceCategory configuration
        modelBuilder.Entity<ServiceCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            // Convert list to JSON for storage
            entity.Property(e => e.Subcategories)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, JsonSerializerOptions.Default),
                    v => JsonSerializer.Deserialize<List<string>>(v, JsonSerializerOptions.Default) ?? new List<string>());
        });

        // Seed data for categories
        SeedCategories(modelBuilder);
    }

    private static void SeedCategories(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ServiceCategory>().HasData(
            new ServiceCategory
            {
                Id = "home",
                Name = "Hogar",
                Icon = "Home",
                Color = "bg-blue-100 text-blue-700",
                Subcategories = new List<string> { "Plomería", "Limpieza", "Jardinería", "Electricidad", "Pintura", "Mudanzas" }
            },
            new ServiceCategory
            {
                Id = "tech",
                Name = "Técnico",
                Icon = "Wrench",
                Color = "bg-orange-100 text-orange-700",
                Subcategories = new List<string> { "Aire Acondicionado", "Computadoras", "Celulares", "Electrodomésticos", "Smart Home" }
            },
            new ServiceCategory
            {
                Id = "beauty",
                Name = "Belleza",
                Icon = "Sparkles",
                Color = "bg-pink-100 text-pink-700",
                Subcategories = new List<string> { "Manicure", "Pedicure", "Corte de Pelo", "Maquillaje", "Masajes" }
            },
            new ServiceCategory
            {
                Id = "health",
                Name = "Salud",
                Icon = "HeartPulse",
                Color = "bg-teal-100 text-teal-700",
                Subcategories = new List<string> { "Enfermería", "Fisioterapia", "Cuidador", "Nutrición" }
            },
            new ServiceCategory
            {
                Id = "pet",
                Name = "Mascotas",
                Icon = "Dog",
                Color = "bg-green-100 text-green-700",
                Subcategories = new List<string> { "Paseador", "Baño y Corte", "Veterinario", "Entrenamiento" }
            },
            new ServiceCategory
            {
                Id = "educ",
                Name = "Clases",
                Icon = "BookOpen",
                Color = "bg-purple-100 text-purple-700",
                Subcategories = new List<string> { "Idiomas", "Matemáticas", "Música", "Entrenador Personal" }
            }
        );
    }
}