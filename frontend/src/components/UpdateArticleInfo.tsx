// UpdateBookInfo.tsx (renamed to UpdateArticleInfo.tsx)
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Article, DefaultEmptyArticle } from './Article';
import Link from 'next/link';

function UpdateArticleInfo() {
  const [article, setArticle] = useState<Article>(DefaultEmptyArticle);
  const id = useParams<{ id: string }>().id;
  const router = useRouter();

  useEffect(() => {
    fetch(`https://cise-project-backend.vercel.app/api/articles/${id}`)
      .then((res) => res.json())
      .then((json) => setArticle(json))
      .catch((err) => console.log('Error from UpdateArticleInfo: ' + err));
  }, [id]);

  const inputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setArticle({ ...article, [event.target.name]: event.target.value });
  };

  const textAreaOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setArticle({ ...article, [event.target.name]: event.target.value });
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetch(`https://cise-project-backend.vercel.app/api/articles/${id}`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article)
    })
      .then(() => router.push(`/show-article/${id}`))
      .catch((err) => console.log('Error from UpdateArticleInfo: ' + err));
  };

  return (
    <div className='UpdateArticleInfo'>
      <div className='container'>
        <div className='row'>
        <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>Edit Article</h1>
            <p className='lead text-center'>Update Article&apos;s Info</p>
          </div>
          <div className='col-md-11 d-flex justify-content-between align-items-center mb-4'>
            <Link href='/' className='btn btn-black btn-shift-right'>
              Show Article List
            </Link>
            <Link href='/signin' className='btn btn-black'>
              Sign In
            </Link>
          </div>
        </div>

        <div className='col-md-8 m-auto'>
          <form noValidate onSubmit={onSubmit}>
            <div className='form-group'>
              <label htmlFor='title'>Title</label>
              <input
                type='text'
                placeholder='Title of the Article'
                name='title'
                className='form-control'
                value={article.title}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className='form-group'>
              <label htmlFor='author'>Author</label>
              <input
                type='text'
                placeholder='Author'
                name='author'
                className='form-control'
                value={article.author}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className='form-group'>
              <label htmlFor='source'>Source</label>
              <input
                type='text'
                placeholder='Source'
                name='source'
                className='form-control'
                value={article.source}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className='form-group'>
              <label htmlFor='publication_year'>Publication Year</label>
              <input
                type='date'
                placeholder='Publication Year'
                name='publication_year'
                className='form-control'
                value={article.publication_year?.toString()}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className='form-group'>
              <label htmlFor='DOI'>DOI</label>
              <input
                type='text'
                placeholder='DOI'
                name='DOI'
                className='form-control'
                value={article.DOI}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className='form-group'>
              <label htmlFor='claim'>Claim</label>
              <textarea
                placeholder='Claim'
                name='claim'
                className='form-control'
                value={article.claim}
                onChange={textAreaOnChange}
              />
            </div>
            <br />
            
            <div className='form-group'>
              <label htmlFor='evidence'>Evidence</label>
              <textarea
                placeholder='Evidence'
                name='evidence'
                className='form-control'
                value={article.evidence}
                onChange={textAreaOnChange}
              />
            </div>
            <br />

            <button
              type='submit'
              className="btn btn-black mt-4 mb-4 w-100"
            >
              Update Article
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateArticleInfo;