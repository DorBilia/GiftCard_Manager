# GiftCards Manager

## Description

GiftCards Manager is a web application designed to help users manage their gift cards effectively. It includes features for tracking balances, expiration dates, and usage history. The application consists of a backend API and a frontend user interface.

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- python with pip (or uv)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r Requirements.txt
   ```

3. Set up environment variables (create a `.env` file based on `.env.example`).

4. Run the backend server:
   ```bash
   python ./main.py
   ```
   The backend will run on `http://localhost:8000` (or as configured).

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install.
   ```
   
3. Set up environment variables (create a `.env` file based on `.env.example`).

4. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000` (or as configured).

### Running the Application

- Ensure both backend and frontend are running.
- Open your browser and navigate to the frontend URL to start using the application.