import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Article, DefaultEmptyArticle } from './Article';
import Link from 'next/link';
import ReactStars from 'react-stars'; // Assuming you're using react-stars for star ratings

function ShowArticleDetails() {
  const [article, setArticle] = useState<Article>(DefaultEmptyArticle);
  const [role, setRole] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);

  const id = useParams<{ id: string }>().id;
  const navigate = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);

    fetch(`http://localhost:8082/api/articles/${id}`)
      .then((res) => res.json())
      .then((json) => setArticle(json))
      .catch((err) => console.log('Error from ShowArticleDetails: ' + err));
  }, [id]);

  const onDeleteClick = (id: string) => {
    fetch(`http://localhost:8082/api/articles/${id}`, { method: 'DELETE' })
      .then((res) => {
        navigate.push('/');
      })
      .catch((err) => console.log('Error form ShowArticleDetails_deleteClick: ' + err));
  };

  const handleRatingSubmit = async (rating: number) => {
    try {
      await fetch(`http://localhost:8082/api/articles/${id}/rate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });
      alert('Rating submitted successfully');
    } catch (err) {
      console.error('Error submitting rating: ', err);
    }
  };

  const onStarClick = (newRating: number) => {
    setUserRating(newRating);  // Update the local state for the rating
    handleRatingSubmit(newRating);  // Submit the rating
  };

  // Calculate average rating
  const totalRatings = article.ratings?.length || 0;
  const averageRating = totalRatings
    ? (article.ratings!.reduce((sum, rating) => sum + rating, 0) / totalRatings).toFixed(1)
    : 'No ratings yet';

  return (
    <div className='ShowArticleDetails'>
      <div className='container'>
        <div className='row'>
        <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>Article&apos;s Record</h1>
            <p className='lead text-center'>View Article&apos;s Info</p>
            <hr />
          </div>
          <div className='col-md-11 d-flex justify-content-between align-items-center mb-4'>
            <Link href='/' className='btn btn-black btn-shift-right'>
              Show Article List
            </Link>
            <Link href='/signin' className='btn btn-black'>
              Sign In
            </Link>
          </div>
          <br />
          <div className='col-md-10 m-auto'>
            {/* Article details */}
            <table className='table table-hover table-dark table-striped table-bordered'>
              <tbody>
                <tr>
                  <th scope='row'>1</th>
                  <td>Title</td>
                  <td>{article.title}</td>
                </tr>
                <tr>
                  <th scope='row'>2</th>
                  <td>Author</td>
                  <td>{article.author}</td>
                </tr>
                <tr>
                  <th scope='row'>3</th>
                  <td>Source</td>
                  <td>{article.source}</td>
                </tr>
                <tr>
                  <th scope='row'>4</th>
                  <td>Publication Year</td>
                  <td>
                    {article.publication_year ? 
                    new Date(article.publication_year).getFullYear().toString() : 
                  'N/A'}
                  </td>
                </tr>
                <tr>
                  <th scope='row'>5</th>
                  <td>DOI</td>
                  <td>{article.DOI}</td>
                </tr>
                <tr>
                  <th scope='row'>6</th>
                  <td>Claim</td>
                  <td>{article.claim}</td>
                </tr>
                <tr>
                  <th scope='row'>7</th>
                  <td>Evidence</td>
                  <td>{article.evidence}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='col-md-10 m-auto'>
            <div className='rating-section'>
              <div className='stars'>
                <ReactStars
                  count={5}
                  value={Number(averageRating)}
                  onChange={onStarClick}
                  size={24}
                  color2={'#ffd700'}
                />
              </div>
              <div className='rating-info'>
                <p>Average Rating: {averageRating}</p>
                <p>Number of Ratings: {totalRatings}</p>
              </div>
            </div>
          </div>

          {role === 'admin' && (
            <div className='col-md-6 m-auto'>
              <button
                type='button'
                className='btn btn-danger btn-shift-right'
                onClick={() => {
                  onDeleteClick(article._id || "");
                }}
              >
                Delete Article
              </button>
            </div>
          )}
          {(role === 'admin' || role === 'analyst') && (
            <div className='col-md-6 m-auto'>
              <Link
                href={`/edit-article/${article._id}`}
                className='btn btn-black btn-edit-right'
              >
                Edit Article
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowArticleDetails;
