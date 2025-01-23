import requests

def get_exchange_rates():
    url = "http://api.nbp.pl/api/exchangerates/tables/A/?format=json"
    response = requests.get(url)
    if response.status_code != 200:
        return {"error": "Failed to fetch exchange rates"}
    
    data = response.json()
    rates = {rate['code']: rate['mid'] for rate in data[0]['rates'] if rate['code'] in ['USD', 'EUR']}
    return rates

def convert_currency(amount_pln, currency):
    rates = get_exchange_rates()
    if "error" in rates:
        return rates
    
    if currency not in rates:
        return {"error": "Unsupported currency"}
    
    converted_amount = round(amount_pln / rates[currency], 2)
    return {currency: converted_amount}
