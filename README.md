# Absensi Service

Absensi Service is an API that allows for marking attendance, requesting leaves, and generating reports.

## Features

- Mark attendance
- Request leaves
- Approve or reject leave requests (admin only)
- Generate attendance and leave reports

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

### Absensi

- **Endpoint:** `/api/v1/absensi/mark`

  **Method:** `POST`

  **Description:** Absensi untuk tiap pegawai

  **Headers:**

  - `Authorization: Bearer <token>`

  **Request Body:**

  ```json
  {
    "date": "2024-06-23",
    "status": "present"
  }
  ```

  **Responses:**

  - `201`: Attendance marked successfully.
  - `400`: Invalid data or attendance already marked for this date.
  - `500`: Internal server error.

### Izin Cuti

- **Endpoint:** `/api/v1/absensi/leave`

  **Method:** `POST`

  **Description:** Izin cuti untuk tiap pegawai

  **Headers:**

  - `Authorization: Bearer <token>`

  **Request Body:**

  ```json
  {
    "startDate": "2024-06-23",
    "endDate": "2024-06-25",
    "reason": "Family vacation"
  }
  ```

  **Responses:**

  - `201`: Leave request submitted successfully.
  - `400`: Invalid data or end date cannot be earlier than start date.
  - `409`: Leave request conflicts with an existing leave request.
  - `500`: Internal server error.

- **Endpoint:** `/api/v1/absensi/leave/{id}/status`

  **Method:** `PUT`

  **Description:** Approval izin cuti pegawai oleh admin

  **Headers:**

  - `Authorization: Bearer <token>`

  **Parameters:**

  - `id` (path): Leave request ID.

  **Request Body:**

  ```json
  {
    "status": "approved"
  }
  ```

  **Responses:**

  - `200`: Leave request status updated successfully.
  - `400`: Invalid status.
  - `403`: Unauthorized - Only admin can perform this action.
  - `404`: Leave request not found.
  - `500`: Internal server error.

### Laporan

- **Endpoint:** `/api/v1/absensi/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

  **Method:** `GET`

  **Description:** Laporan absen dan izin cuti tiap pegawai dalam waktu tertentu

  **Headers:**

  - `Authorization: Bearer <token>`

  **Query Parameters:**

  - `startDate` (query): Start date for the report (format: `YYYY-MM-DD`).
  - `endDate` (query): End date for the report (format: `YYYY-MM-DD`).

  **Responses:**

  - `200`: Report generated successfully.
  - `400`: Invalid data or start date and end date are required.
  - `500`: Internal server error.

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL=mongodb://localhost:27017/absensi
PORT=3005
SECRET_TOKEN=secret_key
PERUSAHAAN_SERVICES_URLS=http://localhost:3000,http://localhost:3001
```
