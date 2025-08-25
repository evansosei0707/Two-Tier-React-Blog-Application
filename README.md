# Two-Tier FastAPI Blog Application

A simple, responsive blog application built with React (frontend) and FastAPI (backend). This project demonstrates a clean two-tier architecture with a React frontend that connects to a FastAPI backend server Link to [FastAPI Backend Repository](https://github.com/adr1enbe4udou1n/fastapi-realworld-example-app).

## 🏗️ Architecture

- **Frontend**: React with Vite, Tailwind CSS for styling
- **Backend**: FastAPI (Python) - deployed separately on EC2 with ALB frontend by Cloudfront Distribution. Postgres RDS for the database.
- **Deployment**: Frontend can be deployed to AWS S3 + CloudFront

## 📋 Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- A running FastAPI backend server (on EC2 or locally)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/evansosei0707/Two-Tier-React-Blog-Application.git
cd Two-Tier-React-Blog-Application
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your backend server details:

   ```env
   VITE_API_BASE_URL=http://your-ec2-instance-ip:8000/api
   ```

   **Examples:**

   - For EC2 deployment: `VITE_API_BASE_URL=http://your-ec2-public-ip:8000/api`
   - For local development: `VITE_API_BASE_URL=http://localhost:8000/api`
   - For domain with SSL: `VITE_API_BASE_URL=https://api.yourdomain.com or s3 site url or cloudfront distribution url/api`

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Backend Server Requirements

Your FastAPI backend server should provide the following endpoints:

- `GET /api/articles/` - Fetch all articles
- `GET /api/articles/{id}` - Fetch specific article
- `GET /api/articles/{id}/comments/` - Fetch comments for an article

### Expected API Response Format

**Articles:**

```json
{
  "id": 1,
  "title": "Article Title",
  "description": "Article description",
  "content": "Full article content",
  "author": "Author Name",
  "author_image": "https://example.com/author.jpg",
  "tags": ["tag1", "tag2"],
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Comments:**

```json
{
  "id": 1,
  "content": "Comment content",
  "author": "Commenter Name",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## 🚀 Deployment

### Frontend Deployment (AWS S3 + CloudFront)

1. Build the application:

   ```bash
   npm run build
   ```

2. Upload the `dist/` folder contents to your S3 bucket

3. Configure CloudFront distribution for the S3 bucket

4. Update your domain DNS to point to CloudFront

### Backend Deployment (EC2)

Ensure your FastAPI backend is running on EC2 with:

- Proper security groups (allow HTTP/HTTPS traffic)
- CORS configuration to allow requests from your frontend domain
- SSL certificate for production (recommended)

## 🔒 Security Considerations

- Never commit `.env` files to version control
- Use HTTPS in production
- Configure proper CORS settings on your backend
- Use environment variables for all sensitive configuration

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/
│   └── ArticleDetailPage.jsx
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **API Connection Failed**

   - Check if your backend server is running
   - Verify the `VITE_API_BASE_URL` in your `.env` file
   - Ensure CORS is properly configured on your backend

2. **Build Errors**

   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check Node.js version compatibility

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS classes

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Review the backend API requirements
3. Create an issue in the repository with detailed information about your problem
