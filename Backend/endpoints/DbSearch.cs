using Backend.Dto;
using Dapper;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

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
            if (users.Any()) {
                return Results.Ok(users);
            }
            else {
                return Results.NotFound();
            }

        });

        group.MapGet("/{id}", (int id, [FromServices] MySqlConnection connection) =>
        {
            var users = connection.Query<UserDtos>($"SELECT * FROM user WHERE Id = @Id", new { Id = id });
            if (users.Any())
                return Results.Ok(users);
            else
                return Results.NotFound();
        });

        group.MapGet("/filterbyusername={filter}",
                [Authorize]
                async (string filter, [FromServices] MySqlConnection connection) => {
                    var filteredUsers = await connection.QueryAsync<UserDtos>(
                            $"SELECT Id, Username FROM user WHERE Username LIKE '%{filter}%'"); 
                    if (filteredUsers.ToArray()[0].UserName == filter) {
                        return Results.Ok(filteredUsers);
                    } else {
                        return Results.NotFound();
                    }
                });

        group.MapGet("/filter={filter}", 
                [AllowAnonymous]
                (string filter, [FromServices] MySqlConnection connection) =>
        {
            var filteredUsers = connection.Query<UserDtos>($"SELECT Username FROM user WHERE `Username` LIKE '%{filter}%'");
            if (filteredUsers.ToArray()[0].UserName == filter)
                return Results.Ok(filteredUsers);
            else
                return Results.Accepted();
        });

        // POST REQUESTS

        group.MapPost("/", 
            [AllowAnonymous] 
            async (UserDtos newUser, [FromServices] MySqlConnection connection) =>
        {
            if(newUser.FirstName != "" || newUser.FirstName != null ||
               newUser.LastName != "" || newUser.LastName != null ||
               newUser.UserName != "" || newUser.UserName != null ||
               newUser.Password != "" || newUser.Password != null) {
                await connection.ExecuteAsync(@"
                    INSERT INTO user (FirstName, LastName, Username, Password)
                        VALUES (@FirstName, @LastName, @Username, @Password);", newUser);

                return Results.Ok();
            }
            else {
                return Results.BadRequest();
            }
        });

        group.MapPost("/Login", 
            [AllowAnonymous]
            (UserDtos UserLogin, [FromServices] MySqlConnection connection) => {
            var users = connection.Query<UserDtos>(@"
            SELECT Username, Password FROM user WHERE Username = @Username AND Password = @Password LIMIT 1;",
            new {Username = UserLogin.UserName,
                 Password = UserLogin.Password});

            var newUsers = users.ToArray();

            if (newUsers.Length == 0) return Results.BadRequest();

            if (newUsers[0].UserName == UserLogin.UserName &&
                newUsers[0].Password == UserLogin.Password) {
              var issuer = app.Configuration["Jwt:Issuer"];
              var audience = app.Configuration["Jwt:Audience"];
              var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(app.Configuration["Jwt:Key"]));
              var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
              
              var token = new JwtSecurityToken(
                  issuer: issuer, 
                  audience: audience,
                  signingCredentials: credentials);

              var tokenHandler = new JwtSecurityTokenHandler();
              var stringToken = tokenHandler.WriteToken(token);
              return Results.Ok(stringToken);
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
