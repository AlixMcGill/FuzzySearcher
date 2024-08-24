# Fuzzy Searcher

## Project Requirements
- Import data into a database than have a page search/filter those results.
- Have a form on the page that submits to the database.
- Have a page behind a member login.

## Project Stack
- Frontend
  - Vanilla Html, Css, Js
- Database
  - MySql
- Backend
  - Asp.Net
  - Minimal api for request handling
  - Dapper for database querys
  - Jwt for auth

## Project Walkthough

### User Login

<p align="center">All pages reroute to the login page if a user is not currently logged in.</p>
<p align="center"><img src="https://github.com/AlixMcGill/FuzzySearcher/blob/main/assets/LoginPage.PNG" width=40% height=40%></p>

### Create An Account

<p align="center">Users without an account can create a new one and are redirected back to the login page after creation.</p>
<p align="center"><img src="https://github.com/AlixMcGill/FuzzySearcher/blob/main/assets/CreateNewAccount.PNG" width=40% height=40%></p>

### Main Page

<p align="center">Once a user is logged in and auth is passed, the user is redirected to the main post page.</p>
<p align="center"><img src="https://github.com/AlixMcGill/FuzzySearcher/blob/main/assets/MainPostPage.PNG" width=40% height=40%></p>

### Filter Loaded Page Content

<p align="center">Allows user to filter currently loaded assets</p>
<p align="center"><img src="https://github.com/AlixMcGill/FuzzySearcher/blob/main/assets/FilterPagePosts.PNG" width=40% height=40%></p>

### Filter Search Posts Database

<p align="center">User can search the database for a specific post by post title</p>
<p align="center"><img src="https://github.com/AlixMcGill/FuzzySearcher/blob/main/assets/FIlterSearchDatabase.PNG" width=40% height=40%></p>

### Create New Post

<p align="center">Posts contain a title and body. Characters update as the user types the content of their post.</p>
<p align="center"><img src="https://github.com/AlixMcGill/FuzzySearcher/blob/main/assets/CreateNewPost.PNG" width=40% height=40%></p>

### User Profile Page

<p align="center">Contains all the logged in users post, first name, last name, and sum of all post likes.</p>
<p align="center"><img src="https://github.com/AlixMcGill/FuzzySearcher/blob/main/assets/ProfilePage.PNG" width=40% height=40%></p>

### Delete Post

<p align="center">Removes a post from the database</p>
<p align="center"><img src="https://github.com/AlixMcGill/FuzzySearcher/blob/main/assets/DeletePost.PNG" width=40% height=40%></p>

### Liking Posts

<p align="center">Users can like and unlike posts. user likes do not persist on reload/relogin in current implementation. But post likes are tracked and updated in the database.</p>

## Unimplemented Features
<p align="center">I did not want to stray too far from the project requirements. However, here are some features I would have liked to implement but decided against, given the context.</p>

- Persisted likes per user.
- Individual profile pages when you click on a username inside a post.
- User bios.
- lazy loading posts (i.e. only loads 10 posts at a time. When the user scrolls to bottom of the page another 10 will be loaded.)
- some kind of following system

## Key Takeaways / Issues
- <p align="center">I am almost certain i've implemented the Jwt wrong. It works but having a seperate cookie to store the username to create other api calls definately feels wrong.</p>
