How to install:

This project was bootstrapped with Create React App

In the project directory, you can run:
   `npm install`
    `npm start`

Runs the app in the development mode.
Open [http://localhost:3000] to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.


How to use:
This web application is designed to calculate the total delivery cost of your order, including the cost of goods, any additional fees, and delivery charges. Please follow the steps below to use the calculator.
1.	Select the Destination
	- In the "Details order" section, locate the "Venue slug" field.
	- From the dropdown list, select "Tallin".
2.	Enter Cart Value
	- In the "Cart value (EUR)" field, input the total cost of your goods in euros.
    - Note that this field accepts numerical input, supporting decimal values up to two decimal places.
3.	Input User Geolocation
    - In the "User latitude" and "User longitude" fields, enter the latitude and longitude of your location.
	If you're unsure of your coordinates, you can obtain them automatically by clicking the "Get Location" button.
	Upon clicking this button, the application will request access to your geolocation.
	After obtaining the data, the latitude and longitude fields will be automatically populated with the corresponding values.
4.	Submit the Form
	After entering all the required information, click the "Calculate delivery price" button to calculate the delivery cost.
5.	View Results
	After submitting the form, you will see a "Price breakdown" section displaying the following details:
	- Cart Value: The cost of your goods.
    - Delivery fee: The delivery charge.
    - Delivery distance: The delivery distance in meters.
    - Small order surcharge: Additional charge for small orders (if applicable).
    - Total price: The total cost of the order, including all fees and delivery charges.
Notes:
•	All fields are required.
•	If you do not provide geolocation, the application will not be able to calculate the exact delivery cost.
•	Ensure that the entered data is accurate to obtain an accurate calculation.

