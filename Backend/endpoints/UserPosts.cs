using Backend.Dto;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Authorization;

namespace Backend.endpoints;

public static class UserPosts
{
    public static RouteGroupBuilder UserPostsRoute(this WebApplication app)
    {
        var group = app.MapGroup("UserPosts");

        // GET REQUESTS

        group.MapGet("/",
            [Authorize]
        ([FromServices] MySqlConnection connection) =>
            {
                var posts = connection.Query<PostDto>("SELECT * FROM posts");
                if (posts != null)
                    return Results.Ok(posts);
                else
                    return Results.NotFound();
            });

        group.MapGet("/Posts/{id}",
                [Authorize]
                async (int id, [FromServices] MySqlConnection connection) => 
        {
           var posts = await connection.QueryAsync<PostDto>("SELECT * FROM posts WHERE user_id = @Id", new {Id = id});
           if (posts.ToArray().Any()) {
                return Results.Ok(posts);
           } else {
                return Results.NotFound();
           }
        });

        group.MapGet("/{id}", (int id, [FromServices] MySqlConnection connection) =>
        {
            var posts = connection.Query<PostDto>("SELECT * FROM posts WHERE Id = @Id", new { Id = id });
            if (posts != null)
                return Results.Ok(posts);
            else
                return Results.NotFound();
        });

        //POST Reqests

        group.MapPost("/",
                [Authorize]
        async (PostDto NewPost, [FromServices] MySqlConnection connection) =>
        {
            if (NewPost.Post_Body != "" || NewPost != null)
            {
                await connection.ExecuteAsync(@"
                    INSERT INTO posts (user_Id, Post_Title, Post_Body, Post_Likes, date_time)
                        VALUES (@User_Id, @Post_Title, @Post_Body, 0, NOW());", NewPost);

                return Results.Ok(NewPost);
            }
            else
            {
                return Results.BadRequest();
            }
        });

        // PUT REQUESTS

        group.MapPut("/IncrementLikes/{Id}", async (int Id, PostDto UserPost, [FromServices] MySqlConnection connection) =>
        {
            // INC LIKES
            await connection.ExecuteAsync(@"
            UPDATE posts SET 
                Post_Likes = Post_Likes + 1
            WHERE Id = @Id",
            new { Id = Id });

            return Results.Ok(UserPost);
        });

        group.MapPut("/DecrementLikes/{Id}", async (int Id, PostDto UserPost, [FromServices] MySqlConnection connection) =>
        {
            // INC LIKES
            await connection.ExecuteAsync(@"
            UPDATE posts SET 
                Post_Likes = Post_Likes - 1
            WHERE Id = @Id",
            new { Id = Id });

            return Results.Ok(UserPost);
        });

        // DELETE REQUESTS

        group.MapDelete("/{Id}", async (int Id, [FromServices] MySqlConnection connection) =>
        {
            await connection.ExecuteAsync("DELETE FROM posts WHERE Id = @Id", new { Id = Id });

            return Results.Ok();
        });

        return group;
    }
}
