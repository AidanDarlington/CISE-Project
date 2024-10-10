import { Article } from './Article';
import Link from 'next/link';
import React, { useState, useEffect, ChangeEvent } from 'react';
import ArticleCard from './ArticleCard';

function ShowArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchWord, setSearchWord] = useState<string>('');
  const [role, setRole] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    fetch('http://localhost:8082/api/articles')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched data:', data);
        if (Array.isArray(data)) {
          const approvedArticles = data.filter((article: Article) => article.status === 'approved');
          setArticles(approvedArticles);
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

  const filteredArticles = articles.filter(
    (article) => article.claim && article.claim.toLowerCase().includes(searchWord.toLowerCase())
  );

  const sortedArticles = filteredArticles.sort((a, b) =>
    (a.claim?.toLowerCase() ?? '').localeCompare(b.claim?.toLowerCase() || '')
  );

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
              placeholder='Search by claim'
              value={searchWord}
              onChange={handleSearchChange}
              className='form-control mx-3 search-input'
              style={{ flex: 1 }}
            />
            <Link href='/signin' className='btn btn-black'>
              Sign In
            </Link>
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
          </div>
        </div>

        <div className='list'>{articleList}</div>
      </div>
    </div>
  );
}

export default ShowArticleList;