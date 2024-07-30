
using System.Text.RegularExpressions;
using Backend.Dto;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Asn1.Ocsp;

namespace Backend.endpoints;

public static class DbSearch
{
    public static RouteGroupBuilder DbSearchRoute(this WebApplication app)
    {
        var group = app.MapGroup("DbSearch");

        // GET REQUESTS

        group.MapGet("/", ([FromServices] MySqlConnection connection) =>
        {
            var users = connection.Query<UserDtos>("SELECT * FROM user");
            if (users != null)
                return Results.Ok(users);
            else
                return Results.NotFound();

        });

        group.MapGet("/{id}", (int id, [FromServices] MySqlConnection connection) =>
        {
            var users = connection.Query<UserDtos>($"SELECT * FROM user WHERE Id = @Id", new { Id = id });
            if (users.Any())
                return Results.Ok(users);
            else
                return Results.NotFound();
        });

        group.MapGet("/filter={filter}", (string filter, [FromServices] MySqlConnection connection) =>
        {
            var filteredUsers = connection.Query<UserDtos>($"SELECT * FROM user WHERE `FirstName` LIKE '%{filter}%'");
            if (filteredUsers.Any())
                return Results.Ok(filteredUsers);
            else
                return Results.NotFound();
        });

        // POST REQUESTS

        group.MapPost("/", async (UserDtos newUser, [FromServices] MySqlConnection connection) =>
        {
            if(newUser.FirstName != "" || newUser.FirstName != null) {
                await connection.ExecuteAsync(@"
                    INSERT INTO user (FirstName, LastName, Username, Password)
                        VALUES (@FirstName, @LastName, @Username, @Password);", newUser);

                return Results.Ok(newUser);
            }
            else {
                return Results.BadRequest();
            }
        });

        // PUT REQUESTS

        group.MapPut("/{Id}", async (int Id, UserDtos updateUsers, [FromServices] MySqlConnection connection) => {
            await connection.ExecuteAsync(@"
            UPDATE user SET 
                `FirstName` = @FirstName, 
                `LastName` = @LastName, 
                `Username` = @Usern, 
                `Password` = @Password
            WHERE Id = @Id",
            new { FirstName = updateUsers.FirstName,
                  LastName = updateUsers.LastName,
                  Usern = updateUsers.UserName,
                  Password = updateUsers.Password,
                  Id = Id });

            return Results.Ok(updateUsers);
        });

        // DELETE REQUESTS

        group.MapDelete("/{Id}", async (int Id, [FromServices] MySqlConnection connection) => {
            await connection.ExecuteAsync("DELETE FROM user WHERE Id = @Id", new { Id = Id });

            return Results.Ok();
        });

        return group;
    }
}