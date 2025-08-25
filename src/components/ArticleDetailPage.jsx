import React, { useState, useEffect } from 'react';
import { Loader2, MessageCircle,  ArrowLeft, Calendar, Clock } from 'lucide-react';

// Base URL for your FastAPI backend from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper function to format dates
const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
};

// Comments List Component
const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg font-medium">No comments yet</p>
        <p className="text-gray-400 text-sm mt-2">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center mb-8">
        <MessageCircle size={24} className="text-indigo-600 mr-3" />
        <h3 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>
      
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <div key={comment.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <img 
                src={comment.author.image || `https://ui-avatars.com/api/?name=${comment.author.username}&background=6366f1&color=fff&size=48`} 
                alt={comment.author.username} 
                className="w-12 h-12 rounded-full border-2 border-indigo-100 object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900">{comment.author.username}</h4>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock size={14} className="mr-1" />
                      <span>{formatDateTime(comment.createdAt)}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                    #{index + 1}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Article Detail Page Component
const ArticleDetailPage = ({ slug, onBackToList }) => {
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleAndComments = async () => {
      try {
        setLoading(true);
        // Fetch article
        const articleResponse = await fetch(`${API_BASE_URL}/articles/${slug}`);
        if (!articleResponse.ok) {
          throw new Error(`HTTP error! status: ${articleResponse.status}`);
        }
        const articleData = await articleResponse.json();
        setArticle(articleData.article);

        // Fetch comments
        const commentsResponse = await fetch(`${API_BASE_URL}/articles/${slug}/comments`);
        if (!commentsResponse.ok) {
          throw new Error(`HTTP error! status: ${commentsResponse.status}`);
        }
        const commentsData = await commentsResponse.json();
        setComments(commentsData.comments);

      } catch (e) {
        console.error("Failed to fetch article or comments:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticleAndComments();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={64} />
          <p className="text-indigo-600 text-xl font-semibold">Loading Article...</p>
          <p className="text-gray-500 mt-2">Please wait while we fetch the content</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Article</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={onBackToList}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-300"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-600 text-2xl">📄</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Article Not Found</h2>
          <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={onBackToList}
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={onBackToList}
          className="group inline-flex items-center mb-8 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300 shadow-sm border border-gray-200"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Articles
        </button>

        {/* Article Content */}
        <article className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Article Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-white">
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src={article.author.image || `https://ui-avatars.com/api/?name=${article.author.username}&background=ffffff&color=6366f1&size=64`} 
                alt={article.author.username} 
                className="w-16 h-16 rounded-full border-4 border-white/20 object-cover"
              />
              <div>
                <p className="text-white/90 text-sm font-medium">Written by</p>
                <p className="text-white text-xl font-bold">{article.author.username}</p>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{article.title}</h1>
            <p className="text-white/90 text-xl leading-relaxed mb-6">{article.description}</p>
            
            <div className="flex items-center space-x-6 text-white/80">
              <div className="flex items-center">
                <Calendar size={18} className="mr-2" />
                <span>{formatDateTime(article.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle size={18} className="mr-2" />
                <span>{comments.length} comments</span>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="px-8 py-12">
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
              <div className="whitespace-pre-wrap text-lg leading-8">{article.body}</div>
            </div>
            
            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-3">
                {article.tagList.map((tag) => (
                  <span key={tag} className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-colors duration-300">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-12">
          <CommentList comments={comments} />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;