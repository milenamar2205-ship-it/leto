import { useState, useEffect } from 'react';

function CoinsShop({ currentUser, setCurrentUser }) {
  const [coins, setCoins] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setCoins(currentUser.coins || 0);
    }
  }, [currentUser]);

  const promoOptions = [
    { discount: 5, cost: 100, code: 'COINS5' },
    { discount: 10, cost: 200, code: 'COINS10' },
    { discount: 30, cost: 500, code: 'COINS30' },
  ];

 // В CoinsShop.jsx обновляем функцию buyPromo
async function buyPromo(promo) {
  if (!currentUser) {
    setMessage('⚠️ Войдите в аккаунт!');
    setTimeout(() => setMessage(''), 3000);
    return;
  }

  if (coins < promo.cost) {
    setMessage(`❌ Недостаточно монет! Нужно ${promo.cost}, у вас ${coins}`);
    setTimeout(() => setMessage(''), 3000);
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('http://localhost:3001/api/coins/spend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        amount: promo.cost,
        promoCode: promo.code
      }),
    });

    const data = await response.json();

    if (data.success) {
      setCoins(data.coins);
      setCurrentUser({ ...currentUser, coins: data.coins });
      
      // Сообщаем, что промокод сохранён в аккаунте
      setMessage(`✅ Промокод ${data.promoCode} (скидка ${promo.discount}%) добавлен в ваш аккаунт! Используйте его в корзине.`);
      
      setTimeout(() => setMessage(''), 5000);
    } else {
      setMessage('❌ ' + data.message);
      setTimeout(() => setMessage(''), 3000);
    }
  } catch (error) {
    setMessage('❌ Ошибка сервера');
    setTimeout(() => setMessage(''), 3000);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="coins-shop">
      <div className="coins-balance">
        <h2>💰 {coins} монет</h2>
        <p>Зарабатывайте монеты за:</p>
        <ul>
          <li>🎮 Dino Runner: +50 монет за каждые 100 очков</li>
          <li>💬 Отзывы: +50 монет за отзыв</li>
          <li>🛒 Покупки: +10% от суммы покупки</li>
        </ul>
      </div>

      <div className="promo-shop">
        <h3>Обмен монет на промокоды</h3>
        <div className="promo-cards">
          {promoOptions.map((promo) => (
            <div className="promo-card" key={promo.code}>
              <div className="promo-discount">-{promo.discount}%</div>
              <div className="promo-cost">{promo.cost} 🪙</div>
              <button 
                onClick={() => buyPromo(promo)}
                disabled={loading || coins < promo.cost}
              >
                Купить
              </button>
            </div>
          ))}
        </div>
      </div>

      {message && (
        <p className={`promo-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default CoinsShop;