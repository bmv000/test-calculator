
import React from "react";
import { useForm, Controller } from "react-hook-form";
import styles from '../../App.module.css';

const GetLocation = () => {
   const { control, setValue, formState: { errors } } = useForm();
  // Функция для получения геолокации пользователя
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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
  return (
    <div className={styles.pc__form}>
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
      </div>
    </div>
  )
}
  export default GetLocation;