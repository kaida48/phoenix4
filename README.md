# Project Phoenix - Our Website

> domain = project-phoenix.online

Welcome to the main hangout spot for everything about the Phoenix Roleplay universe!

## Vision & Purpose

Project Phoenix is set to be the ultimate destination for the Phoenix Roleplay community. It’s not just a character database; it’s gonna be:

- **The Gateway**: The first place for newbies to explore the Phoenix universe
- **The Library**: A full collection of stories, factions, and all that world history
- **The Workshop**: A space for players to create and submit their characters for approval
- **The Admin Center**: The spot where mods and admins keep an eye on the roleplay scene

## Core Features

### World Immersion

- **Interactive World Map**: Check out the Sunrise Isles and learn about every spot
- **Faction Profiles**: Get the lowdown on each faction’s history, values, and territories
- **Timeline of Events**: A chronological rundown of major events in the world
- **Media Gallery**: Art, music, and other cool stuff that bring the world to life

### Character System

- **Character Creation**: Super easy tools for crafting your unique characters
- **Approval Process**: A straightforward way to submit and get characters reviewed
- **Character Portfolios**: View character info that's either public or private
- **Character Relationships**: See how characters are linked up

### Community Features

- **Forums/Discussion Boards**: Organized by faction and topic to chat easily
- **Events Calendar**: A schedule of upcoming roleplay events so you don’t miss out
- **Player Directory**: Find other players and check out their characters

### Administrative Tools

- **Moderation Dashboard**: Tools that help manage the community smoothly
- **Content Management**: Easy updates for world info and news
- **Analytics**: Insights on how active the community is and how it’s growing
- **Announcement System**: A way to share important updates with everyone

## Development Status

We’re actively working on this project and kicking things off in these areas:

### What We've Accomplished So Far

✅ **User Authentication**

- Users can sign up with a username, email, and password
- Smooth login experience
- Controls based on user roles (USER, MODERATOR, ADMIN)

✅ **Database Structure**

- A user model that links different accounts
- A character model with various faction types
- Added features for usernames
- Fields for character details like skills and relationships

✅ **Admin System**

- An admin dashboard for checking out characters
- The ability to approve or deny characters
- Managing user roles easily

✅ **Character System**

- Basic functions to create characters
- A character list to browse
- An approval process for characters

### What Still Needs to Be Implemented

1. **Character Detail Page**
   - Create a page where users can view all character details and switch between them

2. **Consistent Navbar**
   - Set up a navigation bar that shows up on every page 

3. **Character Rejection System**
   - Let admins reject characters and notify users about it

4. **Item Source Tracking**
   - Keep track of how characters got their items
   - Make a list of items to choose from
   - Update character creation forms

5. **Character Editing**
   - Allow users to tweak their characters
   - Set up a re-approval process for edited characters
   - Keep a history of character changes

6. **Email Verification**
   - Set up email sending functions
   - Create a way for users to verify their accounts
   - Add options for password resets

7. **Auth Token System**
   - Generate unique tokens for accounts
   - Allow admins to impersonate users if needed

## Technical Foundation

- **Frontend**: We’re using Next.js with React and TailwindCSS for the design
- **Backend**: Built on Next.js API routes with a PostgreSQL database
- **Authentication**: Users have secure accounts with different permissions
- **Responsive Design**: Looks great on both computers and mobile devices

## Accessing the Repository

This repository is mainly for internal development and backups. The code is visible to the public, but we’re not looking for outside contributions right now.

### For Players

- Keep up with development news on our [Discord Server](https://discord.gg/CassDfZnmQ)
- Thanks for being patient as we build this out!

### For Internal Use

- Clone the repository for local testing and development
- Send any changes for reviews and integration

## Development Setup

bash
# Clone the repository
git clone https://github.com/your-organization/phoenix-roleplay.git

# Install dependencies
cd phoenix-roleplay
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Initialize database
npx prisma migrate dev