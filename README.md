# Project Phoenix - The Official Hub
> domain = project-phoenix.online

The central platform for everything related to the Phoenix Roleplay universe.

## Vision & Purpose

Project Phoenix will serve as the definitive central hub for the Phoenix Roleplay community. Far more than just a character database, this platform will become:

- **The Gateway**: The first touchpoint for newcomers discovering the Phoenix universe
- **The Library**: A comprehensive repository of lore, faction information, and world history
- **The Workshop**: Where players craft and submit their characters for approval
- **The Administrative Hub**: Where moderators and admins manage the roleplay community

## Core Features

### World Immersion

- **Interactive World Map**: Explore the Sunrise Isles with location-specific lore
- **Faction Profiles**: Detailed information about each faction's history, values, and territories
- **Timeline of Events**: Chronological documentation of major world events
- **Media Gallery**: Artwork, music, and other media that brings the world to life

### Character System

- **Character Creation**: Intuitive interface for building detailed characters
- **Approval Workflow**: Streamlined submission and review process
- **Character Portfolios**: Public and private views of character information
- **Character Relationships**: Visualize connections between different characters

### Community Features

- **Forums/Discussion Boards**: Organized by faction and topic
- **Events Calendar**: Schedule of upcoming roleplay events
- **Player Directory**: Find other players and their characters

### Administrative Tools

- **Moderation Dashboard**: Comprehensive tools for community management
- **Content Management**: Easy updating of world information and news
- **Analytics**: Insights into community engagement and growth
- **Announcement System**: Broadcast important updates to all users

## Development Status

This project is currently in active development, with the following components being prioritized:

### What We've Accomplished So Far

✅ **User Authentication**

- Registration with username/email/password
- Login functionality
- Role-based access control (USER, MODERATOR, ADMIN)

✅ **Database Structure**

- User model with proper relationships
- Character model with faction types
- Migration for adding username field
- JSON fields for character attributes (skills, relationships)

✅ **Admin System**

- Admin dashboard to view characters
- Ability to approve/reject characters
- User role management

✅ **Character System**

- Basic character creation
- Character listing
- Approval workflow

### What Still Needs to be Implemented

1. ~~**Character Detail Page**~~
   - ~~Complete implementation to view all character details~~
   - ~~Add navigation between character views~~

2. **Consistent Navbar**
   - Create a shared Navbar.tsx component
   - Ensure it appears consistently on all pages

3. **Character Rejection System**
   - Add explicit rejection functionality
   - Implement notifications for rejected characters
   - Add auto-delete or manual delete options

4. **Item Source Tracking**
   - Add fields for how characters obtained items
   - Create selectable item list
   - Update character creation form

5. **Character Editing**
   - Complete edit functionality
   - Implement re-approval requirements
   - Preserve character history

6. **Email Verification**
   - Set up email sending functionality
   - Create verification flow
   - Add password reset capability

7. **Auth Token System**
   - Generate unique tokens for each account
   - Add admin impersonation capability

## Technical Foundation

- **Frontend**: Next.js with React and TailwindCSS
- **Backend**: Next.js API routes with PostgreSQL database
- **Authentication**: Secure user accounts with role-based permissions
- **Responsive Design**: Full functionality across desktop and mobile devices

## Accessing the Repository

This repository is primarily used for internal development, version control, and backup purposes. While the code is publicly visible, we are not currently accepting external contributions.

### For Players

- Follow development updates on our [Discord Server](https://discord.gg/CassDfZnmQ)
- Just wait for now

### For Internal Use

- Clone the repository for local development and testing
- Submit pull requests for code review and integration

## Development Setup

```bash
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

# Start development server
npm run dev
```

## The Road Ahead

Project Phoenix is an evolving platform that will grow alongside our roleplay community. Future plans include:

---

Join us in building not just a website, but a digital home for the Phoenix Roleplay community—where stories are born, characters come alive, and a rich world awaits exploration.

**Project Phoenix Administration Team**

---

> *Hey, here's Kaida, literally the only developer for this site and this project overall. I came up with the ideas, make the website, document, etc. Just know that I put in lots of love and effort in this and I hope you enjoy it ❤️*
