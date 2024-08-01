using System.ComponentModel.DataAnnotations;

namespace Backend.Dto;

public class PostDto
{
    public int Id { get; set;}
    [Required] public int UserId { get; set;}
    [Required] public string? PostTitle { get; set;}
    [Required] public string? PostBody { get; set;}
    [Required] public string? PostLikes { get; set;}
    [Required] public DateTime PostDate { get; set;}
}