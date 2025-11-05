# Rena Hem & Kontorsservice

Professional cleaning company website with contact form and email integration.

## Project Structure

```
renahem/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── css/
│   │   └── styles.css     # All styles
│   ├── js/
│   │   └── main.js        # JavaScript functionality
│   └── images/
│       └── renahem.png    # Company logo
│
├── server/                # Backend server
│   └── server.js          # Express + SendGrid email server
│
├── .env                   # Environment variables (not in git)
├── .env.example          # Environment template
├── .gitignore            # Git exclusions
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Features

- Clean, modern single-page website design
- Responsive mobile-friendly layout
- Price calculator for cleaning services
- Animated service cards and parallax effects
- Contact form with email integration (SendGrid)
- Professional separation of HTML, CSS, and JavaScript

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your details:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
PORT=3000
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL_TO=info@renahem.se
VERIFIED_SENDER=noreply@renahem.se
```

### 3. SendGrid Setup

1. Create a free account at [SendGrid](https://signup.sendgrid.com/)
2. Verify your sender email address in SendGrid dashboard
3. Create an API key with "Mail Send" permissions
4. Add the API key to your `.env` file

### 4. Run the Server

```bash
npm start
```

The server will start on http://localhost:3000

### 5. Open in Browser

Navigate to http://localhost:3000 to view the website

## Development

### Running in Development Mode

For development with auto-restart on file changes, install nodemon:

```bash
npm install -D nodemon
```

Then run:

```bash
npm run dev
```

## Testing the Contact Form

1. Make sure the server is running (`npm start`)
2. Fill out the contact form on the website
3. Submit the form
4. Check the email address configured in `EMAIL_TO`

## Technologies Used

- **Frontend:**
  - HTML5
  - Tailwind CSS (via CDN)
  - Vanilla JavaScript
  - Lucide Icons

- **Backend:**
  - Node.js
  - Express.js
  - SendGrid (email service)
  - CORS

## Contact

For questions or support, contact: info@renahem.se
