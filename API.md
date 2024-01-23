## API DOCUMENTATION

### General

All API functions are stored into "api" folder

### Lists of API functions

#### 1. Auth API - auth.js

##### Create business account

Function: registerBusiness
Required input:

```javascript
{
  email: "business-email",
  password: "business-password"
}
```

Output: It will set the "authorization value" in the localstorage with JWT token and 30 mins expiry

##### Login business account

Function: loginBusiness
Required input:

```javascript
{
 identifier: "business-email",
 password: "business-password"
}
```

Output: It will set the "authorization value" in the localstorage with JWT token and 30 mins expiry

#### 2. Restaurant API - restaurant.js

##### Add restaurant

Function: addRestaurant
Required input:

```javascript

restaurant {
	owner: {
		email: "",
		password: "",	
	}
	name: "restaurant-name",
	route: "restaurant-route",
	restaurant_contact: {
		phone: "123456789",
    		address: "1213 Finch Avenue",
    		provinceOrState: "Ontario",
    		city: "Toronto",
    		postalCode: "N1M 1CA",	
	}
	"restaurant_description" : {
    		aboutDescription: "About description website",
   	 	bannerURL: "bannerURLImage",

	}
	"restaurant_categories: ["dessert", "main"],
	"restaurant_dishes": [{
		"category_id": 0,
		"name": 
		"price": 
	}]
	"hours": {
		"monday": {"open": 08:00, "close": "23:00"},
		"tuesday": {"open": 08:00, "close": "23:00"},
		"wednesday": {"open": 08:00, "close": "23:00"},
		"thursday": {"open": 08:00, "close": "23:00"},
		"friday": {"open": 08:00, "close": "23:00"},
		"saturday": {"open": 08:00, "close": "23:00"},
		"sunday": {"open": 08:00, "close": "23:00"},
	}
}
```

Output:

```javascript
{
"id":11,
"attributes": { "name":"example-restaurant",
    "createdAt":"2024-01-21T00:17:17.792Z",
    "updatedAt":"2024-01-21T00:17:17.792Z",
    "publishedAt":"2024-01-21T00:17:17.689Z",
    "route":"unique-website-route"}
}
```

#### Get restaurant based on route

Function: getRestaurantByRoute
Required Input:

```javascript
"unique-website-route"
```

Output:

```javascript
{"id":11,
"attributes":{
  "name":"example-restaurant",
  "createdAt":"2024-01-21T00:17:17.792Z",
  "updatedAt":"2024-01-21T00:17:17.792Z",
  "publishedAt":"2024-01-21T00:17:17.689Z",
  "route":"unique-website-route",
  "restaurant_contact":{
      "data":{
          "id":14,
          "attributes":{
              "phone":"123456789",
              "address":"1213 Finch Avenue",
              "provinceOrState":"Ontario",
              "city":"Toronto",
              "postalCode":"N1M 1CA",
              "createdAt":"2024-01-21T00:17:17.203Z",
              "updatedAt":"2024-01-21T00:17:17.203Z",
              "publishedAt":"2024-01-21T00:17:17.201Z"
              }
            }
      },
  "restaurant_description":{
      "data":{
          "id":12,
          "attributes":{
'            "aboutDescription":"About description website",
             "bannerURL":"bannerURLImage",
             "createdAt":"2024-01-21T00:17:17.379Z",
             "updatedAt":"2024-01-21T00:17:17.379Z",
             "publishedAt":"2024-01-21T00:17:17.378Z"}
          }
      },
  "website":{
      "data":{
          "id":12,
          "attributes":{
              "websiteURL":"unique-website-route",
              "createdAt":"2024-01-21T00:17:17.534Z",
              "updatedAt":"2024-01-21T00:17:17.534Z",
              "publishedAt":"2024-01-21T00:17:17.533Z"}
          }
  },
  "menu":{
      "data":null}
  }}
```
