# Event Management System

## 🚀 Overview

The **Event Management System** is a cutting-edge, full-stack application
designed to streamline event creation, management, and attendance. Built with
**Next.js 14** on the frontend and a powerful backend API, this platform
delivers a seamless event management experience with an intuitive user interface
and robust features.

---

## ✨ Features

- **🔎 Event Discovery**: Browse, search, and filter events effortlessly.
- **📍 Event Details**: View event descriptions, locations, dates, and available
  ticket options.
- **🔐 User Authentication**: Secure login and registration with **JWT-based
  authentication** and **role-based access control**.
- **🎟 Ticket Management**: Purchase tickets with multiple pricing options for
  different event areas.
- **🛒 Shopping Cart**: Add multiple tickets and adjust quantities before
  checkout.
- **👤 User Profiles**: Manage personal information and access ticket history.
- **⭐ Feedback System**: Rate and leave comments on attended events.
- **🛠 Admin Dashboard**: Manage events, users, and registrations efficiently.
- **📱 Responsive UI**: Fully optimized for desktop and mobile devices.

---

## 🛠 Technology Stack

### **Frontend**

| Category               | Technology      |
| ---------------------- | --------------- |
| **Framework**          | Next.js 14      |
| **Language**           | TypeScript      |
| **Styling**            | Tailwind CSS    |
| **Animations**         | Framer Motion   |
| **State Management**   | Zustand         |
| **API Communication**  | Axios           |
| **Form Handling**      | React Hook Form |
| **Notifications**      | React Toastify  |
| **Data Visualization** | Recharts        |

### **Backend**

- **RESTful API**: Provides secure and scalable backend services.
- **JWT Authentication**: Ensures safe user authentication and session
  management.

---

## ⚡ Getting Started

### 1️⃣ Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager

### 2️⃣ Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**: Create a `.env.local` file and add:

   ```ini
   NEXT_PUBLIC_API_URL=https://your-api-url.com
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎭 User Roles & Permissions

| Role                | Capabilities                                       |
| ------------------- | -------------------------------------------------- |
| **Visitor**         | Browse and view event details                      |
| **Registered User** | Purchase tickets, provide feedback, manage profile |
| **Event Organizer** | Create and manage their own events                 |
| **Administrator**   | Full system access, manage all entities            |

---

## 🔄 Key Workflows

### 🎫 **Attending an Event**

1. Browse/search for events.
2. Select an event to view details.
3. Choose an event area and purchase tickets.
4. Complete the checkout process.
5. Access purchased tickets in the **Profile** section.

### 📅 **Creating an Event** (Organizer)

1. Access the **Event Creation Form**.
2. Provide event details and upload an event image.
3. Configure **event areas**, capacities, and pricing.
4. **Publish** the event.

---

## 🚀 Deployment

The application is optimized for deployment on **Vercel** or **Netlify**.

```bash
npm run build
# or
yarn build
```

---

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for
more details.

---

🎉 _Empowering event organizers and attendees with a seamless digital
experience!_
