# Absensi Service

Absensi Service is an API for managing employee attendance and leave requests.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database.
- **Swagger**: API documentation.
- **JWT**: JSON Web Tokens for authentication.
- **Axios**: Promise-based HTTP client.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/) installed.
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running.

### Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/mrsyafapri/assist-absensi.git
   cd assist-absensi
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Create a `.env` file in the root directory and add the following configuration**:

   ```env
   DATABASE_URL=mongodb://localhost:27017/absensi
   PORT=3005
   SECRET_TOKEN=secret_key
   PERUSAHAAN_SERVICES_URLS=http://localhost:3000,http://localhost:3001
   ```

4. **Start the server**:

   ```sh
   npm start
   ```

5. **Access the API documentation**:
   Open your browser and go to [http://localhost:3005/api-docs](http://localhost:3005/api-docs).

## API Endpoints

### Authentication

- **Middleware**: `auth` (for protected routes) and `requireAdmin` (for admin routes).

### Absensi

- **Absensi untuk tiap pegawai**

  - **Requests**:

  ```
  POST /api/v1/absensi/mark
  {
      "date": "YYYY-MM-DD",
      "status": "present" | "absent" | "late"
  }
  ```

  - **Responses**:
    - `201`: Attendance marked successfully
    - `400`: Invalid data
    - `500`: Internal server error

### Izin cuti

- **Izin cuti untuk tiap pegawai**

  - **Requests**:

  ```
  POST /api/v1/absensi/leave
  {
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "reason": "Reason for leave"
  }
  ```

  - **Responses**:
    - `201`: Leave request submitted successfully
    - `400`: Invalid data or end date cannot be earlier than start date
    - `409`: Leave request conflicts with an existing leave request
    - `500`: Internal server error

- **Approval izin cuti pegawai oleh admin**
  - **Requests**:
  ```
  PUT /api/v1/absensi/leave/{id}/status
  {
    "status": "approved" | "rejected"
  }
  ```
  - **Responses**:
    - `200`: Leave request status updated successfully
    - `400`: Invalid status
    - `403`: Unauthorized: Only admins can update leave status
    - `404`: Leave request not found
    - `500`: Internal server error

### Laporan

- **Laporan absen dan izin cuti tiap pegawai dalam waktu tertentu**
  - **Requests**:
  ```
  GET /api/v1/absensi/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
  ```
  - **Responses**:
    - `200`: Report generated successfully
    - `400`: Start date and end date are required
    - `500`: Internal server error

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL=mongodb://localhost:27017/absensi
PORT=3005
SECRET_TOKEN=secret_key
PERUSAHAAN_SERVICES_URLS=http://localhost:3000,http://localhost:3001
```
