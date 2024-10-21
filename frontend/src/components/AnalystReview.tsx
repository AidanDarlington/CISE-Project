import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Article } from './Article';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function AnalystReview() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [publishedArticles, setpA] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [claim, setClaim] = useState<string>('');
  const [evidence, setEvidence] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [publicationYear, setPublicationYear] = useState<string>('');
  const [DOI, setDOI] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('https://cise-projecttest-backend.vercel.app/api/articles')
      .then((res) => res.json())
      .then((data) => {
        const approvedArticles = data.filter((article: Article) => article.status === 'approved');
        setArticles(approvedArticles);
        const publishedArticles = data.filter((article: Article) => article.status === 'analyzed');
        setpA(publishedArticles);
      })
      .catch((err) => console.log('Error from AnalystReview: ' + err));
  }, []);

  useEffect(() => {
    console.log(claim);
    const filteredClaims = publishedArticles
      .map(article => article.claim)
      .filter((claimText): claimText is string => claimText !== undefined && claimText.toLowerCase().includes(claim.toLowerCase()));
      console.log('Current claim:', claim);
      console.log('All articles claims:', publishedArticles.map(article => article.claim));
      console.log('Filtered claims:', filteredClaims);
      setSuggestions(filteredClaims);
  }, [claim, articles]);

  const analyzeArticle = (article: Article, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentArticle(article);
    setClaim(article.claim || '');
    setEvidence(article.evidence || '');
    setTitle(article.title || '');
    setAuthor(article.author || '');
    setSource(article.source || '');
    setPublicationYear(article.publication_year?.toString() || '');
    setDOI(article.DOI || '');
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (currentArticle) {
      const updatedArticle = {
        ...currentArticle,
        claim,
        evidence,
        title,
        author,
        source,
        publicationYear: new Date(publicationYear),
        DOI,
        status: 'analyzed'
      };

      fetch(`https://cise-projecttest-backend.vercel.app/api/articles/${currentArticle._id}`, {
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
                <label htmlFor='title'>Title</label>
                <input
                  id='title'
                  name='title'
                  className='form-control'
                  value={title}
                  onChange={handleInputChange(setTitle)}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='author'>Author</label>
                <input
                  id='author'
                  name='author'
                  className='form-control'
                  value={author}
                  onChange={handleInputChange(setAuthor)}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='source'>Source</label>
                <input
                  id='source'
                  name='source'
                  className='form-control'
                  value={source}
                  onChange={handleInputChange(setSource)}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='publicationYear'>Publication Year</label>
                <input
                  id='publicationYear'
                  name='publicationYear'
                  className='form-control'
                  type='date'
                  value={publicationYear}
                  onChange={handleInputChange(setPublicationYear)}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='DOI'>DOI</label>
                <input
                  id='DOI'
                  name='DOI'
                  className='form-control'
                  value={DOI}
                  onChange={handleInputChange(setDOI)}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='claim'>Claim</label>
                <textarea
                  id='claim'
                  name='claim'
                  className='form-control'
                  rows={4}
                  value={claim}
                  onChange={handleInputChange(setClaim)}
                />
                {suggestions.length > 0 && (
                  <ul className='suggestions'>
                    {suggestions.map((suggestion, index) => (
                      <li key={index} onClick={() => setClaim(suggestion)}>{suggestion}</li>
                    ))}
                  </ul>
                )}
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
                  onChange={handleInputChange(setEvidence)}
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