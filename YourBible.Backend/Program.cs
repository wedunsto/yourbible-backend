using Microsoft.EntityFrameworkCore;
using YourBible.Backend.Data;
using YourBible.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// connection string to the yourBible SQL database
var connString = builder.Configuration.GetConnectionString("Default");

// connection string to the yourBible endpoints
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();


// Add services to the container.a
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// Service to bridge back-end to the yourBible SQL database
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(connString));

builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddScoped<AuthenticationService>(); // Register the authorization service
builder.Services.AddScoped<UserExistsService>();

builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy
            .WithOrigins(allowedOrigins ?? Array.Empty<string>())
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors(); // apply CORS middleware

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();