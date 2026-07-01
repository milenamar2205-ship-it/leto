import { useState, useEffect } from 'react';

function ProductCard({ product, onClose, currentUser, setCurrentUser, addToCart, toggleFavorite, favorites }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [productRating, setProductRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (product && favorites) {
      setIsFavorite(favorites.includes(product.id));
    }
    if (product) {
      fetchReviews();
    }
  }, [product, favorites]);

  async function fetchReviews() {
    try {
      const response = await fetch(`http://localhost:3001/api/reviews/${product.id}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
        setReviewsCount(data.reviews.length);
        
        if (data.reviews.length > 0) {
          const total = data.reviews.reduce((sum, r) => sum + r.rating, 0);
          const avg = total / data.reviews.length;
          setProductRating(Math.round(avg * 10) / 10);
        } else {
          setProductRating(0);
        }
        
        if (currentUser) {
          const existing = data.reviews.find(r => r.userId === currentUser.id);
          setUserReview(existing || null);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
      setReviewMessage('❌ Ошибка загрузки отзывов');
      setTimeout(() => setReviewMessage(''), 3000);
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      setReviewMessage('⚠️ Чтобы оставить отзыв, войдите в аккаунт!');
      setTimeout(() => setReviewMessage(''), 3000);
      return;
    }

    if (!newReview.trim()) {
      setReviewMessage('⚠️ Введите текст отзыва');
      setTimeout(() => setReviewMessage(''), 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          userId: currentUser.id,
          userName: currentUser.nickname || currentUser.login,
          rating: newRating,
          text: newReview.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReviewMessage('✅ Отзыв добавлен! +50 монет 🪙');
        setNewReview('');
        setNewRating(5);
        await fetchReviews();
        
        if (data.coins !== undefined && setCurrentUser) {
          const updatedUser = { ...currentUser, coins: data.coins };
          setCurrentUser(updatedUser);
        }
        
        setTimeout(() => setReviewMessage(''), 3000);
      } else {
        setReviewMessage('❌ ' + data.message);
        setTimeout(() => setReviewMessage(''), 3000);
      }
    } catch (error) {
      console.error('❌ Ошибка при отправке отзыва:', error);
      setReviewMessage('❌ Ошибка соединения с сервером');
      setTimeout(() => setReviewMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleFavorite = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!currentUser) {
      setReviewMessage('⚠️ Войдите в аккаунт, чтобы добавить в избранное!');
      setTimeout(() => setReviewMessage(''), 3000);
      return;
    }

    try {
      const isCurrentlyFavorite = favorites.includes(product.id);
      
      const url = 'http://localhost:3001/api/favorites';
      const method = isCurrentlyFavorite ? 'DELETE' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          productId: product.id
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toggleFavorite(product.id);
        setIsFavorite(!isCurrentlyFavorite);
        setReviewMessage(isCurrentlyFavorite ? '✅ Удалено из избранного' : '✅ Добавлено в избранное');
        setTimeout(() => setReviewMessage(''), 2000);
      } else {
        setReviewMessage('❌ ' + data.message);
        setTimeout(() => setReviewMessage(''), 3000);
      }
    } catch (error) {
      console.error('❌ Ошибка при работе с избранным:', error);
      setReviewMessage('❌ Ошибка сервера');
      setTimeout(() => setReviewMessage(''), 3000);
    }
  };

  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!currentUser) {
      setReviewMessage('⚠️ Войдите в аккаунт, чтобы добавить в корзину!');
      setTimeout(() => setReviewMessage(''), 3000);
      return;
    }
    
    addToCart(product.id);
    setReviewMessage('✅ Товар добавлен в корзину!');
    setTimeout(() => setReviewMessage(''), 2000);
  };

  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleStarClick(star) {
    if (!currentUser) {
      setReviewMessage('⚠️ Войдите в аккаунт, чтобы оценить товар!');
      setTimeout(() => setReviewMessage(''), 3000);
      return;
    }
    setNewRating(star);
  }

  function handleTextChange(e) {
    e.stopPropagation();
    setNewReview(e.target.value);
  }

  if (!product) return null;

  return (
    <div className="product-modal-overlay" onClick={handleOverlayClick}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close" 
          onClick={(e) => { 
            e.stopPropagation(); 
            onClose(); 
          }}
        >
          ✕
        </button>

        <div className="modal-content">
          <div className="modal-image">
            <div className="product-image-placeholder">🖼️ IMG</div>
          </div>

          <div className="modal-info">
            <h2>{product.title}</h2>
            <p className="modal-meta">{product.category} / {product.universe}</p>
            
            <div className="modal-rating">
              <span className="stars">{renderStars(productRating)}</span>
              <span className="rating-text">
                {productRating > 0 ? productRating.toFixed(1) : 'Нет оценок'}
                {reviewsCount > 0 ? ` (${reviewsCount} ${reviewsCount === 1 ? 'отзыв' : reviewsCount < 5 ? 'отзыва' : 'отзывов'})` : ''}
              </span>
            </div>

            <p className="modal-price">{product.price.toLocaleString("ru-RU")} ₽</p>
            
            <p className="modal-description">{product.description || 'Описание отсутствует'}</p>

            <div className="modal-actions">
              <button 
                className={`modal-favorite ${isFavorite ? 'active' : ''}`}
                onClick={handleToggleFavorite}
                type="button"
              >
                {isFavorite ? '♥' : '♡'}
                <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
              </button>

              <button 
                className="modal-cart" 
                onClick={handleAddToCart}
                type="button"
              >
                🛒 В корзину
              </button>
            </div>

            <div className="modal-reviews">
              <h3>Отзывы ({reviewsCount})</h3>

              {currentUser && !userReview ? (
                <form className="review-form" onSubmit={handleSubmitReview}>
                  <div className="review-rating">
                    <span>Ваша оценка:</span>
                    <div className="star-buttons">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${star <= newRating ? 'active' : ''}`}
                          onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation(); 
                            handleStarClick(star); 
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Напишите ваш отзыв..."
                    value={newReview}
                    onChange={handleTextChange}
                    onClick={(e) => e.stopPropagation()}
                    rows="3"
                    disabled={loading}
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? 'Отправка...' : 'Отправить отзыв'}
                  </button>
                </form>
              ) : currentUser && userReview ? (
                <p className="review-already">✅ Вы уже оставили отзыв на этот товар</p>
              ) : (
                <p className="review-login">🔒 Войдите в аккаунт, чтобы оставить отзыв</p>
              )}

              {reviewMessage && (
                <p className={`review-message ${reviewMessage.includes('✅') ? 'success' : 'error'}`}>
                  {reviewMessage}
                </p>
              )}

              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="no-reviews">📝 Пока нет отзывов. Будьте первым!</p>
                ) : (
                  reviews.map((review) => (
                    <div className="review-item" key={review.id}>
                      <div className="review-header">
                        <strong>{review.userName}</strong>
                        <span className="review-date">
                          {new Date(review.date).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <p className="review-text">{review.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
