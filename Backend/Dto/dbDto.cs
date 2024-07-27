using Microsoft.AspNetCore.SignalR;
using Microsoft.Net.Http.Headers;

namespace Backend.Dto;

public class UserDtos
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? UserName { get; set; }
    public string? Password { get; set; }
}