import React, { useEffect, useState } from 'react';
import { Article } from './Article';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AdminArticleApproval = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('https://cise-project-backend.vercel.app/api/articles')
      .then((res) => res.json())
      .then((data) => {
        const pendingArticles = data.filter((article: Article) => article.status === 'pending');
        setArticles(pendingArticles);
      })
      .catch((err) => console.log('Error from AdminArticleApproval: ' + err));
  }, []);

  const approveArticle = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    fetch(`https://cise-project-backend.vercel.app/api/articles/${id}/approve`, { method: 'PUT' })
      .then(() => {
        setArticles(articles.filter(article => article._id !== id));
      })
      .catch((err) => console.log('Error from approveArticle: ' + err));
  };

  const denyArticle = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    fetch(`https://cise-project-backend.vercel.app/api/articles/${id}/deny`, { method: 'PUT' })
      .then(() => {
        setArticles(articles.filter(article => article._id !== id));
      })
      .catch((err) => console.log('Error from denyArticle: ' + err));
  };

  const showArticleDetails = (id: string) => {
    router.push(`/show-article/${id}`);
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
              <div key={article._id} className='card-container' onClick={() => showArticleDetails(article._id || '')}>
                <div className='desc'>
                  <h2>{article.title}</h2>
                  <h3>{article.author}</h3>
                  <p>{article.claim}</p>
                  <button onClick={(event) => approveArticle(article._id || '', event)} className='btn btn-outline-success'>Approve</button>
                  <button onClick={(event) => denyArticle(article._id || '', event)} className='btn btn-outline-danger'>Deny</button>
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