import React, { useState, useEffect } from "react"
import { ExternalLink, Loader2, Search, X } from "lucide-react" // Importing icons
import ArticleDetailPage from "./components/ArticleDetailPage"

// Base URL for your FastAPI backend from environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"

// Helper function to format dates
const formatDateTime = (isoString) => {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date)
}

// Article Card Component for displaying a summary of an article
const ArticleCard = ({ article, onSelectArticle }) => (
  <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-indigo-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <img
          src={
            article.author.image ||
            `https://ui-avatars.com/api/?name=${article.author.username}&background=6366f1&color=fff&size=40`
          }
          alt={article.author.username}
          className="w-10 h-10 rounded-full border-2 border-indigo-100 object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {article.author.username}
          </p>
          <p className="text-gray-500 text-xs">
            {formatDateTime(article.createdAt)}
          </p>
        </div>
      </div>
    </div>

    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
      {article.title}
    </h2>
    <p className="text-gray-600 text-base mb-6 leading-relaxed line-clamp-3">
      {article.description}
    </p>

    <div className="flex flex-wrap gap-2 mb-6">
      {article.tagList.slice(0, 3).map((tag) => (
        <span
          key={tag}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-100"
        >
          #{tag}
        </span>
      ))}
      {article.tagList.length > 3 && (
        <span className="text-gray-400 text-xs font-medium px-3 py-1.5">
          +{article.tagList.length - 3} more
        </span>
      )}
    </div>

    <button
      onClick={() => onSelectArticle(article.slug)}
      className="group inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-300 transform hover:scale-105"
    >
      Read Full Article
      <ExternalLink
        size={18}
        className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
      />
    </button>
  </div>
)

// Search and Filter Component
const SearchAndFilter = ({ searchTerm, onSearchChange, onClearSearch }) => {
  return (
    <div className="mb-12">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search articles by title, description, or tags..."
            className="block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Article List Page Component
const ArticleListPage = ({ onSelectArticle }) => {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/articles`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setArticles(data.articles)
        setFilteredArticles(data.articles)
      } catch (e) {
        console.error("Failed to fetch articles:", e)
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredArticles(articles)
    } else {
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          article.tagList.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
      setFilteredArticles(filtered)
    }
  }, [searchTerm, articles])

  const handleSearchChange = (term) => {
    setSearchTerm(term)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2
            className="animate-spin text-indigo-600 mx-auto mb-4"
            size={64}
          />
          <p className="text-indigo-600 text-xl font-semibold">
            Loading Articles...
          </p>
          <p className="text-gray-500 mt-2">
            Discovering amazing content for you
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Articles
          </h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-600 text-2xl">📝</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No Articles Found
          </h2>
          <p className="text-gray-500">
            The blog is empty or there was an issue fetching articles.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Latest Articles
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover insightful articles, tutorials, and stories from our
            community of writers
          </p>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
        />

        {/* Results Info */}
        {searchTerm && (
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              Found{" "}
              <span className="font-semibold text-indigo-600">
                {filteredArticles.length}
              </span>{" "}
              article{filteredArticles.length !== 1 ? "s" : ""}
              {searchTerm && (
                <span>
                  {" "}
                  matching "<span className="font-semibold">{searchTerm}</span>"
                </span>
              )}
            </p>
          </div>
        )}

        {/* Articles Grid */}
        {filteredArticles.length === 0 && searchTerm ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or browse all articles
            </p>
            <button
              onClick={handleClearSearch}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-300"
            >
              Show All Articles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                onSelectArticle={onSelectArticle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Header Component
const Header = ({ currentPage, onNavigateHome }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="group flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                BlogSpace
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                Professional Blog Platform
              </p>
            </div>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={onNavigateHome}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentPage === "list"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              Articles
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <h3 className="text-xl font-bold">BlogSpace</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              A modern, professional blog platform for sharing ideas, stories,
              and insights with the world.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  All Articles
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Authors
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  RSS Feed
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} BlogSpace. All rights reserved.
            Built with ❤️ for the community.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState("list") // 'list' or 'detail'
  const [selectedSlug, setSelectedSlug] = useState(null)

  const handleSelectArticle = (slug) => {
    setSelectedSlug(slug)
    setCurrentPage("detail")
  }

  const handleBackToList = () => {
    setSelectedSlug(null)
    setCurrentPage("list")
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
      <Header currentPage={currentPage} onNavigateHome={handleBackToList} />

      <main className="min-h-screen">
        {currentPage === "list" && (
          <ArticleListPage onSelectArticle={handleSelectArticle} />
        )}
        {currentPage === "detail" && selectedSlug && (
          <ArticleDetailPage
            slug={selectedSlug}
            onBackToList={handleBackToList}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
