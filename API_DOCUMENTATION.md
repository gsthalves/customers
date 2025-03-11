# Rising Survival API

## API URL

[https://api.risingsurvival.com](https://api.risingsurvival.com)

## Swagger

[Swagger API Docs](https://api.risingsurvival.com/docs)

## Endpoints

### Create a Customer

**Endpoint:** `POST /customer`

**Request Example:**
```sh
curl --request POST \
  --url https://api.risingsurvival.com/customer \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/10.0.0' \
  --data '{
    "name": "Gustavo Henrique Alves",
    "taxId": "42245682840",
    "birthDate": "1995-08-21",
    "email": "gsthalves@gmail.com",
    "phone": "14997065872",
    "notes": "Notes."
}'
```

### Update a Customer

**Endpoint:** `PUT /customer/{customerId}`

**Request Example:**
```sh
curl --request PUT \
  --url https://api.risingsurvival.com/customer/91d23b1f-f6e1-403a-a1bf-cb5d407ea3eb \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/10.0.0' \
  --data '{
    "name": "Gustavo Henrique Alves",
    "birthDate": "1995-09-21",
    "phone": "14997065872",
    "notes": "Updated notes."
}'
```

### Get a Customer by ID

**Endpoint:** `GET /customer/{customerId}`

**Request Example:**
```sh
curl --request GET \
  --url https://api.risingsurvival.com/customer/91d23b1f-f6e1-403a-a1bf-cb5d407ea3eb \
  --header 'User-Agent: insomnia/10.0.0'
```

### Search Customers by query

**Endpoint:** `GET /customer/search/{query}`

**Request Example:**
```sh
curl --request GET \
  --url https://api.risingsurvival.com/customer/search/alves \
  --header 'User-Agent: insomnia/10.0.0'
```

### Delete a Customer

**Endpoint:** `DELETE /customer/{customerId}`

**Request Example:**
```sh
curl --request DELETE \
  --url https://api.risingsurvival.com/customer/91d23b1f-f6e1-403a-a1bf-cb5d407ea3eb \
  --header 'User-Agent: insomnia/10.0.0'