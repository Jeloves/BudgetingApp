

const form = new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});



class MyClass {
    #formatter = new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    #locale = 'en-US';
    #currency = 'USD';
    parseCurrencyToFloat(currencyString) {
        let floatString = ''
        for (let char of currencyString) {
            switch (this.#currency) {
                case 'USD': {
                    if (char !== '$' && char !== ',') {
                        floatString += char;
                    }
                    break;
                }
            }
        }
        return parseFloat(floatString)
    }
}

const classy = new MyClass();
const currencyString = form.format(3.45);
console.log(`CurrencyString Param: ${currencyString}`);
console.log(`Float output: ${classy.parseCurrencyToFloat(currencyString)}`);


const float1 = 56.76;
const float2 = 34.44;


