import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Article, DefaultEmptyArticle } from "./Article";

const CreateArticleComponent = () => {
  const navigate = useRouter();
  const [article, setArticle] = useState<Article>(DefaultEmptyArticle);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setArticle({ ...article, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(article);
    fetch("http://localhost:8082/api/articles", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article)
    })
      .then((res) => {
        console.log(res);
        setArticle(DefaultEmptyArticle);
        navigate.push("/");
      })
      .catch((err) => {
        console.log('Error from CreateArticle: ' + err);
      });
  };

  return (
    <div className="CreateArticle">
      <div className="container">
        <div className="row">
          <div className='col-md-12'>
            <h1 className="display-4 text-center">Add Article</h1>
            <p className="lead text-center">Create new article</p>
          </div>
          <div className='col-md-11 d-flex justify-content-between align-items-center mb-4'>
            <Link href='/' className='btn btn-black btn-shift-right'>
              Show Article List
            </Link>
            <Link href='/signin' className='btn btn-black'>
              Sign In
            </Link>
          </div>
          <div className="col-md-10 m-auto">
            <form noValidate onSubmit={onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Article Title"
                  name="title"
                  className="form-control"
                  value={article.title}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Author"
                  name="author"
                  className="form-control"
                  value={article.author}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Source"
                  name="source"
                  className="form-control"
                  value={article.source}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <input
                  type="date"
                  placeholder="Publication Year"
                  name="publication_year"
                  className="form-control"
                  value={article.publication_year?.toString()}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <input
                  type="text"
                  placeholder="DOI"
                  name="DOI"
                  className="form-control"
                  value={article.DOI}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your Email"
                  name="submitterEmail"
                  className="form-control"
                  value={article.submitterEmail}
                  onChange={onChange}
                />
              </div>
              <br />
              <button
                type="submit"
                className="btn btn-black mt-4 mb-4 w-100"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticleComponent;