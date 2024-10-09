import { Article } from './Article';
import Link from 'next/link';
import React, { useState, useEffect, ChangeEvent } from 'react';
import ArticleCard from './ArticleCard';

function ShowArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchWord, setSearchWord] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:8082/api/articles')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched data:', data);
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      })
      .catch((err) => console.log('Error from ShowArticleList: ' + err));
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
            <Link href='/create-article' className='btn btn-outline-warning'>
              + Add New Article
            </Link>
            <input
              type='text'
              placeholder='Search by claim'
              value={searchWord}
              onChange={handleSearchChange}
              className='form-control mx-3'
              style={{ flex: 1 }}
            />
            <Link href='/signin' className='btn btn-outline-info'>
              Sign In
            </Link>
          </div>
        </div>

        <div className='list'>{articleList}</div>
      </div>
    </div>
  );
}

export default ShowArticleList;