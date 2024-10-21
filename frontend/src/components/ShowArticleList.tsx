import { Article } from './Article';
import Link from 'next/link';
import React, { useState, useEffect, ChangeEvent } from 'react';
import ArticleCard from './ArticleCard';

function ShowArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchWord, setSearchWord] = useState<string>('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [claims, setClaims] = useState<string[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<string>('');
  const [role, setRole] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:8082/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const analyzedArticles = data.filter((article: Article) => article.status === 'analyzed');
          setArticles(analyzedArticles);

          // Extract unique authors and claims
          const uniqueAuthors = Array.from(new Set(analyzedArticles.map((article) => article.author)));
          const uniqueClaims = Array.from(new Set(analyzedArticles.map((article) => article.claim)));
          setAuthors(uniqueAuthors);
          setClaims(uniqueClaims);

          // Filter articles with valid publication_year
          const validDateArticles = analyzedArticles.filter(
            (article) => article.publication_year && !isNaN(new Date(article.publication_year).getTime())
          );

          if (validDateArticles.length > 0) {
            // Set default date range (oldest and newest article dates)
            const oldestArticle = validDateArticles.reduce((oldest, article) => {
              return new Date(article.publication_year) < new Date(oldest.publication_year) ? article : oldest;
            }, validDateArticles[0]);

            const newestArticle = validDateArticles.reduce((newest, article) => {
              return new Date(article.publication_year) > new Date(newest.publication_year) ? article : newest;
            }, validDateArticles[0]);

            setStartDate(new Date(oldestArticle.publication_year!).toISOString().substring(0, 10));
            setEndDate(new Date(newestArticle.publication_year!).toISOString().substring(0, 10));
          }
        } else {
          console.error('Fetched data is not an array:', data);
        }
      })
      .catch((err) => console.log('Error from ShowArticleList: ' + err));

    const storedRole = localStorage.getItem('role');
    setRole(storedRole);

    if (storedRole === 'admin') {
      fetch('http://localhost:8082/api/articles/pending/count')
        .then((res) => res.json())
        .then((data) => {
          setPendingCount(data.count);
        })
        .catch((err) => console.log('Error fetching pending articles count: ' + err));
    }
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const handleAuthorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuthor(e.target.value);
  };

  const handleClaimChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedClaim(e.target.value);
  };

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const calculateAverageRating = (ratings: number[]): number => {
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const filteredArticles = articles.filter((article) => {
    const isNumerical = /^\d+$/.test(searchWord);
    
    // Filter by publication year if searchWord is just 0-9
    if (isNumerical) {
      const year = String(article.publication_year).substring(0, 4);
      if (year && year.toString() !== searchWord) {
        return false;
      }
    }

    // Filter by search term in claim
    if (searchWord && !article.claim?.toLowerCase().includes(searchWord.toLowerCase())) {
      return false;
    }

    // Filter by selected author
    if (selectedAuthor && article.author !== selectedAuthor) {
      return false;
    }

    // Filter by selected claim
    if (selectedClaim && article.claim !== selectedClaim) {
      return false;
    }

    // Filter by date range
    const articleDate = new Date(article.publication_year!);
    const selectedStartDate = new Date(startDate);
    const selectedEndDate = new Date(endDate);
    if (articleDate < selectedStartDate || articleDate > selectedEndDate) {
      return false;
    }

    return true;
  });

  const sortedArticles = filteredArticles.sort((a, b) => {
    const avgRatingA = calculateAverageRating(a.ratings ?? []);
    const avgRatingB = calculateAverageRating(b.ratings ?? []);

    return sortOrder === 'asc' ? avgRatingA - avgRatingB : avgRatingB - avgRatingA;
  });

  const articleList =
    sortedArticles.length === 0
      ? 'there is no article record!'
      : sortedArticles.map((article, k) => <ArticleCard article={article} key={k} />);

  return (
    <div className='ShowArticleList'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <br />
            <h2 className='display-4 text-center'>Articles List</h2>
          </div>

          <div className='col-md-11 d-flex justify-content-between align-items-center'>
            <Link href='/create-article' className='btn btn-black'>
              + Add New Article
            </Link>
            <input
              type='text'
              placeholder='Search by claim/year'
              value={searchWord}
              onChange={handleSearchChange}
              className='form-control mx-3 search-input'
              style={{ flex: 1 }}
            />
            <Link href='/signin' className='btn btn-black'>
              Sign In
            </Link>

            {/* Admin-specific section */}
            {role === 'admin' && (
              <div className='d-flex align-items-center'>
                <Link href='/adminarticleapproval' className='btn btn-black ml-2'>
                  Review Pending Articles
                </Link>
                {pendingCount > 0 && (
                  <span className='badge badge-danger ml-2 pending-count'>{pendingCount}</span>
                )}
              </div>
            )}

            {/* Analyst-specific section */}
            {role === 'analyst' && (
              <div className='d-flex align-items-center'>
                <Link href='/analystreview' className='btn btn-black ml-2'>
                  Review Approved Articles
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Dropdown for authors */}
        <div className='d-flex justify-content-end mt-3'>
          <label htmlFor='author-select'>Filter by Author: </label>
          <select
            id='author-select'
            className='form-control mx-2'
            value={selectedAuthor}
            onChange={handleAuthorChange}
          >
            <option value=''>All Authors</option>
            {authors.map((author, index) => (
              <option key={index} value={author}>
                {author}
              </option>
            ))}
          </select>

          {/* Dropdown for claims */}
          <label htmlFor='claim-select' className='ml-3'>Filter by Claim: </label>
          <select
            id='claim-select'
            className='form-control mx-2'
            value={selectedClaim}
            onChange={handleClaimChange}
          >
            <option value=''>All Claims</option>
            {claims.map((claim, index) => (
              <option key={index} value={claim}>
                {claim}
              </option>
            ))}
          </select>
        </div>

        {/* Date range filter */}
        <div className='d-flex justify-content-end mt-3'>
          <label htmlFor='start-date'>From: </label>
          <input
            type='date'
            id='start-date'
            value={startDate}
            onChange={handleStartDateChange}
            className='form-control mx-2'
          />

          <label htmlFor='end-date' className='ml-3'>To: </label>
          <input
            type='date'
            id='end-date'
            value={endDate}
            onChange={handleEndDateChange}
            className='form-control mx-2'
          />
          
          <button
            className='btn btn-black ml-3'
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            Sort by Rating: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

        <div className='list mt-4'>{articleList}</div>
      </div>
    </div>
  );
}

export default ShowArticleList;
