
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import styles from './App.module.css';

const App: React.FC = () => {
  // Initialization useForm
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
//location storage state
  const [venueData1, setVenueData1] = useState<any>(null);
  const [venueData2, setVenueData2] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // State for outputting results
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
        console.log({ data1 })
        setVenueData1(data1);
        //dynamic
        const response2 = await fetch(

          
          "/api/home-assignment-api/v1/venues/home-assignment-venue-tallinn/dynamic"
        );
        if (!response2.ok) {
          throw new Error(`HTTP error! status: ${response2.status}`);
        }
        const data2 = await response2.json();
        console.log({ data2 })
        setVenueData2(data2);

      }
      catch (error) {
        console.log({ error })
        
        
        } finally {
          setLoading(false);
        }
      };
      fetchVenueData();
    
  }, []);
  
// Function to get user's geolocation
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords)
          const { latitude, longitude } = position.coords;
// Updating form field values
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

// Function to get distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const distanceInMeters = R * c * 1000; // Distance in meters
  return Math.round(distanceInMeters); //Round to the nearest whole number

  };

  const toRad = (value: number): number => {
    return value * Math.PI / 180;
  }; 

  // Function for getting delivery price
  const getDeliveryParams = (distance: number, distanceRanges: DistanceRange[]): DistanceParam => {  
    for (let range of distanceRanges) {
        if (distance >= range.min && distance < range.max) {
            return { sum: range.a, additionalFee: range.b };
        }
    }

    return { sum: null, additionalFee: null }; // If the distance does not match any range
  }

  const calculateDeliveryCost = (baseDeliveryFee: number, deliveryDistance: number, sum: number, additionalFee: number): any => {  
    
    return baseDeliveryFee + sum + (additionalFee * deliveryDistance) / 10;
  }

  

  // Function to handle form submission
  const onSubmit = (data: any) => {
    console.log(data);
    
    const tallinLon = venueData1.venue_raw.location.coordinates[0];
    const tallinLat = venueData1.venue_raw.location.coordinates[1];
    console.log(tallinLat);
     console.log(tallinLon);

    let deliveryDistance: number = 0;
    if (data.userLatitude && data.userLongitude && tallinLat && tallinLon) {
      deliveryDistance = calculateDistance(tallinLat, tallinLon, Number(data.userLatitude), Number(data.userLongitude));
      console.log(deliveryDistance); // 4423 м
    }

    const cartInCents = data.cartValue ? Number(data.cartValue) * 100 : 0;    

    const minlOrderSurcharge = venueData2.venue_raw.delivery_specs.order_minimum_no_surcharge;
    console.log(minlOrderSurcharge); //1000 cents

    const orderSurcharge = minlOrderSurcharge - cartInCents ;
    const smallOrderSurcharge =  orderSurcharge < 0 ? 0 : orderSurcharge;
  
   
 
    const baseDeliveryFee = venueData2.venue_raw.delivery_specs.delivery_pricing.base_price; 
    console.log(baseDeliveryFee); //190 
  
    //if we want to check the delivery calculation
     deliveryDistance = 1000;  
    
    const deliveryParam: DistanceParam = getDeliveryParams(deliveryDistance, venueData2.venue_raw.delivery_specs.delivery_pricing.distance_ranges);

    if (deliveryParam.additionalFee === null || deliveryParam.sum === null) {
      alert('Sorry, delivery to you is not possible.');

      return;
    }

    const deliveryFee = calculateDeliveryCost(baseDeliveryFee, deliveryDistance, deliveryParam.sum, deliveryParam.additionalFee); 
    
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
        
          <h2 className={styles.pc__h2}>Details order</h2>
          <div>
            <label className={styles.pc__label}>
              <span className={styles.pc__label__span}>Venue slug</span> 
             
 <select className={styles.pc__input} data-test-id="venueSlug">

       <option value="home-assignment-venue-tallin"> Tallin </option>

     </select>

            </label>
          </div>
          <div>
            <label className={styles.pc__label}>
              <span className={styles.pc__label__span}>Cart value (EUR)</span>
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
              render={({ field }) => {
      const rawValue = field.value ? Math.round(parseFloat(field.value) * 100) : 0; // Преобразование в "сырое" значение

      return (
       
          <input
            data-raw-value={rawValue}
            data-test-id="cartValue"
            type="number"
            step="0.01" 
            {...field}
            className={styles.pc__input}
          />
          
        
      );
    }}
  />
  {errors.cartValue && <span className={styles.pc__required}>{errors.cartValue.message}</span>}
</label>
          </div>
         <div>
      
        <label className={styles.pc__label}>
          <span className={styles.pc__label__span}>User latitude</span> 
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
            render={({ field }) => <input  data-test-id="userLatitude" type="number" {...field} className={styles.pc__input} />}
          />
          {errors.userLatitude && <span className={styles.pc__required}>{errors.userLatitude.message}</span>}
        </label>
      </div>
      <div>
        <label className={styles.pc__label}>
           <span className={styles.pc__label__span}>User longitude</span>
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
            render={({ field }) => <input data-raw-value="field.value" data-test-id="userLongitude" type="number" {...field}  className={styles.pc__input}/>}
          />
          {errors.userLongitude && <span className={styles.pc__required}>{errors.userLongitude.message}</span>}
        </label>
      </div>
      <div className={styles.pc__button__div}>
        <button type="button" onClick={getLocation} className={styles.pc__button}>
          Get Location
        </button>
      
    
            <button type="submit" className={styles.pc__button}>
              Calculate delivery price</button>
          </div>
        
      </form>

      <ul data-test-id="price-breakdown">
        <h2 className={styles.pc__h2}>Price breakdown</h2>
        <li className={styles.pc__li}>
          Cart Value:{" "}
          <span className={styles.pc__span}
            data-raw-value={outputs.cartValue}>
            {(outputs.cartValue / 100).toFixed(2)} EUR
          </span>
        </li>
        <li className={styles.pc__li}>
          Delivery fee:{" "}
          <span className={styles.pc__span}
          data-raw-value={outputs.deliveryFee}>
            {(outputs.deliveryFee / 100).toFixed(2)} EUR
          </span>
        </li>
        <li className={styles.pc__li}
        data-raw-value={outputs.deliveryDistance}>
          Delivery distance:{" "}
          <span className={styles.pc__span}>{outputs.deliveryDistance} m</span>
        </li>
        <li className={styles.pc__li}>
          Small order surcharge:{" "}
          <span className={styles.pc__span}
          data-raw-value={outputs.smallOrderSurcharge}>
            {(outputs.smallOrderSurcharge / 100).toFixed(2)} EUR
          </span>
        </li>
        <li className={styles.pc__li__total}>
          Total price:{" "}
          <span className={styles.pc__span__total}
          data-raw-value={outputs.totalPrice}>
            {(outputs.totalPrice / 100).toFixed(2)} EUR
          </span>
        </li>
      </ul>
    </div>
  );
};

export default App;

// strong typing
interface DistanceRange {
  a: number;
  b: number;
  min: number;
  max: number;
}

interface DistanceParam {
  sum: number | null;
  additionalFee: number | null;
}
