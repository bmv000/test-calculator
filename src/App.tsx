/*
  

  // Функция для обработки отправки формы
  const onSubmit = async (data: FormData) => {
    try {
       
      // Получение статической информации о месте
      const staticResponse = await axios.get(`https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${data.venueSlug}/static`);
      const { coordinates } = staticResponse.data.venue_raw.location;

      // Получение динамической информации о месте
      const dynamicResponse = await axios.get(`https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${data.venueSlug}/dynamic`);
      const { order_minimum_no_surcharge, delivery_pricing, distance_ranges } = dynamicResponse.data.venue_raw.delivery_specs;

       
  
      // Расчет расстояния между пользователем и местом
      const distance = calculateDistance(data.userLatitude, data.userLongitude, coordinates[1], coordinates[0]);

      // Проверка на возможность доставки
      const distanceRange = distanceRanges.find(range => range.min <= distance && (range.max === 0 || distance < range.max));
      if (!distanceRange) {
        setErrorMessage('Доставка невозможна на указанное расстояние.');
        setTotalPrice(null);
        return;
      }
       
      // Расчет стоимости доставки
      const deliveryFee = delivery_pricing.base_price + distanceRange.a + (distanceRange.b * distance / 10);
      const smallOrderSurcharge = Math.max(0, order_minimum_no_surcharge - data.cartValue);
      const finalPrice = data.cartValue + deliveryFee + smallOrderSurcharge;

      setTotalPrice(finalPrice);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Произошла ошибка при расчете стоимости доставки.');
      setTotalPrice(null);
    }
  };*/



import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import styles from './App.module.css';

const App: React.FC = () => {
  // Инициализация useForm
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
//Состояние для хранения данных о месте проведения
  const [venueData1, setVenueData1] = useState<any>(null);
  const [venueData2, setVenueData2] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Состояние для вывода результатов
  const [outputs, setOutputs] = useState({
    cartValue: 0,
    smallOrderSurcharge: 0,
    deliveryFee: 0,
    deliveryDistance: 0,
    totalPrice: 0,
  });
  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        const response1 = await fetch(

          "/api/home-assignment-api/v1/venues/home-assignment-venue-tallinn/static"
          
        );
        if (!response1.ok) {
          throw new Error(`HTTP error! status: ${response1.status}`);
        }
        const data1 = await response1.json();
        console.log({data1})
        setVenueData1(data1);
        //dynamic
        const response2 = await fetch(

          
          "/api/home-assignment-api/v1/venues/home-assignment-venue-tallinn/dynamic"
        );
        if (!response2.ok) {
          throw new Error(`HTTP error! status: ${response2.status}`);
        }
        const data2 = await response2.json();
        console.log({data2})
        setVenueData2(data2);

      }
      catch (error) {
         console.log({error})
        // TODO: Fix
        //setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, []);
// Функция для получения геолокации пользователя
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords)
          const { latitude, longitude } = position.coords;
          // Обновляем значения полей формы
          setValue("userLatitude", latitude.toString());
          setValue("userLongitude", longitude.toString());
        },
        (error) => {
          console.error("Ошибка получения геолокации: ", error);
        }
      );
    } else {
      console.error("Геолокация не поддерживается этим браузером.");
    }
  };

// Функция для получения расстояния
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Радиус Земли в км
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //return R * c * 1000; // Возвращаем расстояние в метрах
    const distanceInMeters = R * c * 1000; // Расстояние в метрах
  return Math.round(distanceInMeters); // Округляем до ближайшего целого
  };

  const toRad = (value: number): number => {
    return value * Math.PI / 180;
  };  

  

  // Функция для обработки отправки формы
  const onSubmit = (data: any) => {
    console.log(data);
    
    const tallinLon = venueData1.venue_raw.location.coordinates[0];
    const tallinLat = venueData1.venue_raw.location.coordinates[1];
    console.log(tallinLat);
     console.log(tallinLon);

    let deliveryDistance: number = 0;
    if (data.userLatitude && data.userLongitude && tallinLat && tallinLon) {
      deliveryDistance = calculateDistance(tallinLat, tallinLon, Number(data.userLatitude), Number(data.userLongitude));
      console.log(deliveryDistance); // 4423 метров
    }

    const cartInCents = data.cartValue ? Number(data.cartValue) * 100 : 0;    

    const minlOrderSurcharge = venueData2.venue_raw.delivery_specs.order_minimum_no_surcharge;
    console.log(minlOrderSurcharge); //1000 центов

    const orderSurcharge = minlOrderSurcharge - cartInCents ;
    const smallOrderSurcharge =  orderSurcharge < 0 ? 0 : orderSurcharge;
  
    /*cartInCents < 1000 ? Math.max(500 - cartInCents, 0) : 0;*/
 
    const baseDeliveryFee = venueData2.venue_raw.delivery_specs.delivery_pricing.base_price; 
    console.log(baseDeliveryFee); //190 
  
    
    //Расчет доставки 
    /*const calculateDeliveryCost = (cartValue, deliveryDistance, distanceRanges) => {
      // Ищем соответствующий диапазон расстояний
      const distanceRange = distanceRanges.find(range => {
        return (
          (range.min <= deliveryDistance && deliveryDistance < range.max) ||
          (range.max === 0 && deliveryDistance >= range.min)
        );
      });

      if (!distanceRange) {
        return 0; // Если диапазон не найден, стоимость доставки равна 0
      }

      // Расчёт стоимости доставки
      const deliveryFee = deliveryDistance + distanceRange.a + (distanceRange.b * deliveryDistance) / 10;
    } 
   
      const distanceRange = venueData2.venue_raw.delivery_specs.delivery_pricing.distance_ranges
        console.log(distanceRange);*/
       
    const deliveryFee = 10;
            
      console.log(deliveryFee);
   
        

    
    const totalPrice = cartInCents + smallOrderSurcharge + deliveryFee;

    setOutputs({
      cartValue: cartInCents,
      smallOrderSurcharge,
      deliveryFee,
      deliveryDistance,
      totalPrice,
    });
  };

 
  return (
    <div className={styles.pc__page}>
     <span className={styles.pc__h1__span}><h1 className={styles.pc__h1}>Delivery Order Price Calculator</h1></span> 

      <form onSubmit={handleSubmit(onSubmit)} className={styles.pc__form}>
        
          <h3 className={styles.pc__h3}>Details</h3>
          <div>
            <label className={styles.pc__label}>
              Venue slug
             
 <select className={styles.pc__input}>

       <option value="home-assignment-venue-tallin"> home-assignment-venue-tallin</option>

     </select>

            </label>
          </div>
          <div>
            <label className={styles.pc__label}>
              Cart value (EUR)
              <Controller
                name="cartValue"
                control={control}
                rules={{
                  required: "Cart value is required",
                  pattern: {
                    value: /^[0-9]+(\.[0-9]{1,2})?$/,
                    message: "Invalid cart value",
                  },
                }}
                render={({ field }) => <input type="number" {...field} className={styles.pc__input}/>}
              />
              {errors.cartValue && <span>{errors.cartValue.message}</span>}
            </label>
          </div>
         <div>
      
        <label className={styles.pc__label}>
          User latitude
          <Controller
            name="userLatitude"
            control={control}
            rules={{
              required: "Latitude is required",
              pattern: {
                value: /^-?([1-8]?\d(\.\d+)?|90(\.0+)?|[-+]?(1[0-7]\d(\.\d+)?|180(\.0+)?))$/,
                message: "Invalid latitude",
              },
            }}
            render={({ field }) => <input type="number" {...field} className={styles.pc__input} />}
          />
          {errors.userLatitude && <span>{errors.userLatitude.message}</span>}
        </label>
      </div>
      <div>
        <label className={styles.pc__label}>
          User longitude
          <Controller 
            name="userLongitude"
            control={control}
            rules={{
              required: "Longitude is required",
              pattern: {
                value: /^-?((([1-9]?[0-9])(\.\d+)?|1[0-7][0-9](\.\d+)?|180(\.0+)?))$/,
                message: "Invalid longitude",
              },
            }}
            render={({ field }) => <input type="number" {...field}  className={styles.pc__input}/>}
          />
          {errors.userLongitude && <span>{errors.userLongitude.message}</span>}
        </label>
      </div>
      <div>
        <button type="button" onClick={getLocation} className={styles.pc__button}>
          Get Location
        </button>
      
    
            <button type="submit" className={styles.pc__button}>
              Calculate delivery price</button>
          </div>
        
      </form>

      <div>
        <h3 className={styles.pc__h3}>Price breakdown</h3>
        <p className={styles.pc__p}>
          Cart Value:{" "}
          <span className={styles.pc__span}>
            {(outputs.cartValue / 100).toFixed(2)} EUR
          </span>
        </p>
        <p className={styles.pc__p}>
          Delivery fee:{" "}
          <span className={styles.pc__span}>
            {(outputs.deliveryFee / 100).toFixed(2)} EUR
          </span>
        </p>
        <p className={styles.pc__p}>
          Delivery distance:{" "}
          <span className={styles.pc__span}>{outputs.deliveryDistance} m</span>
        </p>
        <p className={styles.pc__p}>
          Small order surcharge:{" "}
          <span className={styles.pc__span}>
            {(outputs.smallOrderSurcharge / 100).toFixed(2)} EUR
          </span>
        </p>
        <p className={styles.pc__p}>
          Total price:{" "}
          <span className={styles.pc__span}>
            {(outputs.totalPrice / 100).toFixed(2)} EUR
          </span>
        </p>
      </div>
    </div>
  );
};

export default App;




/*import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

const App: React.FC = () => {
  // Инициализация useForm
  const { control, handleSubmit, formState: { errors } } = useForm();

  // Состояние для вывода результатов
  const [outputs, setOutputs] = useState({
    cartValue: 0,
    smallOrderSurcharge: 0,
    deliveryFee: 0,
    deliveryDistance: 0,
    totalPrice: 0,
  });
  const {createProxyMiddleware}= require('http-proxy-middleware')
  module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://consumer-api.development.dev.woltapi.com',
      changeOrigin: true,
    })
  );
};


//Состояние для хранения данных о месте проведения
  const [venueData, setVenueData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Получение данных о месте проведения 
  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        const response = await fetch(

        "/api/v1/venues/home-assignment-venue-tallinn/static"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVenueData(data);
      }
      catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  // Функция для обработки отправки формы
  const onSubmit = (data: any) => {
    const cartInCents = data.cartValue ? Number(data.cartValue) * 100 : 0;
    const deliveryDistance = 177; // Захардкожено для примера

    const smallOrderSurcharge =
      cartInCents < 1000 ? Math.max(500 - cartInCents, 0) : 0;

    const deliveryFee = 190; // Захардкожено для примера

    const totalPrice = cartInCents + smallOrderSurcharge + deliveryFee;

    setOutputs({
      cartValue: cartInCents,
      smallOrderSurcharge,
      deliveryFee,
      deliveryDistance,
      totalPrice,
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Delivery Order Price Calculator</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h3>Details</h3>
          <div>
            <label>
              Venue slug
              <Controller
                name="venueSlug"
                control={control}
                rules={{ required: "Venue slug is required" }}
                render={({ field }) => <input {...field} />}
              />
              {errors.venueSlug && <span>{errors.venueSlug.message}</span>}
            </label>
          </div>
          <div>
            <label>
              Cart value (EUR)
              <Controller
                name="cartValue"
                control={control}
                rules={{
                  required: "Cart value is required",
                  pattern: {
                    value: /^[0-9]+(\.[0-9]{1,2})?$/,
                    message: "Invalid cart value",
                  },
                }}
                render={({ field }) => <input type="number" {...field} />}
              />
              {errors.cartValue && <span>{errors.cartValue.message}</span>}
            </label>
          </div>
          <div>
            <label>
              User latitude
              <Controller
                name="userLatitude"
                control={control}
                rules={{
                  required: "Latitude is required",
                  pattern: {
                    value: /^-?([1-8]?\d(\.\d+)?|90(\.0+)?|[-+]?(1[0-7]\d(\.\d+)?|180(\.0+)?))$/,
                    message: "Invalid latitude",
                  },
                }}
                render={({ field }) => <input type="number" {...field} />}
              />
              {errors.userLatitude && <span>{errors.userLatitude.message}</span>}
            </label>
          </div>
          <div>
            <label>
              User longitude
             
              <Controller
                name="userLongitude"
                control={control}
                rules={{
                  required: "Longitude is required",
                  pattern: {
                    value: /^-?((([1-9]?[0-9])(\.\d+)?|1[0-7][0-9](\.\d+)?|180(\.0+)?))$/,
                    message: "Invalid longitude",
                  },
                }}
                render={({ field }) => <input type="number" {...field} />}
                
              />
              {errors.userLongitude && <span>{errors.userLongitude.message}</span>}
            </label>
          </div>
          <div>
            <button type="submit">Get Location</button>
            <button type="submit">Calculate delivery price</button>

          </div>
        </div>
      </form>

      <div>
        <h3>Price breakdown</h3>
        <p>
          Cart Value:{" "}
          <span>
            {(outputs.cartValue / 100).toFixed(2)} EUR
          </span>
        </p>
        <p>
          Delivery fee:{" "}
          <span>
            {(outputs.deliveryFee / 100).toFixed(2)} EUR
          </span>
        </p>
        <p>
          Delivery distance:{" "}
          <span>{outputs.deliveryDistance} m</span>
        </p>
        <p>
          Small order surcharge:{" "}
          <span>
            {(outputs.smallOrderSurcharge / 100).toFixed(2)} EUR
          </span>
        </p>
        <p>
          Total price:{" "}
          <span>
            {(outputs.totalPrice / 100).toFixed(2)} EUR
          </span>
        </p>
      </div>
    </div>
  );
};

export default App;*/


/*import React, { useState } from "react";

const App: React.FC = () => {
  // State для хранения ввода
  const [venueSlug, setVenueSlug] = useState("");
  const [cartValue, setCartValue] = useState<number | "">("");
  const [userLatitude, setUserLatitude] = useState<number | "">("");
  const [userLongitude, setUserLongitude] = useState<number | "">("");
  const [outputs, setOutputs] = useState({
    cartValue: 0,
    smallOrderSurcharge: 0,
    deliveryFee: 0,
    deliveryDistance: 0,
    totalPrice: 0,
  });

  // Функция для обработки клика на "Calculate delivery price"
  const calculatePrice = () => {
    // Проверка на пустые значения и преобразование в числа
    const cartInCents = cartValue ? Number(cartValue) * 100 : 0;
    const deliveryDistance = 177; // Захардкожено для примера

    // Пример расчёта доплаты за маленький заказ
    const smallOrderSurcharge =
      cartInCents < 1000 ? Math.max(500 - cartInCents, 0) : 0;

    // Пример расчёта стоимости доставки
    const deliveryFee = 190; // Захардкожено для примера

    const totalPrice = cartInCents + smallOrderSurcharge + deliveryFee;

    setOutputs({
      cartValue: cartInCents,
      smallOrderSurcharge,
      deliveryFee,
      deliveryDistance,
      totalPrice,
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Delivery Order Price Calculator</h1>

      <div>
        <h3>Details</h3>
        <label>
          Venue slug
          <input
            data-test-id="venueSlug"
            type="text"
            value={venueSlug}
            onChange={(e) => setVenueSlug(e.target.value)}
          />
        </label>
        <label>
          Cart value (EUR)
          <input
            data-test-id="cartValue"
            type="number"
            value={cartValue}
            onChange={(e) =>
              setCartValue(e.target.value ? Number(e.target.value) : "")
            }
          />
        </label>
        <label>
          User latitude
          <input
            data-test-id="userLatitude"
            type="number"
            value={userLatitude}
            onChange={(e) =>
              setUserLatitude(e.target.value ? Number(e.target.value) : "")
            }
          />
        </label>
        <label>
          User longitude
          <input
            data-test-id="userLongitude"
            type="number"
            value={userLongitude}
            onChange={(e) =>
              setUserLongitude(e.target.value ? Number(e.target.value) : "")
            }
          />
        </label>
        <button onClick={calculatePrice} data-test-id="calculatePrice">
          Calculate delivery price
        </button>
      </div>

      <div>
        <h3>Price breakdown</h3>
        <p>
          Cart Value:{" "}
          <span data-raw-value={outputs.cartValue}>
            {(outputs.cartValue / 100).toFixed(2)} EUR
          </span>
        </p>
        <p>
          Delivery fee:{" "}
          <span data-raw-value={outputs.deliveryFee}>
            {(outputs.deliveryFee / 100).toFixed(2)} EUR
          </span>
        </p>
        <p>
          Delivery distance:{" "}
          <span data-raw-value={outputs.deliveryDistance}>
            {outputs.deliveryDistance} m
          </span>
        </p>
        <p>
          Small order surcharge:{" "}
          <span data-raw-value={outputs.smallOrderSurcharge}>
            {(outputs.smallOrderSurcharge / 100).toFixed(2)} EUR
          </span>
        </p>
        <p>
          Total price:{" "}
          <span data-raw-value={outputs.totalPrice}>
            {(outputs.totalPrice / 100).toFixed(2)} EUR
          </span>
        </p>
      </div>
    </div>
  );
};

export default App;*/
