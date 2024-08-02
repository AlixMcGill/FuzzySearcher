using System.ComponentModel.DataAnnotations;

namespace Backend.Dto;

public class PostDto
{
    public int Id { get; set;}
    [Required] public int User_Id { get; set;}
    [Required] public string? Post_Title { get; set;}
    [Required] public string? Post_Body { get; set;}
    [Required] public int Post_Likes { get; set;}
    [Required] public DateTime Date_Time { get; set;}
}