import React, { useState } from "react";
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

export default App;





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
