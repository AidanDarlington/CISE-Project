import { Article } from './Article';
import Link from 'next/link';
import React, { useState, useEffect, ChangeEvent } from 'react';
import ArticleCard from './ArticleCard';

function ShowArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchWord, setSearchWord] = useState<string>('');
  const [role, setRole] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetch('http://localhost:8082/api/articles')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched data:', data);
        if (Array.isArray(data)) {
          const analyzedArticles = data.filter((article: Article) => article.status === 'analyzed');
          setArticles(analyzedArticles);
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

  const calculateAverageRating = (ratings: number[]): number => {
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const filteredArticles = articles.filter(article => {
    // Check if searchWord is all just 0-9
    const isNumerical = /^\d+$/.test(searchWord);
    
    // If searchWord is numerical, check if it matches published_year
    if (isNumerical) {
      const year = new String(article.publication_year).substring(0,4);
      return year !== undefined && year.toString() === searchWord; // Compare as strings
    }

    // Otherwise, we just check claims
    return article.claim?.toLowerCase().includes(searchWord.toLowerCase());
  });

  const sortedArticles = filteredArticles.sort((a, b) => {
    const avgRatingA = calculateAverageRating(a.ratings ?? []);
    const avgRatingB = calculateAverageRating(b.ratings ?? []);

    if (sortOrder === 'asc') {
      return avgRatingA - avgRatingB;
    } else {
      return avgRatingB - avgRatingA;
    }
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

        <div className='d-flex justify-content-end mt-3'>
          <button
            className='btn btn-black'
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            Sort by Rating: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

        <div className='list'>{articleList}</div>
      </div>
    </div>
  );
}

export default ShowArticleList;