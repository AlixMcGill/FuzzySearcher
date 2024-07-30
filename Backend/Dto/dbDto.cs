using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Net.Http.Headers;

namespace Backend.Dto;

public class UserDtos
{
    public int Id { get; set; }
    [Required] public string? FirstName { get; set; }
    [Required] public string? LastName { get; set; }
    [Required] public string? UserName { get; set; }
    [Required] public string? Password { get; set; }
}