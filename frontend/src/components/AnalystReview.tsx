import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Article } from './Article';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function AnalystReview() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [claim, setClaim] = useState<string>('');
  const [evidence, setEvidence] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:8082/api/articles')
      .then((res) => res.json())
      .then((data) => {
        const approvedArticles = data.filter((article: Article) => article.status === 'approved');
        setArticles(approvedArticles);
      })
      .catch((err) => console.log('Error from AnalystReview: ' + err));
  }, []);

  const analyzeArticle = (article: Article, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentArticle(article);
    setClaim(article.claim || '');
    setEvidence(article.evidence || '');
  };

  const handleClaimChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setClaim(event.target.value);
  };

  const handleEvidenceChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEvidence(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (currentArticle) {
      const updatedArticle = {
        ...currentArticle,
        claim,
        evidence,
        status: 'analyzed'
      };

      fetch(`http://localhost:8082/api/articles/${currentArticle._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArticle),
      })
      .then((res) => {
        console.log('Article updated:', res);
        setArticles((prevArticles) => prevArticles.filter(article => article._id !== currentArticle._id));
        setCurrentArticle(null);
      })
      .catch((err) => {
        console.log('Error updating article: ' + err);
      });
    }
  };

  const showArticleDetails = (id: string) => {
    router.push(`/show-article/${id}`);
  };

  return (
    <div className='ShowArticleList'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <br />
            <h2 className='display-4 text-center'>Articles Pending Analysis</h2>
            <Link href='/' className='btn btn-black float-left'>
              Show Article List
            </Link>
          </div>
        </div>

        <div className='list'>
          {articles.length === 0 ? (
            <p>No articles pending analysis</p>
          ) : (
            articles.map((article) => (
              <div key={article._id} className='card-container' onClick={() => showArticleDetails(article._id || '')}>
                <div className='desc'>
                  <h2>{article.title}</h2>
                  <h3>{article.author}</h3>
                  <p>{article.claim}</p>
                  <button onClick={(event) => analyzeArticle(article, event)} className='btn btn-outline-success'>
                    Analyze
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {currentArticle && (
          <div className='analysis-form'>
            <h2>Analyzing: {currentArticle.title}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className='form-group'>
                <label htmlFor='claim'>Claim</label>
                <textarea
                  id='claim'
                  name='claim'
                  className='form-control'
                  rows={4}
                  value={claim}
                  onChange={handleClaimChange}
                />
              </div>
              <br />
              <div className='form-group'>
                <label htmlFor='evidence'>Evidence</label>
                <textarea
                  id='evidence'
                  name='evidence'
                  className='form-control'
                  rows={6}
                  value={evidence}
                  onChange={handleEvidenceChange}
                />
              </div>
              <br />
              <button type='submit' className='btn btn-black mt-4 mb-4'>
                Submit Analysis
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalystReview;