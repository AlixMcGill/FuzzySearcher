
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

        group.MapPost("/", (UserDtos newUser, [FromServices] MySqlConnection connection) =>
        {
            if(newUser.FirstName != "" || newUser.FirstName != null) {
                connection.ExecuteAsync(@"
                    INSERT INTO user (FirstName, LastName, Username, Password)
                        VALUES (@FirstName, @LastName, @Username, @Password);", newUser);

                return Results.Ok(newUser);
            }
            else {
                return Results.BadRequest();
            }
        });

        return group;
    }
}