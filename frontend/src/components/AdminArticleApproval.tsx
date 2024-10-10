import React, { useEffect, useState } from 'react';
import { Article } from './Article';
import Link from 'next/link';

const AdminArticleApproval = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('http://localhost:8082/api/articles')
      .then((res) => res.json())
      .then((data) => {
        const pendingArticles = data.filter((article: Article) => article.status === 'pending');
        setArticles(pendingArticles);
      })
      .catch((err) => console.log('Error from AdminArticleApproval: ' + err));
  }, []);

  const approveArticle = (id: string) => {
    fetch(`http://localhost:8082/api/articles/${id}/approve`, { method: 'PUT' })
      .then(() => {
        setArticles(articles.filter(article => article._id !== id));
      })
      .catch((err) => console.log('Error from approveArticle: ' + err));
  };

  const denyArticle = (id: string) => {
    fetch(`http://localhost:8082/api/articles/${id}/deny`, { method: 'PUT' })
      .then(() => {
        setArticles(articles.filter(article => article._id !== id));
      })
      .catch((err) => console.log('Error from denyArticle: ' + err));
  };

  return (
    <div className='AdminArticleApproval'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <br />
            <h2 className='display-4 text-center'>Pending Articles</h2>
            <Link href='/' className='btn btn-black float-left'>
              Show Article List
            </Link>
          </div>
        </div>
        <div className='list'>
          {articles.length === 0 ? (
            <p>No pending articles</p>
          ) : (
            articles.map((article) => (
              <div key={article._id} className='card-container'>
                <div className='desc'>
                  <h2>{article.title}</h2>
                  <h3>{article.author}</h3>
                  <p>{article.claim}</p>
                  <button onClick={() => approveArticle(article._id || '')} className='btn btn-outline-success'>Approve</button>
                  <button onClick={() => denyArticle(article._id || '')} className='btn btn-outline-danger'>Deny</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminArticleApproval;